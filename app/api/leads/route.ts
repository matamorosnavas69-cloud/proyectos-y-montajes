import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security/rateLimit';

const MAX_NOTE_LENGTH = 4000;
const CONTACT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, limit = 180): string | null {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, limit) : null;
}

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'public_ip';
    const rate = checkRateLimit({ windowMs: 600000, max: 5, identifier: ip, action: 'public_lead_submission' });
    if (!rate.success) return NextResponse.json({ error: 'Demasiadas solicitudes', message: 'Por favor espere unos minutos antes de enviar otra solicitud de asesoría.' }, { status: 429 });

    const body = await request.json();
    if (cleanText(body.website, 120)) return NextResponse.json({ success: true, message: 'Solicitud recibida.' }, { status: 201 });

    const name = cleanText(body.name);
    const phone = cleanText(body.phone, 40);
    const email = cleanText(body.email, 254)?.toLowerCase() || null;
    if (!name) return NextResponse.json({ error: 'Bad Request', message: 'El nombre es obligatorio.' }, { status: 400 });
    if (!phone && !email) return NextResponse.json({ error: 'Bad Request', message: 'Ingrese WhatsApp o correo para que un especialista pueda responderle.' }, { status: 400 });
    if (email && !CONTACT_EMAIL.test(email)) return NextResponse.json({ error: 'Bad Request', message: 'Ingrese un correo electrónico válido.' }, { status: 400 });

    const projectType = cleanText(body.projectType) || 'Infraestructura Deportiva / Paisajismo';
    const rawBudget = body.estimatedBudget;
    const estimatedBudget = typeof rawBudget === 'number' && Number.isFinite(rawBudget) && rawBudget > 0 ? rawBudget : null;
    const priority = estimatedBudget && estimatedBudget >= 80000000 ? 'ALTA' : estimatedBudget && estimatedBudget >= 30000000 ? 'MEDIA' : 'BAJA';
    const notes = cleanText(body.notes, MAX_NOTE_LENGTH);
    const duplicateWhere = phone && email ? { OR: [{ phone }, { email }] } : phone ? { phone } : { email: email! };
    const duplicate = await prisma.lead.findFirst({ where: duplicateWhere, orderBy: { createdAt: 'desc' } });

    if (duplicate && duplicate.status !== 'PERDIDO') {
      await prisma.leadActivity.create({ data: { leadId: duplicate.id, type: 'NOTE', author: 'Sistema Web Público', description: `Nuevo brief web recibido para evitar duplicado.\n\n${notes || 'Sin notas adicionales.'}` } });
      return NextResponse.json({ success: true, message: 'Actualizamos su solicitud con el nuevo brief. Un especialista se comunicará a la brevedad.', leadId: duplicate.id, duplicate: true }, { status: 200 });
    }

    const lead = await prisma.lead.create({ data: {
      name, company: cleanText(body.company), email, phone, projectType,
      city: cleanText(body.city), location: cleanText(body.location, 300), notes,
      estimatedBudget, estimatedValue: estimatedBudget, source: 'WEBSITE', status: 'NUEVO', priority,
      nextAction: 'Revisar brief web y contactar al prospecto.', nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      activities: { create: [{ type: 'NOTE', author: 'Sistema Web Público', description: `Solicitud de asesoría técnica calificada desde el portal web. Prioridad inicial: ${priority}.\n\n${notes || 'Sin brief adicional.'}` }] },
    } });

    return NextResponse.json({ success: true, message: 'Recibimos su brief. Un ingeniero especialista se comunicará con usted a la brevedad.', leadId: lead.id }, { status: 201 });
  } catch (error: unknown) {
    console.error('[Public Lead Ingest Error]', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud. Por favor intenta de nuevo.' }, { status: 500 });
  }
}
