import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 1 minute cache

export interface PublicBeforeAfterProject {
  id: string;
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  beforeImage: string;
  afterImage: string;
  stats: { label: string; value: string }[];
}

// Fallback baseline projects if database is empty
export const FALLBACK_BEFORE_AFTER_PROJECTS: PublicBeforeAfterProject[] = [
  {
    id: 'cancha-futbol-01',
    title: 'Campo Sintético de Fútbol Profesional',
    location: 'Floridablanca, Santander',
    category: 'Fútbol',
    categoryColor: 'bg-green-600',
    beforeImage: '/images/before-after/before-cancha.jpg',
    afterImage: '/images/before-after/after-cancha.JPG',
    stats: [
      { label: 'Área', value: '850 m²' },
      { label: 'Duración', value: '45 días' },
    ],
  },
  {
    id: 'parque-infantil-01',
    title: 'Parque Infantil Integral con Piso EPDM',
    location: 'Bucaramanga, Santander',
    category: 'Parques',
    categoryColor: 'bg-brand-gold',
    beforeImage: '/images/before-after/before-park.jpg',
    afterImage: '/images/before-after/after-park.jpg',
    stats: [
      { label: 'Área', value: '320 m²' },
      { label: 'Duración', value: '25 días' },
    ],
  },
  {
    id: 'zona-humeda-01',
    title: 'Zona Húmeda & Entorno de Piscina',
    location: 'Ruitoque Condominio, Santander',
    category: 'Paisajismo',
    categoryColor: 'bg-amber-600',
    beforeImage: '/images/before-after/before-pool.jpg',
    afterImage: '/images/before-after/after-pool.JPG',
    stats: [
      { label: 'Área', value: '180 m²' },
      { label: 'Duración', value: '15 días' },
    ],
  },
];

export async function GET() {
  try {
    const dbProjects = await prisma.beforeAfterProject.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (dbProjects && dbProjects.length > 0) {
      const formatted: PublicBeforeAfterProject[] = dbProjects.map((p) => {
        const stats: { label: string; value: string }[] = [];
        if (p.area) stats.push({ label: 'Área', value: p.area });
        if (p.duration) stats.push({ label: 'Duración', value: p.duration });

        return {
          id: p.id,
          title: p.title,
          location: p.location,
          category: p.category,
          categoryColor: p.categoryColor || 'bg-brand-green',
          beforeImage: p.beforeImage,
          afterImage: p.afterImage,
          stats: stats.length > 0 ? stats : [{ label: 'Estado', value: 'Entregado' }],
        };
      });

      return NextResponse.json({ projects: formatted, source: 'DATABASE' });
    }

    return NextResponse.json({
      projects: FALLBACK_BEFORE_AFTER_PROJECTS,
      source: 'FALLBACK',
    });
  } catch (error) {
    console.error('[API BeforeAfter] Error querying database:', error);
    return NextResponse.json({
      projects: FALLBACK_BEFORE_AFTER_PROJECTS,
      source: 'FALLBACK_ON_ERROR',
    });
  }
}
