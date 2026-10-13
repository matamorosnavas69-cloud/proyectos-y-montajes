import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAdmin();
    const { id } = await params;

    const source = await prisma.project.findUnique({
      where: { id },
      include: {
        technicalSheet: {
          include: {
            materials: true,
            milestones: true,
            qualityChecks: true,
          },
        },
      },
    });

    if (!source) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Generate unique slug
    const baseSlug = `${source.slug}-copia`;
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const duplicated = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          title: `${source.title} (Copia)`,
          slug: uniqueSlug,
          category: source.category,
          client: source.client,
          mainImage: source.mainImage,
          gallery: source.gallery,
          sqMeters: source.sqMeters,
          duration: source.duration,
          description: source.description,
          shortDescription: source.shortDescription,
          status: 'DRAFT',
          location: source.location,
          city: source.city,
          published: false,
          featured: false,
          portfolioOrder: 999,
          budget: source.budget,
          director: source.director,
          commercialRep: source.commercialRep,
          internalCode: source.internalCode ? `${source.internalCode}-CP` : null,
          testimonialQuote: source.testimonialQuote,
          testimonialAuthor: source.testimonialAuthor,
          testimonialRole: source.testimonialRole,
        },
      });

      if (source.technicalSheet) {
        const sheet = source.technicalSheet;
        const newSheet = await tx.technicalSheet.create({
          data: {
            projectId: newProject.id,
            specifications: sheet.specifications ?? undefined,
            observations: sheet.observations,
            pendingItems: sheet.pendingItems,
            deliveryDate: sheet.deliveryDate,
            deliveryNotes: sheet.deliveryNotes,
            deliveryClient: sheet.deliveryClient,
            deliveryDirector: sheet.deliveryDirector,
            deliveryInspector: sheet.deliveryInspector,
            deliveryStatus: 'PENDIENTE',
            revision: 'R01',
            generatedBy: authUser.email || authUser.userId,
          },
        });

        if (sheet.materials?.length) {
          await tx.material.createMany({
            data: sheet.materials.map((m) => ({
              technicalSheetId: newSheet.id,
              name: m.name,
              supplier: m.supplier,
              reference: m.reference,
              quantity: m.quantity,
              unit: m.unit,
              status: m.status,
              notes: m.notes,
              order: m.order,
            })),
          });
        }

        if (sheet.milestones?.length) {
          await tx.milestone.createMany({
            data: sheet.milestones.map((m) => ({
              technicalSheetId: newSheet.id,
              name: m.name,
              description: m.description,
              plannedDate: m.plannedDate,
              actualDate: null,
              responsible: m.responsible,
              status: 'PENDIENTE',
              order: m.order,
            })),
          });
        }

        if (sheet.qualityChecks?.length) {
          await tx.qualityCheck.createMany({
            data: sheet.qualityChecks.map((q) => ({
              technicalSheetId: newSheet.id,
              item: q.item,
              status: 'PENDIENTE',
              observation: null,
              checkDate: null,
              responsible: null,
              order: q.order,
            })),
          });
        }
      }

      return newProject;
    });

    return NextResponse.json({
      success: true,
      message: `Proyecto "${source.title}" duplicado exitosamente.`,
      project: duplicated,
    }, { status: 201 });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al duplicar el proyecto';
    return NextResponse.json({ error: message }, { status });
  }
}
