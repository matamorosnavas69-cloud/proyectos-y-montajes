export type ProposalStatus =
  | 'DRAFT'
  | 'INTERNAL_REVIEW'
  | 'SENT'
  | 'VIEWED'
  | 'NEGOTIATION'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED';

/**
 * Formal transition rules for commercial proposals:
 * DRAFT -> INTERNAL_REVIEW -> SENT -> VIEWED -> NEGOTIATION -> ACCEPTED
 * Any non-terminal state can transition to REJECTED or EXPIRED.
 * Terminal states (ACCEPTED, REJECTED, EXPIRED) cannot be mutated without a version bump (V01 -> V02).
 */
const ALLOWED_TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  DRAFT: ['INTERNAL_REVIEW', 'SENT', 'REJECTED'],
  INTERNAL_REVIEW: ['DRAFT', 'SENT', 'REJECTED'],
  SENT: ['VIEWED', 'NEGOTIATION', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
  VIEWED: ['NEGOTIATION', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
  NEGOTIATION: ['SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
  ACCEPTED: [], // Terminal: Immutable contract
  REJECTED: [], // Terminal: Requires version bump
  EXPIRED: [],  // Terminal: Requires version bump
};

export interface TransitionValidationResult {
  isValid: boolean;
  reason?: string;
}

export function validateProposalTransition(
  currentStatus: string,
  targetStatus: string
): TransitionValidationResult {
  const current = currentStatus as ProposalStatus;
  const target = targetStatus as ProposalStatus;

  if (current === target) {
    return { isValid: true };
  }

  const validNextStates = ALLOWED_TRANSITIONS[current];
  if (!validNextStates) {
    return {
      isValid: false,
      reason: `Estado de origen "${currentStatus}" no es reconocido por la máquina de estados.`,
    };
  }

  if (!validNextStates.includes(target)) {
    return {
      isValid: false,
      reason: `Transición no permitida: No se puede cambiar de "${current}" a "${target}". Para propuestas rechazadas o vencidas debe emitirse una nueva versión (V02).`,
    };
  }

  return { isValid: true };
}
