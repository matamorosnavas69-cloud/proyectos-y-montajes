import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (source && source !== 'ALL') {
      where.source = source;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        projects: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
    });

    const countsByStatus = await prisma.lead.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const statusCounts: Record<string, number> = {
      NUEVO: 0,
      CONTACTADO: 0,
      CALIFICADO: 0,
      COTIZACION_ENVIADA: 0,
      GANADO: 0,
      PERDIDO: 0,
    };
    countsByStatus.forEach((item) => {
      statusCounts[item.status] = item._count._all;
    });

    return NextResponse.json({
      success: true,
      leads,
      statusCounts,
      total: leads.length,
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al listar prospectos';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authState = await requireAdmin();
    const body = await req.json();

    const {
      name,
      company,
      email,
      phone,
      projectType,
      location,
      city,
      estimatedBudget,
      desiredStart,
      source,
      priority,
      assignedTo,
      notes,
      quotedAmount,
      estimatedValue,
      closeProbability,
      nextAction,
      nextActionDate,
      estimatedCloseDate,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'El nombre del contacto o empresa es obligatorio.' },
        { status: 400 }
      );
    }

    if (!projectType || typeof projectType !== 'string' || !projectType.trim()) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'El tipo de proyecto es obligatorio.' },
        { status: 400 }
      );
    }

    const normalizedProbability = closeProbability === undefined || closeProbability === null || closeProbability === ''
      ? 50
      : Number(closeProbability);
    if (!Number.isFinite(normalizedProbability) || normalizedProbability < 0 || normalizedProbability > 100) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'La probabilidad de cierre debe estar entre 0 y 100.' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        company: company ? company.trim() : null,
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        projectType: projectType.trim(),
        location: location ? location.trim() : null,
        city: city ? city.trim() : null,
        estimatedBudget: estimatedBudget ? Number(estimatedBudget) : null,
        desiredStart: desiredStart ? new Date(desiredStart) : null,
        source: source || 'DIRECTO',
        status: 'NUEVO',
        priority: priority || 'MEDIA',
        assignedTo: assignedTo ? assignedTo.trim() : (authState.email || null),
        notes: notes ? notes.trim() : null,
        quotedAmount: quotedAmount ? Number(quotedAmount) : null,
        estimatedValue: estimatedValue !== undefined && estimatedValue !== '' ? Number(estimatedValue) : null,
        closeProbability: normalizedProbability,
        nextAction: nextAction ? String(nextAction).trim() : null,
        nextActionDate: nextActionDate ? new Date(nextActionDate) : null,
        estimatedCloseDate: estimatedCloseDate ? new Date(estimatedCloseDate) : null,
        activities: {
          create: [
            {
              type: 'STATUS_CHANGE',
              description: `Prospecto creado en el sistema comercial por ${authState.email || authState.userId}`,
              author: authState.email || authState.userId,
            },
          ],
        },
      },
      include: {
        activities: true,
      },
    });

    console.info(`[Audit CRM] Lead created "${lead.name}" (${lead.id}) by ${authState.email || authState.userId}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Prospecto creado exitosamente en el CRM.',
        lead,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al crear prospecto';
    return NextResponse.json({ error: message }, { status });
  }
}
