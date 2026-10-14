import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { HeroSlide } from '@/app/components/ServiceHeroSlider';
import {
  ServiceKey,
  SERVICE_PATH_MAP,
  SERVICE_LABELS,
  DEFAULT_HERO_SLIDES,
} from '@/lib/hero-constants';

/**
 * Validates that a slide asset exists, is not archived, and is compatible with the Hero slider
 */
export function validateSlideAssetIntegrity(src: string): { valid: boolean; reason?: string } {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return { valid: false, reason: 'Ruta de imagen inválida o vacía.' };
  }

  const cleanSrc = src.trim();
  const lower = cleanSrc.toLowerCase();

  // 1. Incompatible media formats (video, HEIC, PDF)
  const incompatibleExts = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.heic', '.pdf'];
  for (const ext of incompatibleExts) {
    if (lower.endsWith(ext)) {
      return {
        valid: false,
        reason: `Formato multimedia incompatible para el slider (${ext}). Se requieren imágenes web (JPG, PNG, WebP).`,
      };
    }
  }

  // 2. Prevent published archived assets
  if (lower.includes('/.archive/') || lower.includes('/archive/')) {
    return {
      valid: false,
      reason: 'No se puede publicar un activo que se encuentra archivado en la biblioteca multimedia.',
    };
  }

  // 3. Remote URL security and accessibility validation
  if (cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://')) {
    try {
      const parsed = new URL(cleanSrc);
      const isAllowedHost =
        parsed.hostname.endsWith('supabase.co') ||
        parsed.hostname.endsWith('proyectosymontajes.com') ||
        parsed.hostname.includes('supabase');
      if (!isAllowedHost) {
        return {
          valid: false,
          reason: `Dominio externo no autorizado (${parsed.hostname}). Solo se permiten URLs de Supabase Storage o del dominio corporativo.`,
        };
      }
      return { valid: true };
    } catch {
      return { valid: false, reason: 'URL remota malformada.' };
    }
  }

  // 4. Local filesystem physical existence check
  if (cleanSrc.startsWith('/')) {
    const publicPath = path.join(process.cwd(), 'public', cleanSrc.replace(/^\//, ''));
    if (!fs.existsSync(publicPath)) {
      return {
        valid: false,
        reason: `El archivo local no existe físicamente en el almacenamiento público: ${cleanSrc}`,
      };
    }
    return { valid: true };
  }

  return { valid: false, reason: `Ruta de activo no reconocida: ${cleanSrc}` };
}

export {
  type ServiceKey,
  SERVICE_PATH_MAP,
  SERVICE_LABELS,
  DEFAULT_HERO_SLIDES,
};

export interface ManagedHeroSlide {
  id: string;
  serviceSlug: string;
  section: string;
  assetId?: string | null;
  mediaSource: 'LOCAL' | 'SUPABASE';
  src: string;
  alt: string;
  title: string;
  location: string | null;
  tag: string | null;
  focalX: number;
  focalY: number;
  sortOrder: number;
  isActive: boolean;
  version: number;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveSlidePayload {
  id?: string;
  src: string;
  alt: string;
  title: string;
  location?: string | null;
  tag?: string | null;
  focalX?: number;
  focalY?: number;
  sortOrder: number;
  isActive: boolean;
  assetId?: string | null;
  mediaSource?: 'LOCAL' | 'SUPABASE';
}

/**
 * Ensures initial default slides are seeded into database if table has no slides for the service
 */
export async function ensureDefaultSlidesSeeded(serviceSlug: ServiceKey): Promise<void> {
  try {
    const count = await prisma.serviceHeroSlide.count({
      where: { serviceSlug, section: 'hero' },
    });
    if (count > 0) return;

    const defaults = DEFAULT_HERO_SLIDES[serviceSlug];
    if (!defaults || defaults.length === 0) return;

    await prisma.$transaction(
      defaults.map((slide, idx) =>
        prisma.serviceHeroSlide.create({
          data: {
            serviceSlug,
            section: 'hero',
            src: slide.src,
            alt: slide.alt,
            title: slide.title,
            location: slide.location || null,
            tag: slide.tag || null,
            focalX: slide.focalX ?? 50,
            focalY: slide.focalY ?? 50,
            sortOrder: idx,
            isActive: true,
            mediaSource: slide.src.startsWith('http') ? 'SUPABASE' : 'LOCAL',
            createdBy: 'SYSTEM_SEED',
          },
        })
      )
    );
  } catch (err) {
    console.warn(`[HeroManagement] Could not seed default slides for ${serviceSlug}:`, err);
  }
}

/**
 * Public accessor for service pages: retrieves active published slides with fallback
 */
export async function getPublishedHeroSlides(serviceSlug: ServiceKey): Promise<HeroSlide[]> {
  try {
    const slides = await prisma.serviceHeroSlide.findMany({
      where: {
        serviceSlug,
        section: 'hero',
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    if (slides.length > 0) {
      return slides.map((s) => ({
        src: s.src,
        alt: s.alt,
        title: s.title,
        location: s.location || '',
        tag: s.tag || '',
        focalX: s.focalX,
        focalY: s.focalY,
        focalPoint: `${s.focalX}% ${s.focalY}%`,
      }));
    }
  } catch (dbErr) {
    console.warn(`[HeroManagement] Failed fetching DB slides for ${serviceSlug}, using fallback:`, dbErr);
  }

  // Graceful deterministic fallback
  const fallback = DEFAULT_HERO_SLIDES[serviceSlug] || [];
  return fallback.map((s) => ({
    ...s,
    focalPoint: `${s.focalX ?? 50}% ${s.focalY ?? 50}%`,
  }));
}

/**
 * Admin accessor: retrieves all slides (active + inactive) for editor
 */
export async function getAdminHeroSlides(serviceSlug: ServiceKey): Promise<ManagedHeroSlide[]> {
  await ensureDefaultSlidesSeeded(serviceSlug);

  const slides = await prisma.serviceHeroSlide.findMany({
    where: { serviceSlug, section: 'hero' },
    orderBy: { sortOrder: 'asc' },
  });

  return slides.map((s) => ({
    id: s.id,
    serviceSlug: s.serviceSlug,
    section: s.section,
    assetId: s.assetId,
    mediaSource: (s.mediaSource as 'LOCAL' | 'SUPABASE') || 'LOCAL',
    src: s.src,
    alt: s.alt,
    title: s.title,
    location: s.location,
    tag: s.tag,
    focalX: s.focalX,
    focalY: s.focalY,
    sortOrder: s.sortOrder,
    isActive: s.isActive,
    version: s.version,
    updatedBy: s.updatedBy,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

/**
 * Admin mutator: saves and publishes hero slide configuration
 */
export async function saveAdminHeroSlides(
  serviceSlug: ServiceKey,
  slidesPayload: SaveSlidePayload[],
  actorEmail?: string
): Promise<ManagedHeroSlide[]> {
  if (!Array.isArray(slidesPayload) || slidesPayload.length === 0) {
    throw new Error('El Hero debe contener al menos una diapositiva.');
  }

  // Ensure at least 1 active slide
  const hasActive = slidesPayload.some((s) => s.isActive);
  if (!hasActive) {
    throw new Error('Debe existir al menos una diapositiva activa para publicar.');
  }

  // Validate integrity of every slide asset before mutating
  for (let idx = 0; idx < slidesPayload.length; idx++) {
    const slide = slidesPayload[idx];
    const check = validateSlideAssetIntegrity(slide.src);
    if (!check.valid) {
      throw new Error(`Diapositiva #${idx + 1} (${slide.title || 'Sin título'}) rechazada: ${check.reason}`);
    }
  }

  // Transactional replacement / synchronization
  const result = await prisma.$transaction(async (tx) => {
    // Delete existing slides for this service's hero
    await tx.serviceHeroSlide.deleteMany({
      where: { serviceSlug, section: 'hero' },
    });

    // Insert new order
    const created = [];
    for (let i = 0; i < slidesPayload.length; i++) {
      const p = slidesPayload[i];
      const record = await tx.serviceHeroSlide.create({
        data: {
          serviceSlug,
          section: 'hero',
          assetId: p.assetId || null,
          mediaSource: p.src.startsWith('http') ? 'SUPABASE' : 'LOCAL',
          src: p.src.trim(),
          alt: p.alt.trim() || 'Fotografía de obra real Proyectos y Montajes',
          title: p.title.trim() || 'Proyecto Ejecutado',
          location: p.location?.trim() || null,
          tag: p.tag?.trim() || null,
          focalX: Math.min(100, Math.max(0, p.focalX ?? 50)),
          focalY: Math.min(100, Math.max(0, p.focalY ?? 50)),
          sortOrder: i,
          isActive: Boolean(p.isActive),
          version: 1,
          updatedBy: actorEmail || 'ADMIN',
          createdBy: actorEmail || 'ADMIN',
        },
      });
      created.push(record);
    }
    return created;
  });

  // Revalidate Next.js cache for instant update without redeploy
  try {
    const targetPath = SERVICE_PATH_MAP[serviceSlug];
    if (targetPath) {
      revalidatePath(targetPath);
      revalidatePath('/'); // in case homepage showcases these
    }
  } catch (revalErr) {
    console.warn('[HeroManagement] Cache revalidation warning:', revalErr);
  }

  return result.map((s) => ({
    id: s.id,
    serviceSlug: s.serviceSlug,
    section: s.section,
    assetId: s.assetId,
    mediaSource: (s.mediaSource as 'LOCAL' | 'SUPABASE') || 'LOCAL',
    src: s.src,
    alt: s.alt,
    title: s.title,
    location: s.location,
    tag: s.tag,
    focalX: s.focalX,
    focalY: s.focalY,
    sortOrder: s.sortOrder,
    isActive: s.isActive,
    version: s.version,
    updatedBy: s.updatedBy,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

/**
 * Checks if a filename or URL is actively used in any Service Hero
 */
export async function checkAssetActiveInHeroes(urlOrFilename: string): Promise<{ isUsed: boolean; services: string[] }> {
  try {
    const cleanTerm = urlOrFilename.trim().toLowerCase();
    const slides = await prisma.serviceHeroSlide.findMany({
      where: {
        isActive: true,
        section: 'hero',
      },
      select: {
        serviceSlug: true,
        src: true,
      },
    });

    const matchingServices = new Set<string>();
    for (const slide of slides) {
      const slideSrcLower = slide.src.toLowerCase();
      if (slideSrcLower.includes(cleanTerm) || cleanTerm.includes(slideSrcLower.split('/').pop()?.toLowerCase() || '')) {
        const label = SERVICE_LABELS[slide.serviceSlug as ServiceKey] || slide.serviceSlug;
        matchingServices.add(label);
      }
    }

    return {
      isUsed: matchingServices.size > 0,
      services: Array.from(matchingServices),
    };
  } catch (err) {
    console.warn('[HeroManagement] Failed checking active asset in heroes:', err);
    return { isUsed: false, services: [] };
  }
}
