import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireAdmin();
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { project: true, lead: true },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Not Found', message: 'Propuesta no encontrada' }, { status: 404 });
    }

    if (proposal.projectId) {
      return NextResponse.json(
        {
          error: 'Conflict',
          message: `Esta propuesta ya fue promovida a la obra "${proposal.project?.title}".`,
          project: proposal.project,
        },
        { status: 409 }
      );
    }

    // Generate unique slug
    const baseSlug = slugify(proposal.title);
    let uniqueSlug = baseSlug || `obra-${Date.now()}`;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { extractClientMetadata, logCommercialAction } = await import('@/lib/business-integrity/auditLogger');
    const { ip, userAgent } = extractClientMetadata(req);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create project
      const project = await tx.project.create({
        data: {
          title: proposal.title,
          slug: uniqueSlug,
          category: proposal.category,
          client: proposal.clientCompany || proposal.clientName,
          location: proposal.location,
          city: proposal.city,
          budget: proposal.totalPrice,
          businessStatus: 'APPROVED',
          status: 'PLANNING',
          published: false,
          leadId: proposal.leadId || null,
          description: proposal.scopeText || 'Obra adjudicada mediante propuesta comercial oficial.',
        },
      });

      // 2. Initialize technical sheet
      const technicalSheet = await tx.technicalSheet.create({
        data: {
          projectId: project.id,
          revision: 'R01',
          currentRevision: 'R01',
          sheetStatus: 'DRAFT',
          specifications: proposal.estimatorData ?? {},
          deliveryStatus: 'PENDIENTE',
          generatedBy: authState.email || authState.userId,
          version: 1,
        },
      });

      // 3. Create initial standard execution milestones
      const standardMilestones = [
        { name: 'Replanteo Topográfico & Cerramiento Provisional', order: 1 },
        { name: 'Obras Civiles de Nivelación & Drenajes Subterráneos', order: 2 },
        { name: 'Suministro e Instalación de Superficie & Cerramiento', order: 3 },
        { name: 'Protocolo de Calidad, Pruebas y Recibo a Satisfacción', order: 4 },
      ];

      for (const m of standardMilestones) {
        await tx.milestone.create({
          data: {
            technicalSheetId: technicalSheet.id,
            name: m.name,
            order: m.order,
            status: 'PENDIENTE',
            description: 'Hito inicial generado automáticamente desde la propuesta comercial adjudicada.',
          },
        });
      }

      // 4. Mark proposal as ACCEPTED and record legal forensic evidence
      await tx.proposal.update({
        where: { id: proposal.id },
        data: {
          status: 'ACCEPTED',
          acceptedAt: new Date(),
          acceptedBy: authState.email || authState.userId,
          acceptedIp: ip,
          acceptedUserAgent: userAgent,
          projectId: project.id,
        },
      });

      // 5. Commercial Audit Log
      await logCommercialAction(tx, {
        entityType: 'PROPOSAL',
        entityId: proposal.id,
        proposalId: proposal.id,
        action: 'ACCEPTED',
        fromStatus: proposal.status,
        toStatus: 'ACCEPTED',
        actor: authState,
        reason: `Propuesta adjudicada y promovida a Obra Oficial "${project.title}"`,
        metadata: {
          projectId: project.id,
          projectSlug: project.slug,
          contractAmount: proposal.totalPrice,
          acceptedSnapshotHash: proposal.sha256Hash,
          ip,
          userAgent,
        },
        req,
      });

      // 6. If linked to lead, mark as GANADO and audit
      if (proposal.leadId) {
        await tx.lead.update({
          where: { id: proposal.leadId },
          data: { status: 'GANADO' },
        });

        await tx.leadActivity.create({
          data: {
            leadId: proposal.leadId,
            type: 'STATUS_CHANGE',
            description: `Propuesta ${proposal.code} (${proposal.version}) aceptada formalmente. Obra adjudicada "${project.title}" por $${proposal.totalPrice.toLocaleString()} COP. Evidencia contractual registrada.`,
            author: authState.email || authState.userId,
          },
        });
      }

      return project;
    });

    console.info(`[Audit Proposals] Proposal "${proposal.code}" accepted -> Obra "${result.title}" (${result.id})`);

    return NextResponse.json(
      {
        success: true,
        message: `¡Propuesta ${proposal.code} aceptada con éxito! Se ha creado la obra oficial "${result.title}" con sus hitos iniciales.`,
        project: result,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al aceptar propuesta';
    return NextResponse.json({ error: message }, { status });
  }
}
