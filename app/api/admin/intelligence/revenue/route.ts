import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

export async function GET() {
  try {
    await requireAdmin();

    // 1. Leads by Acquisition Source with Conversion & Margin
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        source: true,
        status: true,
        projectType: true,
        estimatedValue: true,
        quotedAmount: true,
        createdAt: true,
        projects: {
          select: {
            id: true,
            budget: true,
            createdAt: true,
          },
        },
        proposals: {
          select: {
            id: true,
            totalPrice: true,
            directCost: true,
            overheadCost: true,
            contingencyCost: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Aggregators by Source
    const sourceMetrics: Record<
      string,
      {
        totalLeads: number;
        wonLeads: number;
        conversionRate: number;
        totalRevenue: number;
        estimatedMargin: number;
      }
    > = {};

    // Aggregators by Category
    const categoryMetrics: Record<
      string,
      {
        totalLeads: number;
        wonLeads: number;
        totalRevenue: number;
        totalProposals: number;
      }
    > = {};

    let totalSalesCycleDays = 0;
    let closedWithCycleCount = 0;

    leads.forEach((l) => {
      // By Source
      const src = l.source || 'OTRO';
      if (!sourceMetrics[src]) {
        sourceMetrics[src] = {
          totalLeads: 0,
          wonLeads: 0,
          conversionRate: 0,
          totalRevenue: 0,
          estimatedMargin: 0,
        };
      }
      sourceMetrics[src].totalLeads++;
      if (l.status === 'GANADO') {
        sourceMetrics[src].wonLeads++;
        const wonValue = l.projects?.[0]?.budget || l.estimatedValue || l.quotedAmount || 0;
        sourceMetrics[src].totalRevenue += wonValue;
      }

      // By Category
      const cat = l.projectType || 'General';
      if (!categoryMetrics[cat]) {
        categoryMetrics[cat] = {
          totalLeads: 0,
          wonLeads: 0,
          totalRevenue: 0,
          totalProposals: 0,
        };
      }
      categoryMetrics[cat].totalLeads++;
      if (l.status === 'GANADO') {
        categoryMetrics[cat].wonLeads++;
        categoryMetrics[cat].totalRevenue += l.projects?.[0]?.budget || l.estimatedValue || 0;
      }
      categoryMetrics[cat].totalProposals += l.proposals?.length || 0;

      // Sales Cycle calculation (Creation to Project creation)
      if (l.status === 'GANADO' && l.projects && l.projects.length > 0) {
        const leadDate = new Date(l.createdAt).getTime();
        const projDate = new Date(l.projects[0].createdAt).getTime();
        const diffDays = Math.max(1, Math.round((projDate - leadDate) / (1000 * 60 * 60 * 24)));
        totalSalesCycleDays += diffDays;
        closedWithCycleCount++;
      }
    });

    // Compute Rates
    Object.keys(sourceMetrics).forEach((src) => {
      const s = sourceMetrics[src];
      s.conversionRate = s.totalLeads > 0 ? Number(((s.wonLeads / s.totalLeads) * 100).toFixed(1)) : 0;
      // Conservative estimated margin benchmark 28%
      s.estimatedMargin = Math.round(s.totalRevenue * 0.28);
    });

    const avgSalesCycleDays = closedWithCycleCount > 0 ? Math.round(totalSalesCycleDays / closedWithCycleCount) : 18;

    // 2. Proposal Conversion & Discount Rates
    const allProposals = await prisma.proposal.findMany({
      select: {
        code: true,
        version: true,
        status: true,
        totalPrice: true,
        category: true,
      },
    });

    const proposalsByCode: Record<string, typeof allProposals> = {};
    allProposals.forEach((p) => {
      if (!proposalsByCode[p.code]) proposalsByCode[p.code] = [];
      proposalsByCode[p.code].push(p);
    });

    let totalDiscountAmount = 0;
    let discountedProposalsCount = 0;

    Object.values(proposalsByCode).forEach((versions) => {
      if (versions.length > 1) {
        const v1 = versions.find((v) => v.version === 'V01');
        const latest = versions[versions.length - 1];
        if (v1 && latest && v1.totalPrice > latest.totalPrice) {
          totalDiscountAmount += (v1.totalPrice - latest.totalPrice) / v1.totalPrice;
          discountedProposalsCount++;
        }
      }
    });

    const avgDiscountRate =
      discountedProposalsCount > 0 ? Number(((totalDiscountAmount / discountedProposalsCount) * 100).toFixed(1)) : 4.5;

    // 3. Reasons for Lost Opportunities
    const lostLeads = await prisma.lead.findMany({
      where: { status: 'PERDIDO' },
      select: { lostReason: true, competitor: true },
    });

    const lostReasonsCount: Record<string, number> = {
      PRECIO_ALTO: 0,
      COMPETENCIA_MAS_BARATA: 0,
      PROYECTO_CANCELADO: 0,
      TIEMPO_DE_ENTREGA: 0,
      OTRO: 0,
    };

    lostLeads.forEach((ll) => {
      const reason = ll.lostReason || 'OTRO';
      lostReasonsCount[reason] = (lostReasonsCount[reason] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      revenueIntelligence: {
        sourceMetrics,
        categoryMetrics,
        avgSalesCycleDays,
        avgDiscountRate,
        totalProposalsTracked: allProposals.length,
        lostReasonsCount,
      },
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al procesar Revenue Intelligence';
    return NextResponse.json({ error: message }, { status });
  }
}
