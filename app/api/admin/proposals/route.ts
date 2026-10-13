import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, AuthError } from '@/lib/auth/rbac';
import { calculateQuotation, EstimatorCategoryParams } from '@/lib/estimator/calculations';
import { allocateNextProposalCode } from '@/lib/business-integrity/sequenceAllocator';
import { signProposalSnapshot } from '@/lib/business-integrity/snapshotSigner';
import { logCommercialAction } from '@/lib/business-integrity/auditLogger';
import { sanitizeProposalDTO } from '@/lib/dto/proposalSanitizer';

export async function GET(req: NextRequest) {
  try {
    const authState = await requireStaff();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.status = status;
    if (category && category !== 'ALL') where.category = category;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientCompany: { contains: search, mode: 'insensitive' } },
      ];
    }

    const proposals = await prisma.proposal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: { select: { id: true, name: true, phone: true, email: true } },
        project: { select: { id: true, title: true, slug: true, status: true } },
      },
    });

    const sanitized = proposals.map((p) => sanitizeProposalDTO(p, authState.role));

    const aggregateTotal = await prisma.proposal.aggregate({
      _sum: { totalPrice: true },
      where: { status: { notIn: ['REJECTED', 'EXPIRED'] } },
    });

    const acceptedAggregate = await prisma.proposal.aggregate({
      _sum: { totalPrice: true },
      where: { status: 'ACCEPTED' },
    });

    return NextResponse.json({
      success: true,
      proposals: sanitized,
      metrics: {
        totalProposals: proposals.length,
        totalPipelinePrice: aggregateTotal._sum.totalPrice || 0,
        acceptedPrice: acceptedAggregate._sum.totalPrice || 0,
      },
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al listar propuestas';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authState = await requireStaff();
    const body = await req.json();

    const {
      leadId,
      title,
      category,
      clientName,
      clientCompany,
      clientEmail,
      clientPhone,
      location,
      city,
      estimatorParams,
      // Custom overrides if not using estimator
      customScope,
      customDeliverables,
      customTotalPrice,
      customEstimatedDays,
      paymentTerms,
    } = body;

    if (!title || !category || !clientName) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Título, categoría y nombre del cliente son obligatorios.' },
        { status: 400 }
      );
    }

    // Run parametric estimator if category params provided
    let estimateResult = null;
    if (estimatorParams && estimatorParams.category) {
      estimateResult = calculateQuotation(estimatorParams as EstimatorCategoryParams);
    }

    // Concurrency-Safe Sequence Code Allocator (PM-YYYY-XXXX)
    const nextCode = await allocateNextProposalCode();

    const scopeText = customScope || estimateResult?.scopeSummary || 'Propuesta técnica y comercial de infraestructura deportiva y paisajismo.';
    const deliverables = Array.isArray(customDeliverables) && customDeliverables.length > 0
      ? customDeliverables
      : (estimateResult?.deliverables || []);
    const totalPrice = customTotalPrice ? Number(customTotalPrice) : (estimateResult?.totalPrice || 0);
    const estimatedDays = customEstimatedDays ? Number(customEstimatedDays) : (estimateResult?.estimatedDays || 30);
    const warrantyMonths = estimateResult?.warrantyMonths || 12;

    // Cryptographic Snapshot Generation with SHA-256
    const { snapshotData, sha256Hash } = signProposalSnapshot({
      version: 'V01',
      category,
      inputs: (estimatorParams as Record<string, unknown>) || {},
      financials: {
        materialsCost: estimateResult?.materialsCost || 0,
        laborCost: estimateResult?.laborCost || 0,
        transportCost: estimateResult?.transportCost || 0,
        overheadCost: estimateResult?.overheadCost || 0,
        contingencyCost: estimateResult?.contingencyCost || 0,
        directCost: estimateResult?.directCost || 0,
        totalInternalCost: estimateResult?.totalInternalCost || 0,
        targetMarginPercentage: estimateResult?.targetMarginPercentage || 0,
        marginAmount: estimateResult?.marginAmount || 0,
        totalPrice,
        currency: 'COP',
      },
      commercialTerms: {
        scopeSummary: scopeText,
        deliverables,
        estimatedDays,
        warrantyMonths,
        paymentTerms: paymentTerms || estimateResult?.paymentTerms,
      },
    });

    const proposal = await prisma.$transaction(async (tx) => {
      const created = await tx.proposal.create({
        data: {
          code: nextCode,
          version: 'V01',
          leadId: leadId || null,
          title: title.trim(),
          category,
          clientName: clientName.trim(),
          clientCompany: clientCompany ? clientCompany.trim() : null,
          clientEmail: clientEmail ? clientEmail.trim() : null,
          clientPhone: clientPhone ? clientPhone.trim() : null,
          location: location ? location.trim() : null,
          city: city ? city.trim() : null,
          status: 'DRAFT',
          scopeText,
          deliverables,
          estimatedDays,
          warrantyMonths,
          directCost: estimateResult?.directCost || null,
          laborCost: estimateResult?.laborCost || null,
          materialsCost: estimateResult?.materialsCost || null,
          transportCost: estimateResult?.transportCost || null,
          overheadCost: estimateResult?.overheadCost || null,
          contingencyCost: estimateResult?.contingencyCost || null,
          expectedMargin: estimateResult?.targetMarginPercentage || null,
          totalPrice,
          currency: 'COP',
          paymentTerms: paymentTerms || estimateResult?.paymentTerms || '50% anticipo, 30% avance, 20% entrega.',
          estimatorData: estimatorParams || {},
          snapshotData: snapshotData as unknown as object,
          sha256Hash,
          createdBy: authState.email || authState.userId,
        },
      });

      // Audit Log in the same transaction
      await logCommercialAction(tx, {
        entityType: 'PROPOSAL',
        entityId: created.id,
        proposalId: created.id,
        action: 'CREATED',
        toStatus: 'DRAFT',
        actor: authState,
        metadata: {
          code: created.code,
          totalPrice,
          sha256Hash,
        },
        req,
      });

      // Update lead if attached
      if (leadId) {
        await tx.lead.update({
          where: { id: leadId },
          data: {
            status: 'PROPUESTA_EN_PREPARACION',
            quotedAmount: totalPrice,
            estimatedValue: totalPrice,
          },
        });

        await tx.leadActivity.create({
          data: {
            leadId,
            type: 'NOTE',
            description: `Propuesta comercial ${created.code} (V01) generada por valor de $${totalPrice.toLocaleString()} COP (SHA-256: ${sha256Hash.substring(0, 8)}...)`,
            author: authState.email || authState.userId,
          },
        });
      }

      return created;
    });

    const sanitized = sanitizeProposalDTO(proposal, authState.role);

    return NextResponse.json(
      {
        success: true,
        message: `Propuesta comercial ${proposal.code} creada con integridad criptográfica.`,
        proposal: sanitized,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al crear propuesta';
    return NextResponse.json({ error: message }, { status });
  }
}
