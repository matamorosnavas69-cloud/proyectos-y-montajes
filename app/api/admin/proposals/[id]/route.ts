import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff, requireAdmin, AuthError } from '@/lib/auth/rbac';
import { validateProposalTransition } from '@/lib/business-integrity/stateMachine';
import { logCommercialAction } from '@/lib/business-integrity/auditLogger';
import { sanitizeProposalDTO } from '@/lib/dto/proposalSanitizer';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireStaff();
    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        lead: true,
        project: {
          select: { id: true, title: true, slug: true, status: true, mainImage: true },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Not Found', message: 'Propuesta no encontrada' }, { status: 404 });
    }

    const sanitized = sanitizeProposalDTO(proposal, authState.role);

    return NextResponse.json({ success: true, proposal: sanitized });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al consultar propuesta';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireStaff();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.proposal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Propuesta no encontrada' }, { status: 404 });
    }

    const {
      title,
      status: targetStatus,
      scopeText,
      deliverables,
      estimatedDays,
      warrantyMonths,
      totalPrice,
      paymentTerms,
      rejectionReason,
    } = body;

    // 1. Validate State Machine Transition
    if (targetStatus && targetStatus !== existing.status) {
      // Direct transition to ACCEPTED via PATCH is strictly forbidden
      if (targetStatus === 'ACCEPTED') {
        return NextResponse.json(
          {
            error: 'Forbidden',
            message:
              'Una propuesta no puede marcarse arbitrariamente como ACEPTADA mediante edición simple. Debe ejecutarse la transacción de adjudicación oficial (Aceptar & Promover a Obra).',
          },
          { status: 422 }
        );
      }

      const validation = validateProposalTransition(existing.status, targetStatus);
      if (!validation.isValid) {
        return NextResponse.json(
          {
            error: 'Unprocessable Entity',
            message: validation.reason,
          },
          { status: 422 }
        );
      }
    }

    // 2. Immutability check: If proposal is SENT, ACCEPTED or REJECTED, financial terms cannot be modified directly
    const isLockedState = ['SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'].includes(existing.status);
    if (isLockedState && totalPrice !== undefined && Number(totalPrice) !== existing.totalPrice) {
      return NextResponse.json(
        {
          error: 'Conflict',
          message: `La propuesta ${existing.code} (${existing.version}) se encuentra en estado ${existing.status} y su valor es inmutable. Genere una nueva versión (V02) para renegociar precio.`,
        },
        { status: 409 }
      );
    }

    const isMarkingSent = targetStatus === 'SENT' && existing.status !== 'SENT';
    const isRejected = targetStatus === 'REJECTED' && existing.status !== 'REJECTED';

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.proposal.update({
        where: { id },
        data: {
          title: title !== undefined ? title.trim() : undefined,
          status: targetStatus !== undefined ? targetStatus : undefined,
          scopeText: scopeText !== undefined ? scopeText : undefined,
          deliverables: Array.isArray(deliverables) ? deliverables : undefined,
          estimatedDays: estimatedDays !== undefined ? Number(estimatedDays) : undefined,
          warrantyMonths: warrantyMonths !== undefined ? Number(warrantyMonths) : undefined,
          totalPrice: totalPrice !== undefined ? Number(totalPrice) : undefined,
          paymentTerms: paymentTerms !== undefined ? paymentTerms : undefined,
          sentAt: isMarkingSent ? new Date() : undefined,
          rejectedAt: isRejected ? new Date() : undefined,
          rejectionReason: rejectionReason !== undefined ? rejectionReason : undefined,
        },
      });

      // Audit status transition
      if (targetStatus && targetStatus !== existing.status) {
        await logCommercialAction(tx, {
          entityType: 'PROPOSAL',
          entityId: id,
          proposalId: id,
          action: 'STATUS_CHANGE',
          fromStatus: existing.status,
          toStatus: targetStatus,
          actor: authState,
          reason: rejectionReason || null,
          req,
        });
      }

      // If linked to lead and marking sent, update lead state
      if (existing.leadId && isMarkingSent) {
        await tx.lead.update({
          where: { id: existing.leadId },
          data: { status: 'PROPUESTA_ENVIADA' },
        });

        await tx.leadActivity.create({
          data: {
            leadId: existing.leadId,
            type: 'NOTE',
            description: `Propuesta formal ${existing.code} (${existing.version}) remitida al cliente por ${authState.email || authState.userId}`,
            author: authState.email || authState.userId,
          },
        });
      }

      return result;
    });

    console.info(`[Audit Proposals] Proposal updated "${updated.code}" status=${updated.status} by ${authState.email || authState.userId}`);

    const sanitized = sanitizeProposalDTO(updated, authState.role);

    return NextResponse.json({
      success: true,
      message: 'Propuesta actualizada exitosamente.',
      proposal: sanitized,
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al actualizar propuesta';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireAdmin();
    const { id } = await params;

    const existing = await prisma.proposal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Propuesta no encontrada' }, { status: 404 });
    }

    await prisma.proposal.delete({ where: { id } });

    console.info(`[Audit Proposals] Proposal deleted "${existing.code}" by ${authState.email || authState.userId}`);

    return NextResponse.json({
      success: true,
      message: `Propuesta "${existing.code}" eliminada exitosamente.`,
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al eliminar propuesta';
    return NextResponse.json({ error: message }, { status });
  }
}
