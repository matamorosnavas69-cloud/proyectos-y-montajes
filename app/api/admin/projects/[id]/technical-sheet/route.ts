import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';
import { validateSpecifications } from '@/lib/validations/specifications';

interface MaterialPayload {
  name?: string | null;
  supplier?: string | null;
  reference?: string | null;
  quantity?: number | string | null;
  unit?: string | null;
  status?: string | null;
  notes?: string | null;
}

interface MilestonePayload {
  name?: string | null;
  description?: string | null;
  plannedDate?: string | Date | null;
  actualDate?: string | Date | null;
  responsible?: string | null;
  status?: string | null;
}

interface QualityCheckPayload {
  item?: string | null;
  status?: string | null;
  observation?: string | null;
  checkDate?: string | Date | null;
  responsible?: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        technicalSheet: {
          include: {
            materials: { orderBy: { order: 'asc' } },
            milestones: { orderBy: { order: 'asc' } },
            qualityChecks: { orderBy: { order: 'asc' } },
            revisions: { orderBy: { createdAt: 'desc' } },
          },
        },
        images: { orderBy: { order: 'asc' } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al obtener la ficha técnica';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const {
      projectData,
      sheetData,
      materials,
      milestones,
      qualityChecks,
      expectedVersion,
    } = body;

    // Check project and existing sheet before proceeding
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { technicalSheet: true },
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Optimistic Concurrency Control (Race Condition Prevention)
    if (typeof expectedVersion === 'number' && existingProject.technicalSheet) {
      const currentVersion = existingProject.technicalSheet.version;
      if (currentVersion > expectedVersion) {
        return NextResponse.json(
          {
            error: 'Conflicto de concurrencia detectado',
            message: 'El expediente fue modificado por otra sesión o proceso más reciente. Por favor recargue antes de continuar.',
            currentVersion,
            expectedVersion,
            conflict: true,
          },
          { status: 409 }
        );
      }
    }

    // Validate Specifications JSON against category schema
    const targetCategory = projectData?.category || existingProject.category;
    let validatedSpecs: Record<string, unknown> | undefined = undefined;
    if (sheetData?.specifications !== undefined) {
      try {
        validatedSpecs = validateSpecifications(targetCategory, sheetData.specifications);
      } catch (validationErr: unknown) {
        const msg = validationErr instanceof Error ? validationErr.message : 'Especificaciones inválidas';
        return NextResponse.json(
          { error: 'Validación de especificaciones fallida', message: msg },
          { status: 422 }
        );
      }
    }

    // State Machine Transition Validation
    const currentSheetStatus = existingProject.technicalSheet?.sheetStatus || 'DRAFT';
    const targetSheetStatus = sheetData?.sheetStatus;

    const VALID_SHEET_TRANSITIONS: Record<string, string[]> = {
      DRAFT: ['DRAFT', 'IN_PROGRESS', 'ARCHIVED'],
      IN_PROGRESS: ['IN_PROGRESS', 'READY_FOR_REVIEW', 'DRAFT', 'ARCHIVED'],
      READY_FOR_REVIEW: ['READY_FOR_REVIEW', 'APPROVED', 'IN_PROGRESS', 'ARCHIVED'],
      APPROVED: ['APPROVED', 'ISSUED', 'READY_FOR_REVIEW', 'ARCHIVED'],
      ISSUED: ['ISSUED', 'ARCHIVED', 'IN_PROGRESS'],
      ARCHIVED: ['ARCHIVED', 'DRAFT', 'IN_PROGRESS'],
    };

    if (targetSheetStatus && targetSheetStatus !== currentSheetStatus) {
      const allowed = VALID_SHEET_TRANSITIONS[currentSheetStatus] || [];
      if (!allowed.includes(targetSheetStatus)) {
        return NextResponse.json(
          {
            error: 'Transición de estado de expediente no permitida',
            message: `No es posible pasar directamente de "${currentSheetStatus}" a "${targetSheetStatus}".`,
            allowedTransitions: allowed,
          },
          { status: 422 }
        );
      }
    }

    // Revision Control Guard: If modifying an already ISSUED technical sheet, require new revision
    const isModifyingContent =
      sheetData?.specifications !== undefined ||
      Array.isArray(materials) ||
      Array.isArray(milestones) ||
      Array.isArray(qualityChecks);

    if (
      currentSheetStatus === 'ISSUED' &&
      isModifyingContent &&
      (!sheetData?.revision || sheetData.revision === existingProject.technicalSheet?.revision) &&
      targetSheetStatus !== 'ARCHIVED'
    ) {
      return NextResponse.json(
        {
          error: 'Ficha técnica emitida oficialmente',
          message: `La ficha técnica ya fue emitida como ${existingProject.technicalSheet?.revision}. Para aplicar modificaciones de ingeniería debe incrementar el número de revisión (ej. R02).`,
          currentRevision: existingProject.technicalSheet?.revision,
        },
        { status: 422 }
      );
    }

    // Use Prisma transaction to guarantee atomic execution across all modules
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update project metadata
      if (projectData && Object.keys(projectData).length > 0) {
        await tx.project.update({
          where: { id },
          data: {
            title: projectData.title !== undefined ? projectData.title.trim() : undefined,
            category: projectData.category !== undefined ? projectData.category.trim() : undefined,
            client: projectData.client !== undefined ? (projectData.client ? projectData.client.trim() : null) : undefined,
            location: projectData.location !== undefined ? (projectData.location ? projectData.location.trim() : null) : undefined,
            city: projectData.city !== undefined ? (projectData.city ? projectData.city.trim() : null) : undefined,
            sqMeters: projectData.sqMeters !== undefined ? (projectData.sqMeters ? Number(projectData.sqMeters) : null) : undefined,
            duration: projectData.duration !== undefined ? (projectData.duration ? projectData.duration.trim() : null) : undefined,
            status: projectData.status !== undefined ? projectData.status : undefined,
            budget: projectData.budget !== undefined ? (projectData.budget ? Number(projectData.budget) : null) : undefined,
            startDate: projectData.startDate !== undefined ? (projectData.startDate ? new Date(projectData.startDate) : null) : undefined,
            deliveryDate: projectData.deliveryDate !== undefined ? (projectData.deliveryDate ? new Date(projectData.deliveryDate) : null) : undefined,
            director: projectData.director !== undefined ? (projectData.director ? projectData.director.trim() : null) : undefined,
            commercialRep: projectData.commercialRep !== undefined ? (projectData.commercialRep ? projectData.commercialRep.trim() : null) : undefined,
            internalCode: projectData.internalCode !== undefined ? (projectData.internalCode ? projectData.internalCode.trim() : null) : undefined,
            description: projectData.description !== undefined ? (projectData.description ? projectData.description.trim() : null) : undefined,
            shortDescription: projectData.shortDescription !== undefined ? (projectData.shortDescription ? projectData.shortDescription.trim() : null) : undefined,
            published: projectData.published !== undefined ? Boolean(projectData.published) : undefined,
            featured: projectData.featured !== undefined ? Boolean(projectData.featured) : undefined,
            portfolioOrder: projectData.portfolioOrder !== undefined ? Number(projectData.portfolioOrder) : undefined,
            mainImage: projectData.mainImage !== undefined ? projectData.mainImage : undefined,
            gallery: Array.isArray(projectData.gallery) ? projectData.gallery : undefined,
            version: { increment: 1 },
          },
        });
      }

      // 2. Manage TechnicalSheet with Concurrency increment and Status logic
      let sheet = existingProject.technicalSheet;

      const sheetStatus = sheetData?.sheetStatus;
      const isApproving = sheetStatus === 'APPROVED' && sheet?.sheetStatus !== 'APPROVED';
      const isIssuing = sheetStatus === 'ISSUED' && sheet?.sheetStatus !== 'ISSUED';

      if (!sheet) {
        sheet = await tx.technicalSheet.create({
          data: {
            projectId: id,
            revision: sheetData?.revision || 'R01',
            currentRevision: sheetData?.revision || 'R01',
            sheetStatus: sheetStatus || 'DRAFT',
            specifications: (validatedSpecs ?? sheetData?.specifications) || {},
            observations: sheetData?.observations || null,
            pendingItems: sheetData?.pendingItems || null,
            deliveryDate: sheetData?.deliveryDate ? new Date(sheetData.deliveryDate) : null,
            deliveryNotes: sheetData?.deliveryNotes || null,
            deliveryClient: sheetData?.deliveryClient || null,
            deliveryDirector: sheetData?.deliveryDirector || null,
            deliveryInspector: sheetData?.deliveryInspector || null,
            deliveryStatus: sheetData?.deliveryStatus || 'PENDIENTE',
            generatedBy: authState.email || authState.userId,
            approvedAt: isApproving ? new Date() : undefined,
            approvedBy: isApproving ? (authState.email || authState.userId) : undefined,
            issuedAt: isIssuing ? new Date() : undefined,
            issuedBy: isIssuing ? (authState.email || authState.userId) : undefined,
            version: 1,
          },
        });
      } else if (sheetData && Object.keys(sheetData).length > 0) {
        sheet = await tx.technicalSheet.update({
          where: { id: sheet.id },
          data: {
            revision: sheetData.revision !== undefined ? sheetData.revision : undefined,
            currentRevision: sheetData.revision !== undefined ? sheetData.revision : undefined,
            sheetStatus: sheetStatus !== undefined ? sheetStatus : undefined,
            specifications: validatedSpecs !== undefined ? validatedSpecs : (sheetData.specifications !== undefined ? sheetData.specifications : undefined),
            observations: sheetData.observations !== undefined ? sheetData.observations : undefined,
            pendingItems: sheetData.pendingItems !== undefined ? sheetData.pendingItems : undefined,
            deliveryDate: sheetData.deliveryDate !== undefined ? (sheetData.deliveryDate ? new Date(sheetData.deliveryDate) : null) : undefined,
            deliveryNotes: sheetData.deliveryNotes !== undefined ? sheetData.deliveryNotes : undefined,
            deliveryClient: sheetData.deliveryClient !== undefined ? sheetData.deliveryClient : undefined,
            deliveryDirector: sheetData.deliveryDirector !== undefined ? sheetData.deliveryDirector : undefined,
            deliveryInspector: sheetData.deliveryInspector !== undefined ? sheetData.deliveryInspector : undefined,
            deliveryStatus: sheetData.deliveryStatus !== undefined ? sheetData.deliveryStatus : undefined,
            approvedAt: isApproving ? new Date() : undefined,
            approvedBy: isApproving ? (authState.email || authState.userId) : undefined,
            issuedAt: isIssuing ? new Date() : undefined,
            issuedBy: isIssuing ? (authState.email || authState.userId) : undefined,
            version: { increment: 1 },
          },
        });
      }

      const technicalSheetId = sheet.id;

      // 3. Update Materials atomically if provided
      if (Array.isArray(materials)) {
        await tx.material.deleteMany({ where: { technicalSheetId } });
        if (materials.length > 0) {
          await tx.material.createMany({
            data: materials.map((m: MaterialPayload, idx: number) => ({
              technicalSheetId,
              name: m.name?.trim() || 'Material sin nombre',
              supplier: m.supplier?.trim() || null,
              reference: m.reference?.trim() || null,
              quantity: m.quantity ? Number(m.quantity) : null,
              unit: m.unit?.trim() || null,
              status: m.status || 'PENDIENTE',
              notes: m.notes?.trim() || null,
              order: idx,
            })),
          });
        }
      }

      // 4. Update Milestones atomically if provided
      if (Array.isArray(milestones)) {
        await tx.milestone.deleteMany({ where: { technicalSheetId } });
        if (milestones.length > 0) {
          await tx.milestone.createMany({
            data: milestones.map((ms: MilestonePayload, idx: number) => ({
              technicalSheetId,
              name: ms.name?.trim() || 'Hito',
              description: ms.description?.trim() || null,
              plannedDate: ms.plannedDate ? new Date(ms.plannedDate) : null,
              actualDate: ms.actualDate ? new Date(ms.actualDate) : null,
              responsible: ms.responsible?.trim() || null,
              status: ms.status || 'PENDIENTE',
              order: idx,
            })),
          });
        }
      }

      // 5. Update Quality Checks atomically if provided
      if (Array.isArray(qualityChecks)) {
        await tx.qualityCheck.deleteMany({ where: { technicalSheetId } });
        if (qualityChecks.length > 0) {
          await tx.qualityCheck.createMany({
            data: qualityChecks.map((qc: QualityCheckPayload, idx: number) => ({
              technicalSheetId,
              item: qc.item?.trim() || 'Ítem de control',
              status: qc.status || 'PENDIENTE',
              observation: qc.observation?.trim() || null,
              checkDate: qc.checkDate ? new Date(qc.checkDate) : null,
              responsible: qc.responsible?.trim() || null,
              order: idx,
            })),
          });
        }
      }

      return tx.project.findUnique({
        where: { id },
        include: {
          technicalSheet: {
            include: {
              materials: { orderBy: { order: 'asc' } },
              milestones: { orderBy: { order: 'asc' } },
              qualityChecks: { orderBy: { order: 'asc' } },
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Ficha técnica actualizada exitosamente.',
      project: updated,
      version: updated?.technicalSheet?.version,
      updatedAt: updated?.technicalSheet?.updatedAt,
    });
  } catch (error: unknown) {
    console.error('[API /api/admin/projects/[id]/technical-sheet PATCH Error]:', error);
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al actualizar la ficha técnica';
    return NextResponse.json({ error: message }, { status });
  }
}
