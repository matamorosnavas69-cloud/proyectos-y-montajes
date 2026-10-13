import crypto from 'crypto';

/**
 * Normalizes an object into a deterministically sorted JSON string
 * so SHA-256 hashes are 100% reproducible across machines and runtime versions.
 */
function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJson).join(',') + ']';
  }

  const record = obj as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const pairs = sortedKeys.map((key) => `${JSON.stringify(key)}:${canonicalizeJson(record[key])}`);
  return '{' + pairs.join(',') + '}';
}

export interface ProposalSnapshotPayload {
  version: string;
  category: string;
  inputs: Record<string, unknown>;
  financials: {
    materialsCost: number;
    laborCost: number;
    transportCost: number;
    overheadCost: number;
    contingencyCost: number;
    directCost: number;
    totalInternalCost: number;
    targetMarginPercentage: number;
    marginAmount: number;
    totalPrice: number;
    currency: string;
  };
  commercialTerms: {
    scopeSummary: string;
    deliverables: string[];
    estimatedDays?: number | null;
    warrantyMonths?: number | null;
    paymentTerms?: string | null;
  };
  timestamp: string;
}

/**
 * Creates an immutable snapshot payload and its cryptographic SHA-256 signature.
 */
export function signProposalSnapshot(payload: Omit<ProposalSnapshotPayload, 'timestamp'>): {
  snapshotData: ProposalSnapshotPayload;
  sha256Hash: string;
} {
  const timestamp = new Date().toISOString();
  const snapshotData: ProposalSnapshotPayload = {
    ...payload,
    timestamp,
  };

  const canonicalString = canonicalizeJson(snapshotData);
  const sha256Hash = crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex');

  return {
    snapshotData,
    sha256Hash,
  };
}

/**
 * Verifies if an existing proposal snapshot matches its signed SHA-256 hash.
 */
export function verifyProposalSnapshot(
  snapshotData: unknown,
  expectedHash?: string | null
): { isValid: boolean; calculatedHash: string } {
  if (!snapshotData) {
    return { isValid: false, calculatedHash: '' };
  }

  const canonicalString = canonicalizeJson(snapshotData);
  const calculatedHash = crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex');

  return {
    isValid: Boolean(expectedHash && calculatedHash.toLowerCase() === expectedHash.toLowerCase()),
    calculatedHash,
  };
}
