import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, AuthError } from '@/lib/auth/rbac';
import { signProposalSnapshot } from '@/lib/business-integrity/snapshotSigner';
import { logCommercialAction } from '@/lib/business-integrity/auditLogger';
import { sanitizeProposalDTO } from '@/lib/dto/proposalSanitizer';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireStaff();
    const { id } = await params;
    const body = await req.json();

    const source = await prisma.proposal.findUnique({ where: { id } });
    if (!source) {
      return NextResponse.json({ error: 'Not Found', message: 'Propuesta no encontrada' }, { status: 404 });
    }

    // Extract next version string (e.g. V01 -> V02)
    const currentVerNum = parseInt(source.version.replace(/\D/g, ''), 10) || 1;
    const nextVer = `V${(currentVerNum + 1).toString().padStart(2, '0')}`;

    const {
      totalPrice,
      scopeText,
      deliverables,
      estimatedDays,
      paymentTerms,
      versionReason,
    } = body;

    const resolvedPrice = totalPrice !== undefined ? Number(totalPrice) : source.totalPrice;
    const resolvedScope = scopeText !== undefined ? scopeText : source.scopeText;
    const resolvedDeliverables = Array.isArray(deliverables) ? deliverables : source.deliverables;
    const resolvedDays = estimatedDays !== undefined ? Number(estimatedDays) : source.estimatedDays;
    const resolvedTerms = paymentTerms !== undefined ? paymentTerms : source.paymentTerms;

    // Cryptographically sign new version snapshot
    const { snapshotData, sha256Hash } = signProposalSnapshot({
      version: nextVer,
      category: source.category,
      inputs: (source.estimatorData as Record<string, unknown>) || {},
      financials: {
        materialsCost: source.materialsCost || 0,
        laborCost: source.laborCost || 0,
        transportCost: source.transportCost || 0,
        overheadCost: source.overheadCost || 0,
        contingencyCost: source.contingencyCost || 0,
        directCost: source.directCost || 0,
        totalInternalCost:
          (source.directCost || 0) + (source.overheadCost || 0) + (source.contingencyCost || 0),
        targetMarginPercentage: source.expectedMargin || 0,
        marginAmount:
          resolvedPrice -
          ((source.directCost || 0) + (source.overheadCost || 0) + (source.contingencyCost || 0)),
        totalPrice: resolvedPrice,
        currency: source.currency,
      },
      commercialTerms: {
        scopeSummary: resolvedScope || '',
        deliverables: resolvedDeliverables,
        estimatedDays: resolvedDays,
        warrantyMonths: source.warrantyMonths,
        paymentTerms: resolvedTerms,
      },
    });

    const newProposal = await prisma.$transaction(async (tx) => {
      const created = await tx.proposal.create({
        data: {
          code: source.code,
          version: nextVer,
          leadId: source.leadId,
          projectId: source.projectId,
          title: source.title,
          category: source.category,
          clientName: source.clientName,
          clientCompany: source.clientCompany,
          clientEmail: source.clientEmail,
          clientPhone: source.clientPhone,
          location: source.location,
          city: source.city,
          status: 'DRAFT',
          scopeText: resolvedScope,
          deliverables: resolvedDeliverables,
          estimatedDays: resolvedDays,
          warrantyMonths: source.warrantyMonths,
          directCost: source.directCost,
          laborCost: source.laborCost,
          materialsCost: source.materialsCost,
          transportCost: source.transportCost,
          overheadCost: source.overheadCost,
          contingencyCost: source.contingencyCost,
          expectedMargin: source.expectedMargin,
          totalPrice: resolvedPrice,
          currency: source.currency,
          paymentTerms: resolvedTerms,
          estimatorData: source.estimatorData ?? {},
          snapshotData: snapshotData as unknown as object,
          sha256Hash,
          createdBy: authState.email || authState.userId,
        },
      });

      // Commercial Audit Log
      await logCommercialAction(tx, {
        entityType: 'PROPOSAL',
        entityId: created.id,
        proposalId: created.id,
        action: 'VERSION_BUMP',
        fromStatus: source.version,
        toStatus: nextVer,
        actor: authState,
        reason: versionReason || `Negociación comercial: Bump inmutable ${source.version} -> ${nextVer}`,
        metadata: {
          previousVersion: source.version,
          newVersion: nextVer,
          previousPrice: source.totalPrice,
          newPrice: resolvedPrice,
          sha256Hash,
        },
        req,
      });

      return created;
    });

    console.info(
      `[Audit Proposals] New immutable version created: "${newProposal.code}" (${nextVer}) by ${authState.email || authState.userId}`
    );

    const sanitized = sanitizeProposalDTO(newProposal, authState.role);

    return NextResponse.json(
      {
        success: true,
        message: `Nueva versión inmutable ${nextVer} de la propuesta ${source.code} creada con éxito.`,
        proposal: sanitized,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al crear versión de propuesta';
    return NextResponse.json({ error: message }, { status });
  }
}
