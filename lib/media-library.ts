import path from 'node:path';
import { mkdir, readdir, rename, stat, writeFile } from 'node:fs/promises';

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
  url: string;
  bytes: number;
  updatedAt: string;
  type: MediaType;
  category: string;
  subcategory: string;
  title: string;
  badge?: string;
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
      { id: 'videos', label: 'Videos y Tomas Aéreas' },
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
      { id: 'videos', label: 'Videos de Montaje' },
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
      { id: 'videos', label: 'Videos de Recorrido' },
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

function classifyAsset(
  filename: string,
  url: string,
  category: string,
  bytes: number,
  updatedAt: string,
  serviceHint?: ServiceSlug
): LibraryAsset {
  const ext = path.extname(filename).toLowerCase();
  const isVideo = VIDEO_EXTENSIONS.has(ext);
  const type: MediaType = isVideo ? 'video' : 'image';
  const lowerName = filename.toLowerCase();
  const id = `${category}-${filename}`.replace(/[^a-zA-Z0-9_-]/g, '_');

  let subcategory = 'general';
  let title = 'Proyecto Ejecutado';
  let badge = 'Obra Verificada';

  if (serviceHint === 'canchas' || category === 'canchas' || category === 'golf') {
    if (isVideo) {
      subcategory = 'videos';
      badge = 'Video de Obra';
      title = 'Registro Técnico y Vista Aérea';
    } else if (category === 'golf' || lowerName.includes('golf') || lowerName.includes('green')) {
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
  } else if (serviceHint === 'parques' || category === 'parques') {
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
  } else if (serviceHint === 'paisajismo' || category === 'residencial' || category === 'piscina') {
    if (isVideo) {
      subcategory = 'videos';
      badge = 'Video de Recorrido';
      title = 'Recorrido Visual de Paisajismo Residencial';
    } else if (category === 'piscina' || lowerName.includes('piscina') || lowerName.includes('deck')) {
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

  return {
    id,
    filename,
    url,
    bytes,
    updatedAt,
    type,
    category,
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
  includeVideos = true
): Promise<LibraryAsset[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const fileEntries = entries.filter((e) => e.isFile());

    const assets = await Promise.all(
      fileEntries.map(async (entry) => {
        const ext = path.extname(entry.name).toLowerCase();
        const isImg = IMAGE_EXTENSIONS.has(ext);
        const isVid = includeVideos && VIDEO_EXTENSIONS.has(ext);
        if (!isImg && !isVid) return null;

        const filePath = dynamicPath(dir, entry.name);
        try {
          const info = await stat(filePath);
          return classifyAsset(
            entry.name,
            urlBuilder(entry.name),
            category,
            info.size,
            info.mtime.toISOString(),
            serviceHint
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

export async function listCategoryAssets(category: MediaCategory, includeVideos = false): Promise<LibraryAsset[]> {
  const directory = getCategoryDirectory(category);
  const assets = await readDirectoryAssets(
    directory,
    category,
    (fname) => toPublicUrl(category, fname),
    category === 'canchas' || category === 'golf' ? 'canchas' : category === 'parques' ? 'parques' : 'paisajismo',
    includeVideos
  );
  return assets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listLibraryAssets(category?: string) {
  const categories = category ? MEDIA_CATEGORIES.filter((item) => item.slug === category) : MEDIA_CATEGORIES;
  if (category && categories.length === 0) throw new Error('Categoría de imagen no permitida.');
  return Promise.all(
    categories.map(async (item) => ({
      ...item,
      assets: await listCategoryAssets(item.slug, false),
    }))
  );
}

export async function listServiceAssets(serviceSlug: ServiceSlug) {
  const cacheKey = `service:${serviceSlug}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.timestamp < CACHE_TTL) {
    return hit.data as { service: (typeof SERVICES_CONFIG)[ServiceSlug]; assets: LibraryAsset[] };
  }

  const service = SERVICES_CONFIG[serviceSlug];
  if (!service) throw new Error(`Servicio desconocido: ${serviceSlug}`);

  let collected: LibraryAsset[] = [];

  if (serviceSlug === 'canchas') {
    // 1. Primary canchas directory (images + videos)
    const canchasAssets = await readDirectoryAssets(
      getCategoryDirectory('canchas'),
      'canchas',
      (fname) => toPublicUrl('canchas', fname),
      'canchas',
      true
    );
    // 2. Golf directory (images + videos)
    const golfAssets = await readDirectoryAssets(
      getCategoryDirectory('golf'),
      'golf',
      (fname) => toPublicUrl('golf', fname),
      'canchas',
      true
    );
    // 3. Dedicated padel images
    const padelAssets = await readDirectoryAssets(
      path.join(process.cwd(), 'public', 'images', 'padel'),
      'canchas',
      (fname) => `/images/padel/${encodeURIComponent(fname)}`,
      'canchas',
      true
    );
    // 4. Dedicated futbol images
    const futbolAssets = await readDirectoryAssets(
      path.join(process.cwd(), 'public', 'images', 'futbol'),
      'canchas',
      (fname) => `/images/futbol/${encodeURIComponent(fname)}`,
      'canchas',
      true
    );

    collected = [...padelAssets, ...futbolAssets, ...canchasAssets, ...golfAssets];
  } else if (serviceSlug === 'parques') {
    const parquesAssets = await readDirectoryAssets(
      getCategoryDirectory('parques'),
      'parques',
      (fname) => toPublicUrl('parques', fname),
      'parques',
      true
    );
    collected = parquesAssets;
  } else if (serviceSlug === 'paisajismo') {
    const residencialAssets = await readDirectoryAssets(
      getCategoryDirectory('residencial'),
      'residencial',
      (fname) => toPublicUrl('residencial', fname),
      'paisajismo',
      true
    );
    const piscinaAssets = await readDirectoryAssets(
      getCategoryDirectory('piscina'),
      'piscina',
      (fname) => toPublicUrl('piscina', fname),
      'paisajismo',
      true
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
    // Images before videos in default view so hero is photo
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
  const directory = getCategoryDirectory(category);
  const extension = path.extname(file.name).toLowerCase();
  const baseName = preferredName?.trim() ? sanitizeFilename(`${preferredName}${extension}`) : sanitizeFilename(file.name);
  const filename = `${path.basename(baseName, extension)}-${Date.now()}${extension}`;
  await writeFile(dynamicPath(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
  const info = await stat(dynamicPath(directory, filename));
  invalidateMediaCache();
  return { filename, url: toPublicUrl(category, filename), bytes: info.size, updatedAt: info.mtime.toISOString() };
}

export async function renameLibraryAsset(category: string, filename: string, newName: string) {
  const directory = getCategoryDirectory(category);
  const safeOriginal = path.basename(filename);
  if (safeOriginal !== filename) throw new Error('Archivo no válido.');
  const extension = path.extname(safeOriginal).toLowerCase();
  const safeNew = sanitizeFilename(`${newName}${extension}`);
  const source = dynamicPath(directory, safeOriginal);
  const destination = dynamicPath(directory, safeNew);
  await rename(source, destination);
  const info = await stat(destination);
  invalidateMediaCache();
  return { filename: safeNew, url: toPublicUrl(category, safeNew), bytes: info.size, updatedAt: info.mtime.toISOString() };
}

export async function archiveLibraryAsset(category: string, filename: string) {
  const directory = getCategoryDirectory(category);
  const safeFilename = path.basename(filename);
  if (safeFilename !== filename) throw new Error('Archivo no válido.');
  const archiveDirectory = path.join(ARCHIVE_ROOT, category);
  await mkdir(archiveDirectory, { recursive: true });
  await rename(dynamicPath(directory, safeFilename), dynamicPath(archiveDirectory, `${Date.now()}-${safeFilename}`));
  invalidateMediaCache();
}
