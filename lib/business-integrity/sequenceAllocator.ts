import { prisma } from '@/lib/prisma';

/**
 * Concurrency-safe sequence generator for proposals (e.g. PM-2026-0042).
 * Uses atomic upsert + increment on ProposalSequence table within isolated transaction.
 */
export async function allocateNextProposalCode(customYear?: number): Promise<string> {
  const year = customYear || new Date().getFullYear();

  // Atomically increment lastNumber or create sequence record for year
  const seqRecord = await prisma.proposalSequence.upsert({
    where: { year },
    update: {
      lastNumber: {
        increment: 1,
      },
    },
    create: {
      year,
      lastNumber: 1,
    },
    select: {
      lastNumber: true,
    },
  });

  const formattedNum = seqRecord.lastNumber.toString().padStart(4, '0');
  return `PM-${year}-${formattedNum}`;
}
