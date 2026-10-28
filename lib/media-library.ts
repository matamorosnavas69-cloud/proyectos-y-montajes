import path from 'node:path';
import { mkdir, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_BUCKET, uploadProjectImage } from '@/lib/supabase/storage';

export const MEDIA_CATEGORIES = [
  { slug: 'canchas', label: 'Canchas', description: 'Infraestructura deportiva y superficies de juego' },
  { slug: 'parques', label: 'Parques', description: 'Recreación, juegos y superficies de seguridad' },
  { slug: 'piscina', label: 'Piscinas', description: 'Amenidades acuáticas y zonas de bienestar' },
  { slug: 'golf', label: 'Golf', description: 'Greens y paisajismo deportivo' },
  { slug: 'residencial', label: 'Residencial', description: 'Zonas comunes, terrazas y paisajismo' },
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number]['slug'];
export type ServiceSlug = 'canchas' | 'parques' | 'paisajismo';
export type MediaType = 'image' | 'video';

export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov']);

const LIBRARY_ROOT = path.join(process.cwd(), 'public', 'images', 'drive organice');
const ARCHIVE_ROOT = path.join(LIBRARY_ROOT, '.archive');

export type LibraryAsset = {
  id: string;
  filename: string;
  originalCategory?: string;
  url: string;
  bytes: number;
  updatedAt: string;
  type: MediaType;
  category: string;
  subcategory: string;
  title: string;
  badge?: string;
};

export const SUBCATEGORIES_BY_CATEGORY: Record<string, { id: string; label: string }[]> = {
  canchas: [
    { id: 'padel', label: 'Pádel Panorámico' },
    { id: 'futbol', label: 'Fútbol Sintético' },
    { id: 'golf', label: 'Greens de Golf' },
    { id: 'polideportivo', label: 'Polideportivo' },
    { id: 'general', label: 'General / Canchas' },
  ],
  parques: [
    { id: 'modulos', label: 'Módulos y Castillos' },
    { id: 'caucho', label: 'Pisos de Caucho EPDM' },
    { id: 'inclusivos', label: 'Juegos Inclusivos' },
    { id: 'bio-saludable', label: 'Gimnasios Bio-saludables' },
    { id: 'general', label: 'General / Parques' },
  ],
  piscina: [
    { id: 'piscinas', label: 'Piscinas y Wet Decks' },
    { id: 'deck', label: 'Decks y Soláriums' },
    { id: 'general', label: 'General / Piscinas' },
  ],
  golf: [
    { id: 'golf', label: 'Greens y Putting' },
    { id: 'paisajismo-golf', label: 'Paisajismo de Campo' },
    { id: 'general', label: 'General / Golf' },
  ],
  residencial: [
    { id: 'terrazas', label: 'Terrazas y Áticos' },
    { id: 'jardines', label: 'Jardines Residenciales' },
    { id: 'zonas-comunes', label: 'Zonas Comunes' },
    { id: 'piscinas', label: 'Piscinas Residenciales' },
    { id: 'general', label: 'General / Residencial' },
  ],
};

export const SERVICES_CONFIG = {
  canchas: {
    slug: 'canchas' as ServiceSlug,
    name: 'Canchas Deportivas y Pistas de Pádel',
    eyebrow: 'Ingeniería deportiva de élite',
    title: 'Obras que elevan la experiencia de competir.',
    description: 'Explore canchas sintéticas de fútbol, pistas de pádel panorámicas, greens de golf y cerramientos perimetrales ejecutados con estándares de clase mundial.',
    subcategories: [
      { id: 'todos', label: 'Todos los proyectos' },
      { id: 'padel', label: 'Pádel Panorámico' },
      { id: 'futbol', label: 'Fútbol Sintético' },
      { id: 'golf', label: 'Greens de Golf' },
    ],
  },
  parques: {
    slug: 'parques' as ServiceSlug,
    name: 'Parques Infantiles Integrales',
    eyebrow: 'Recreación y seguridad certificada',
    title: 'Cada zona de juego, resuelta hasta el último detalle.',
    description: 'Recorra una selección de instalaciones reales: módulos recreativos de alta resistencia, pisos amortiguantes continuos de caucho EPDM y espacios inclusivos.',
    subcategories: [
      { id: 'todos', label: 'Todos los proyectos' },
      { id: 'modulos', label: 'Módulos y Castillos' },
      { id: 'caucho', label: 'Pisos de Caucho EPDM' },
      { id: 'inclusivos', label: 'Juegos Inclusivos' },
    ],
  },
  paisajismo: {
    slug: 'paisajismo' as ServiceSlug,
    name: 'Paisajismo Residencial y Comercial',
    eyebrow: 'Paisajismo y bienestar exterior',
    title: 'Espacios exteriores que se disfrutan todos los días.',
    description: 'Intervenciones en zonas comunes de conjuntos, terrazas en áticos, cubiertas verdes y entornos de piscina con grama sintética atérmica decorativa.',
    subcategories: [
      { id: 'todos', label: 'Todos los proyectos' },
      { id: 'terrazas', label: 'Terrazas y Áticos' },
      { id: 'jardines', label: 'Jardines Residenciales' },
      { id: 'piscinas', label: 'Piscinas y Wet Decks' },
    ],
  },
} as const;

function isCategory(value: string): value is MediaCategory {
  return MEDIA_CATEGORIES.some((category) => category.slug === value);
}

function getCategoryDirectory(category: string): string {
  if (!isCategory(category)) throw new Error('Categoría de imagen no permitida.');
  return path.join(LIBRARY_ROOT, category);
}

function sanitizeFilename(filename: string): string {
  const extension = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, extension)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72);
  if (!base || !['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(extension)) {
    throw new Error('El nombre o el formato de imagen no es válido.');
  }
  return `${base}${extension}`;
}

function toPublicUrl(category: string, filename: string): string {
  return `/images/drive%20organice/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`;
}

function dynamicPath(directory: string, filename: string) {
  return path.join(directory, filename);
}

// In-memory cache to guarantee sub-millisecond responses on hot renders
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30 * 1000; // 30 seconds

export function invalidateMediaCache() {
  cache.clear();
}

/**
 * Retrieve set of archived/withdrawn filenames across database and disk
 */
export async function getArchivedFilenames(category?: string): Promise<Set<string>> {
  const archived = new Set<string>();

  // 1. Query PostgreSQL database via Prisma (canonical for serverless & local)
  try {
    const records = await prisma.archivedMediaAsset.findMany({
      where: category ? { category } : undefined,
      select: { filename: true },
    });
    for (const r of records) {
      archived.add(r.filename);
      archived.add(r.filename.toLowerCase());
    }
  } catch (dbErr) {
    console.warn('[MediaLibrary] DB archived lookup skipped/fallback:', dbErr instanceof Error ? dbErr.message : dbErr);
  }

  // 2. Query local disk .archive if accessible
  try {
    const targetDir = category ? path.join(ARCHIVE_ROOT, category) : ARCHIVE_ROOT;
    const entries = await readdir(targetDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isFile()) {
        const rawName = e.name.replace(/^\d+-/, '');
        archived.add(rawName);
        archived.add(rawName.toLowerCase());
        archived.add(e.name);
        archived.add(e.name.toLowerCase());
      }
    }
  } catch {
    // Normal in serverless (immutable /var/task)
  }

  return archived;
}

export type AssetMetadataOverride = {
  category: string;
  subcategory?: string | null;
  title?: string | null;
  badge?: string | null;
};

export async function getAllMetadataMap(): Promise<Map<string, AssetMetadataOverride>> {
  const map = new Map<string, AssetMetadataOverride>();
  try {
    const records = await prisma.mediaAssetMetadata.findMany();
    for (const r of records) {
      const item: AssetMetadataOverride = {
        category: r.category,
        subcategory: r.subcategory,
        title: r.title,
        badge: r.badge,
      };
      map.set(`${r.originalCategory}:${r.filename}`, item);
      map.set(`file:${r.filename}`, item);
    }
  } catch (err) {
    console.warn('[MediaLibrary] DB metadata lookup skipped/fallback:', err instanceof Error ? err.message : err);
  }
  return map;
}

function classifyAsset(
  filename: string,
  url: string,
  category: string,
  bytes: number,
  updatedAt: string,
  serviceHint?: ServiceSlug,
  meta?: AssetMetadataOverride
): LibraryAsset {
  const ext = path.extname(filename).toLowerCase();
  const isVideo = VIDEO_EXTENSIONS.has(ext);
  const type: MediaType = isVideo ? 'video' : 'image';
  const lowerName = filename.toLowerCase();
  const assignedCategory = meta?.category || category;
  const id = `${category}-${filename}`.replace(/[^a-zA-Z0-9_-]/g, '_');

  let subcategory = 'general';
  let title = 'Proyecto Ejecutado';
  let badge = 'Obra Verificada';

  const effectiveCategory = assignedCategory;
  if (serviceHint === 'canchas' || effectiveCategory === 'canchas' || effectiveCategory === 'golf') {
    if (isVideo) {
      subcategory = 'videos';
      badge = 'Video de Obra';
      title = 'Registro Técnico y Vista Aérea';
    } else if (effectiveCategory === 'golf' || lowerName.includes('golf') || lowerName.includes('green')) {
      subcategory = 'golf';
      badge = 'Golf & Putting';
      title = 'Putting Green Sintético de Alta Definición';
    } else if (lowerName.includes('padel') || url.includes('/padel/')) {
      subcategory = 'padel';
      badge = 'Pista de Pádel';
      title = 'Pista de Pádel con Cristal Templado';
    } else {
      subcategory = 'futbol';
      badge = 'Fútbol Sintético';
      title = 'Cancha de Césped Sintético Certificado';
    }
  } else if (serviceHint === 'parques' || effectiveCategory === 'parques') {
    if (isVideo) {
      subcategory = 'videos';
      badge = 'Video de Montaje';
      title = 'Instalación y Pruebas de Seguridad';
    } else if (lowerName.includes('epdm') || lowerName.includes('caucho') || lowerName.includes('piso')) {
      subcategory = 'caucho';
      badge = 'Piso EPDM';
      title = 'Piso de Seguridad Continuo Antigolpes';
    } else if (lowerName.includes('inclusiv') || lowerName.includes('acces')) {
      subcategory = 'inclusivos';
      badge = 'Inclusivo';
      title = 'Módulo Infantil de Acceso Universal';
    } else {
      subcategory = 'modulos';
      badge = 'Módulo Recreativo';
      title = 'Parque Infantil Estructura de Alto Tráfico';
    }
  } else if (serviceHint === 'paisajismo' || effectiveCategory === 'residencial' || effectiveCategory === 'piscina') {
    if (isVideo) {
      subcategory = 'videos';
      badge = 'Video de Recorrido';
      title = 'Recorrido Visual de Paisajismo Residencial';
    } else if (effectiveCategory === 'piscina' || lowerName.includes('piscina') || lowerName.includes('deck')) {
      subcategory = 'piscinas';
      badge = 'Zona Húmeda';
      title = 'Grama Decorativa para Piscina y Deck';
    } else if (lowerName.includes('terraza') || lowerName.includes('atico') || lowerName.includes('balcon')) {
      subcategory = 'terrazas';
      badge = 'Terraza & Ático';
      title = 'Transformación de Terraza Residencial';
    } else {
      subcategory = 'jardines';
      badge = 'Jardín & Verde';
      title = 'Grama Sintética Residencial Premium';
    }
  }

  // Explicit user metadata overrides take priority
  if (meta?.subcategory) subcategory = meta.subcategory;
  if (meta?.title) title = meta.title;
  if (meta?.badge) badge = meta.badge;

  return {
    id,
    filename,
    originalCategory: category,
    url,
    bytes,
    updatedAt,
    type,
    category: assignedCategory,
    subcategory,
    title,
    badge,
  };
}

async function readDirectoryAssets(
  dir: string,
  category: string,
  urlBuilder: (fname: string) => string,
  serviceHint?: ServiceSlug,
  includeVideos = true,
  archivedSet?: Set<string>,
  metadataMap?: Map<string, AssetMetadataOverride>
): Promise<LibraryAsset[]> {
  try {
    const archived = archivedSet ?? (await getArchivedFilenames(category));
    const entries = await readdir(dir, { withFileTypes: true });
    const fileEntries = entries.filter((e) => e.isFile());

    const assets = await Promise.all(
      fileEntries.map(async (entry) => {
        // Exclude archived/withdrawn assets
        if (archived.has(entry.name) || archived.has(entry.name.toLowerCase())) {
          return null;
        }

        const ext = path.extname(entry.name).toLowerCase();
        const isImg = IMAGE_EXTENSIONS.has(ext);
        const isVid = includeVideos && VIDEO_EXTENSIONS.has(ext);
        if (!isImg && !isVid) return null;

        const filePath = dynamicPath(dir, entry.name);
        try {
          const info = await stat(filePath);
          const meta = metadataMap?.get(`${category}:${entry.name}`) || metadataMap?.get(`file:${entry.name}`);
          return classifyAsset(
            entry.name,
            urlBuilder(entry.name),
            category,
            info.size,
            info.mtime.toISOString(),
            serviceHint,
            meta
          );
        } catch {
          return null;
        }
      })
    );

    return assets.filter((a): a is LibraryAsset => a !== null);
  } catch {
    return [];
  }
}

export async function getAllLibraryAssets(includeVideos = false): Promise<LibraryAsset[]> {
  const cacheKey = `all-assets:${includeVideos}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.timestamp < CACHE_TTL) {
    return hit.data as LibraryAsset[];
  }

  const metadataMap = await getAllMetadataMap();
  const archived = await getArchivedFilenames();
  const allAssets: LibraryAsset[] = [];

  for (const cat of MEDIA_CATEGORIES) {
    const directory = getCategoryDirectory(cat.slug);
    const serviceHint: ServiceSlug =
      cat.slug === 'canchas' || cat.slug === 'golf' ? 'canchas' : cat.slug === 'parques' ? 'parques' : 'paisajismo';

    // 1. Static disk assets
    const staticAssets = await readDirectoryAssets(
      directory,
      cat.slug,
      (fname) => toPublicUrl(cat.slug, fname),
      serviceHint,
      includeVideos,
      archived,
      metadataMap
    );
    allAssets.push(...staticAssets);

    // 2. Cloud assets
    try {
      const supabase = createClient();
      const folder = `gallery/${cat.slug}`;
      const { data: cloudFiles } = await supabase.storage.from(DEFAULT_BUCKET).list(folder, { limit: 1000 });
      if (cloudFiles && cloudFiles.length > 0) {
        const existingNames = new Set(staticAssets.map((a) => a.filename.toLowerCase()));
        for (const cf of cloudFiles) {
          if (!cf.name || cf.name === '.emptyFolderPlaceholder') continue;
          if (archived.has(cf.name) || archived.has(cf.name.toLowerCase())) continue;
          if (existingNames.has(cf.name.toLowerCase())) continue;
          const { data: pubData } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(`${folder}/${cf.name}`);
          const meta = metadataMap.get(`${cat.slug}:${cf.name}`) || metadataMap.get(`file:${cf.name}`);
          allAssets.push(
            classifyAsset(
              cf.name,
              pubData.publicUrl,
              cat.slug,
              cf.metadata?.size || 0,
              cf.updated_at || new Date().toISOString(),
              serviceHint,
              meta
            )
          );
        }
      }
    } catch {
      // Optional cloud storage integration
    }
  }

  cache.set(cacheKey, { data: allAssets, timestamp: Date.now() });
  return allAssets;
}

export async function listCategoryAssets(category: MediaCategory, includeVideos = false): Promise<LibraryAsset[]> {
  const all = await getAllLibraryAssets(includeVideos);
  return all
    .filter((asset) => asset.category === category)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listLibraryAssets(category?: string, includeVideos = false) {
  const all = await getAllLibraryAssets(includeVideos);
  const categories = category ? MEDIA_CATEGORIES.filter((item) => item.slug === category) : MEDIA_CATEGORIES;
  if (category && categories.length === 0) throw new Error('Categoría de imagen no permitida.');

  return categories.map((cat) => ({
    ...cat,
    assets: all
      .filter((asset) => asset.category === cat.slug)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  }));
}

export async function listServiceAssets(serviceSlug: ServiceSlug) {
  const cacheKey = `service:${serviceSlug}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.timestamp < CACHE_TTL) {
    return hit.data as { service: (typeof SERVICES_CONFIG)[ServiceSlug]; assets: LibraryAsset[] };
  }

  const service = SERVICES_CONFIG[serviceSlug];
  if (!service) throw new Error(`Servicio desconocido: ${serviceSlug}`);

  const archived = await getArchivedFilenames();
  let collected: LibraryAsset[] = [];

  if (serviceSlug === 'canchas') {
    const canchasAssets = await readDirectoryAssets(
      getCategoryDirectory('canchas'),
      'canchas',
      (fname) => toPublicUrl('canchas', fname),
      'canchas',
      false,
      archived
    );
    const golfAssets = await readDirectoryAssets(
      getCategoryDirectory('golf'),
      'golf',
      (fname) => toPublicUrl('golf', fname),
      'canchas',
      false,
      archived
    );
    const padelAssets = await readDirectoryAssets(
      path.join(process.cwd(), 'public', 'images', 'padel'),
      'canchas',
      (fname) => `/images/padel/${encodeURIComponent(fname)}`,
      'canchas',
      false,
      archived
    );
    const futbolAssets = await readDirectoryAssets(
      path.join(process.cwd(), 'public', 'images', 'futbol'),
      'canchas',
      (fname) => `/images/futbol/${encodeURIComponent(fname)}`,
      'canchas',
      false,
      archived
    );

    collected = [...padelAssets, ...futbolAssets, ...canchasAssets, ...golfAssets];
  } else if (serviceSlug === 'parques') {
    const parquesAssets = await readDirectoryAssets(
      getCategoryDirectory('parques'),
      'parques',
      (fname) => toPublicUrl('parques', fname),
      'parques',
      false,
      archived
    );
    collected = parquesAssets;
  } else if (serviceSlug === 'paisajismo') {
    const residencialAssets = await readDirectoryAssets(
      getCategoryDirectory('residencial'),
      'residencial',
      (fname) => toPublicUrl('residencial', fname),
      'paisajismo',
      false,
      archived
    );
    const piscinaAssets = await readDirectoryAssets(
      getCategoryDirectory('piscina'),
      'piscina',
      (fname) => toPublicUrl('piscina', fname),
      'paisajismo',
      false,
      archived
    );
    collected = [...residencialAssets, ...piscinaAssets];
  }

  // De-duplicate by URL or filename
  const seen = new Set<string>();
  const uniqueAssets = collected.filter((asset) => {
    if (seen.has(asset.url)) return false;
    seen.add(asset.url);
    return true;
  });

  // Prioritize high-quality curated shots at the front, followed by recent updates
  const sorted = uniqueAssets.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'image' ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  const result = { service, assets: sorted };
  cache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
}

export async function addLibraryAsset(category: string, file: File, preferredName?: string) {
  if (!isCategory(category)) throw new Error('Categoría de imagen no permitida.');
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error('Formato no permitido. Use JPG, PNG, WebP o AVIF.');
  if (file.size > MAX_MEDIA_BYTES) throw new Error('La imagen supera el límite de 10 MB.');

  const extension = path.extname(file.name).toLowerCase();
  const baseName = preferredName?.trim() ? sanitizeFilename(`${preferredName}${extension}`) : sanitizeFilename(file.name);
  const filename = `${path.basename(baseName, extension)}-${Date.now()}${extension}`;

  // 1. Try local disk write if environment allows (local development)
  try {
    const directory = getCategoryDirectory(category);
    await writeFile(dynamicPath(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
    const info = await stat(dynamicPath(directory, filename));
    invalidateMediaCache();
    return { filename, url: toPublicUrl(category, filename), bytes: info.size, updatedAt: info.mtime.toISOString() };
  } catch (fsErr) {
    // 2. Serverless / read-only filesystem: Upload directly to Supabase Storage
    try {
      const { url } = await uploadProjectImage(file, `gallery/${category}`);
      invalidateMediaCache();
      return {
        filename,
        url,
        bytes: file.size,
        updatedAt: new Date().toISOString(),
      };
    } catch (storageErr) {
      throw new Error(
        `Error al guardar la imagen: ${
          storageErr instanceof Error ? storageErr.message : 'No fue posible escribir en disco ni en la nube.'
        }`
      );
    }
  }
}

export async function renameLibraryAsset(category: string, filename: string, newName: string) {
  const directory = getCategoryDirectory(category);
  const safeOriginal = path.basename(filename);
  if (safeOriginal !== filename) throw new Error('Archivo no válido.');
  const extension = path.extname(safeOriginal).toLowerCase();
  const safeNew = sanitizeFilename(`${newName}${extension}`);
  const source = dynamicPath(directory, safeOriginal);
  const destination = dynamicPath(directory, safeNew);

  try {
    await rename(source, destination);
    const info = await stat(destination);
    invalidateMediaCache();
    return { filename: safeNew, url: toPublicUrl(category, safeNew), bytes: info.size, updatedAt: info.mtime.toISOString() };
  } catch {
    throw new Error(
      'En el entorno serverless de producción, los archivos estáticos empaquetados no pueden ser renombrados directamente en disco. Para cambiar la imagen, retírela o suba una nueva.'
    );
  }
}

/**
 * Archives an asset: registers it in the persistent database registry so it is
 * removed from public view and admin active view. Also moves on disk if writable.
 */
export async function archiveLibraryAsset(category: string, filename: string, actorEmail?: string) {
  if (!isCategory(category)) throw new Error('Categoría de imagen no permitida.');
  const safeFilename = path.basename(filename);
  if (safeFilename !== filename) throw new Error('Archivo no válido.');

  // Protect Hero integrity: Prevent archiving images active in public hero slides
  const { checkAssetActiveInHeroes } = await import('@/lib/hero-management');
  const heroCheck = await checkAssetActiveInHeroes(safeFilename);
  if (heroCheck.isUsed) {
    throw new Error(
      `No es posible archivar "${safeFilename}" porque está activa en el Hero de: ${heroCheck.services.join(', ')}. Retire o sustituya la imagen en la pestaña "Heroes de Servicios" antes de archivar.`
    );
  }

  let dbPersisted = false;

  // 1. Persist to database (canonical for serverless & local)
  try {
    await prisma.archivedMediaAsset.upsert({
      where: {
        category_filename: {
          category,
          filename: safeFilename,
        },
      },
      create: {
        category,
        filename: safeFilename,
        archivedBy: actorEmail || null,
      },
      update: {
        archivedAt: new Date(),
        archivedBy: actorEmail || null,
      },
    });
    dbPersisted = true;
  } catch (dbErr) {
    console.warn('[MediaLibrary] Database archival warning:', dbErr instanceof Error ? dbErr.message : dbErr);
  }

  // 2. Try disk move if local filesystem is writable (optional in dev, safely skipped in serverless)
  try {
    const directory = getCategoryDirectory(category);
    const archiveDirectory = path.join(ARCHIVE_ROOT, category);
    await mkdir(archiveDirectory, { recursive: true });
    await rename(dynamicPath(directory, safeFilename), dynamicPath(archiveDirectory, `${Date.now()}-${safeFilename}`));
  } catch (fsErr) {
    // Expected on Vercel / serverless (read-only filesystem)
    if (!dbPersisted) {
      throw new Error('No fue posible archivar la imagen ni en base de datos ni en disco.');
    }
  }

  invalidateMediaCache();
  return { success: true, category, filename: safeFilename };
}

/**
 * Restores a previously archived asset back to active galleries
 */
export async function restoreLibraryAsset(category: string, filename: string) {
  if (!isCategory(category)) throw new Error('Categoría de imagen no permitida.');
  const safeFilename = path.basename(filename);
  if (safeFilename !== filename) throw new Error('Archivo no válido.');

  try {
    await prisma.archivedMediaAsset.deleteMany({
      where: {
        category,
        filename: safeFilename,
      },
    });
  } catch (dbErr) {
    console.warn('[MediaLibrary] Database restore warning:', dbErr);
  }

  // If local disk archive contains the file, attempt moving back
  try {
    const directory = getCategoryDirectory(category);
    const archiveDirectory = path.join(ARCHIVE_ROOT, category);
    const entries = await readdir(archiveDirectory, { withFileTypes: true });
    const match = entries.find((e) => e.isFile() && (e.name === safeFilename || e.name.endsWith(`-${safeFilename}`)));
    if (match) {
      await rename(dynamicPath(archiveDirectory, match.name), dynamicPath(directory, safeFilename));
    }
  } catch {
    // Normal in serverless
  }

  invalidateMediaCache();
  return { success: true, category, filename: safeFilename };
}

/**
 * Lists archived assets for admin audit and recovery
 */
export async function listArchivedLibraryAssets(category?: string) {
  try {
    const records = await prisma.archivedMediaAsset.findMany({
      where: category ? { category } : undefined,
      orderBy: { archivedAt: 'desc' },
    });
    return records.map((r) => ({
      id: r.id,
      category: r.category,
      filename: r.filename,
      url: toPublicUrl(r.category, r.filename),
      archivedAt: r.archivedAt.toISOString(),
      archivedBy: r.archivedBy,
    }));
  } catch {
    return [];
  }
}

/**
 * Updates an asset's categorization, subcategory, descriptive title, and badge
 */
export async function updateAssetMetadata(params: {
  filename: string;
  originalCategory: string;
  category?: string;
  subcategory?: string | null;
  title?: string | null;
  badge?: string | null;
  actorEmail?: string;
}) {
  const safeFilename = path.basename(params.filename);
  if (safeFilename !== params.filename) throw new Error('Archivo no válido.');
  if (params.category && !isCategory(params.category)) {
    throw new Error('Categoría asignada no permitida.');
  }

  const assignedCat = params.category || params.originalCategory;

  const record = await prisma.mediaAssetMetadata.upsert({
    where: {
      originalCategory_filename: {
        originalCategory: params.originalCategory,
        filename: safeFilename,
      },
    },
    create: {
      originalCategory: params.originalCategory,
      filename: safeFilename,
      category: assignedCat,
      subcategory: params.subcategory?.trim() || null,
      title: params.title?.trim() || null,
      badge: params.badge?.trim() || null,
      updatedBy: params.actorEmail || null,
    },
    update: {
      category: assignedCat,
      subcategory: params.subcategory?.trim() || null,
      title: params.title?.trim() || null,
      badge: params.badge?.trim() || null,
      updatedBy: params.actorEmail || null,
      updatedAt: new Date(),
    },
  });

  invalidateMediaCache();
  return record;
}

