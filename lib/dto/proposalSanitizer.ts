import { Proposal } from '@prisma/client';
import { UserRole } from '@/lib/auth/constants';
import { canViewInternalEconomics } from '@/lib/auth/rbac';

export interface SanitizedProposalDTO {
  id: string;
  code: string;
  version: string;
  title: string;
  category: string;
  clientName: string;
  clientCompany?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  location?: string | null;
  city?: string | null;
  status: string;
  scopeText?: string | null;
  deliverables: string[];
  estimatedDays?: number | null;
  warrantyMonths: number;
  totalPrice: number;
  currency: string;
  paymentTerms?: string | null;
  sha256Hash?: string | null;
  sentAt?: Date | null;
  viewedAt?: Date | null;
  acceptedAt?: Date | null;
  rejectedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lead?: { id: string; name: string } | null;
  project?: { id: string; title: string; slug: string } | null;

  // Confidential Economics (ONLY populated if caller has ADMIN / FINANCE role)
  directCost?: number | null;
  laborCost?: number | null;
  materialsCost?: number | null;
  transportCost?: number | null;
  overheadCost?: number | null;
  contingencyCost?: number | null;
  expectedMargin?: number | null;
  marginAmount?: number | null;
  isConfidentialView: boolean;
}

/**
 * Sanitizes a Proposal record before returning it over the wire.
 * Strictly prevents data leakage of internal costs/margins to Commercial staff, Clients, or unauthorized users.
 */
export function sanitizeProposalDTO(
  proposal: Proposal & {
    lead?: { id: string; name: string } | null;
    project?: { id: string; title: string; slug: string } | null;
  },
  callerRole: UserRole
): SanitizedProposalDTO {
  const isPrivileged = canViewInternalEconomics(callerRole);

  const base: SanitizedProposalDTO = {
    id: proposal.id,
    code: proposal.code,
    version: proposal.version,
    title: proposal.title,
    category: proposal.category,
    clientName: proposal.clientName,
    clientCompany: proposal.clientCompany,
    clientEmail: proposal.clientEmail,
    clientPhone: proposal.clientPhone,
    location: proposal.location,
    city: proposal.city,
    status: proposal.status,
    scopeText: proposal.scopeText,
    deliverables: proposal.deliverables,
    estimatedDays: proposal.estimatedDays,
    warrantyMonths: proposal.warrantyMonths,
    totalPrice: proposal.totalPrice,
    currency: proposal.currency,
    paymentTerms: proposal.paymentTerms,
    sha256Hash: proposal.sha256Hash,
    sentAt: proposal.sentAt,
    viewedAt: proposal.viewedAt,
    acceptedAt: proposal.acceptedAt,
    rejectedAt: proposal.rejectedAt,
    createdAt: proposal.createdAt,
    updatedAt: proposal.updatedAt,
    lead: proposal.lead,
    project: proposal.project,
    isConfidentialView: isPrivileged,
  };

  if (isPrivileged) {
    const totalInternal =
      (proposal.directCost || 0) + (proposal.overheadCost || 0) + (proposal.contingencyCost || 0);
    const marginAmount = proposal.totalPrice - totalInternal;

    base.directCost = proposal.directCost;
    base.laborCost = proposal.laborCost;
    base.materialsCost = proposal.materialsCost;
    base.transportCost = proposal.transportCost;
    base.overheadCost = proposal.overheadCost;
    base.contingencyCost = proposal.contingencyCost;
    base.expectedMargin = proposal.expectedMargin;
    base.marginAmount = marginAmount;
  }

  return base;
}
