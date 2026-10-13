import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';

export interface AuditActorContext {
  userId?: string | null;
  email?: string | null;
  role?: string | null;
}

export function extractClientMetadata(req?: NextRequest): { ip: string | null; userAgent: string | null } {
  if (!req) return { ip: null, userAgent: null };

  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || null;
  const userAgent = req.headers.get('user-agent') || null;

  return { ip, userAgent };
}

export async function logCommercialAction(
  tx: Prisma.TransactionClient,
  params: {
    entityType: 'PROPOSAL' | 'LEAD' | 'PROJECT';
    entityId: string;
    action: 'CREATED' | 'VERSION_BUMP' | 'STATUS_CHANGE' | 'PRICE_OVERRIDE' | 'ACCEPTED' | 'REJECTED';
    proposalId?: string | null;
    fromStatus?: string | null;
    toStatus?: string | null;
    actor: AuditActorContext;
    reason?: string | null;
    metadata?: Record<string, unknown>;
    req?: NextRequest;
  }
) {
  const { ip, userAgent } = extractClientMetadata(params.req);

  return tx.commercialAuditLog.create({
    data: {
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      fromStatus: params.fromStatus || null,
      toStatus: params.toStatus || null,
      actorId: params.actor.userId || null,
      actorEmail: params.actor.email || null,
      actorRole: params.actor.role || null,
      ipAddress: ip,
      userAgent: userAgent,
      reason: params.reason || null,
      metadata: (params.metadata as Prisma.InputJsonValue) ?? undefined,
      proposalId: params.proposalId || null,
    },
  });
}
