import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthError } from '@/lib/auth/rbac';

const LEAD_STATUSES = new Set([
  'NUEVO', 'CONTACTADO', 'CALIFICADO', 'VISITA_DIAGNOSTICO', 'OPORTUNIDAD',
  'PROPUESTA_EN_PREPARACION', 'PROPUESTA_ENVIADA', 'NEGOCIACION', 'GANADO', 'PERDIDO',
]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { createdAt: 'desc' },
        },
        projects: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Not Found', message: 'Prospecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al consultar prospecto';
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Prospecto no encontrado' }, { status: 404 });
    }

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
      status: targetStatus,
      priority,
      assignedTo,
      notes,
      quotedAmount,
      newActivityNote,
    } = body;

    if (targetStatus !== undefined && (typeof targetStatus !== 'string' || !LEAD_STATUSES.has(targetStatus))) {
      return NextResponse.json({ error: 'Bad Request', message: 'La etapa comercial indicada no es válida.' }, { status: 400 });
    }

    // Detect status transition for activity audit

    const isStatusChanged = targetStatus && targetStatus !== existing.status;

    const updated = await prisma.$transaction(async (tx) => {
      await tx.lead.update({
        where: { id },
        data: {
          name: name !== undefined ? name.trim() : undefined,
          company: company !== undefined ? (company ? company.trim() : null) : undefined,
          email: email !== undefined ? (email ? email.trim() : null) : undefined,
          phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
          projectType: projectType !== undefined ? projectType.trim() : undefined,
          location: location !== undefined ? (location ? location.trim() : null) : undefined,
          city: city !== undefined ? (city ? city.trim() : null) : undefined,
          estimatedBudget: estimatedBudget !== undefined ? (estimatedBudget ? Number(estimatedBudget) : null) : undefined,
          desiredStart: desiredStart !== undefined ? (desiredStart ? new Date(desiredStart) : null) : undefined,
          source: source !== undefined ? source : undefined,
          status: targetStatus !== undefined ? targetStatus : undefined,
          priority: priority !== undefined ? priority : undefined,
          assignedTo: assignedTo !== undefined ? (assignedTo ? assignedTo.trim() : null) : undefined,
          notes: notes !== undefined ? (notes ? notes.trim() : null) : undefined,
          quotedAmount: quotedAmount !== undefined ? (quotedAmount ? Number(quotedAmount) : null) : undefined,
        },
      });

      if (isStatusChanged) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            type: 'STATUS_CHANGE',
            description: `Estado comercial actualizado de "${existing.status}" a "${targetStatus}" por ${authState.email || authState.userId}`,
            author: authState.email || authState.userId,
          },
        });
      }

      if (newActivityNote && typeof newActivityNote === 'string' && newActivityNote.trim()) {
        await tx.leadActivity.create({
          data: {
            leadId: id,
            type: 'NOTE',
            description: newActivityNote.trim(),
            author: authState.email || authState.userId,
          },
        });
      }

      return tx.lead.findUnique({
        where: { id },
        include: {
          activities: { orderBy: { createdAt: 'desc' } },
          projects: true,
        },
      });
    });

    console.info(`[Audit CRM] Lead updated "${updated?.name}" (${id}) by ${authState.email || authState.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Prospecto actualizado exitosamente.',
      lead: updated,
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al actualizar prospecto';
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

    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not Found', message: 'Prospecto no encontrado' }, { status: 404 });
    }

    await prisma.lead.delete({ where: { id } });

    console.info(`[Audit CRM] Lead deleted "${existing.name}" (${id}) by ${authState.email || authState.userId}`);

    return NextResponse.json({
      success: true,
      message: 'Prospecto eliminado exitosamente del CRM.',
    });
  } catch (error: unknown) {
    const authErr = error as AuthError;
    const status = authErr.status || 500;
    const message = error instanceof Error ? error.message : 'Error al eliminar prospecto';
    return NextResponse.json({ error: message }, { status });
  }
}
