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

export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

const LIBRARY_ROOT = path.join(process.cwd(), 'public', 'images', 'drive organice');
const ARCHIVE_ROOT = path.join(LIBRARY_ROOT, '.archive');

export type LibraryAsset = {
  filename: string;
  url: string;
  bytes: number;
  updatedAt: string;
};

function isCategory(value: string): value is MediaCategory {
  return MEDIA_CATEGORIES.some((category) => category.slug === value);
}

function getCategoryDirectory(category: string): string {
  if (!isCategory(category)) throw new Error('Categoría de imagen no permitida.');
  return path.join(LIBRARY_ROOT, category);
}

function sanitizeFilename(filename: string): string {
  const extension = path.extname(filename).toLowerCase();
  const base = path.basename(filename, extension)
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

export async function listCategoryAssets(category: MediaCategory): Promise<LibraryAsset[]> {
  const directory = getCategoryDirectory(category);
  const entries = await readdir(directory, { withFileTypes: true });
  const assets = await Promise.all(entries.filter((entry) => entry.isFile()).map(async (entry) => {
    const filePath = path.join(directory, entry.name);
    const info = await stat(filePath);
    return { filename: entry.name, url: toPublicUrl(category, entry.name), bytes: info.size, updatedAt: info.mtime.toISOString() };
  }));

  return assets
    .filter((asset) => ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(path.extname(asset.filename).toLowerCase()))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listLibraryAssets(category?: string) {
  const categories = category ? MEDIA_CATEGORIES.filter((item) => item.slug === category) : MEDIA_CATEGORIES;
  if (category && categories.length === 0) throw new Error('Categoría de imagen no permitida.');
  return Promise.all(categories.map(async (item) => ({ ...item, assets: await listCategoryAssets(item.slug) })));
}

export async function addLibraryAsset(category: string, file: File, preferredName?: string) {
  if (!isCategory(category)) throw new Error('Categoría de imagen no permitida.');
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) throw new Error('Formato no permitido. Use JPG, PNG, WebP o AVIF.');
  if (file.size > MAX_MEDIA_BYTES) throw new Error('La imagen supera el límite de 10 MB.');

  const directory = getCategoryDirectory(category);
  const extension = path.extname(file.name).toLowerCase();
  const baseName = preferredName?.trim()
    ? sanitizeFilename(`${preferredName}${extension}`)
    : sanitizeFilename(file.name);
  const filename = `${path.basename(baseName, extension)}-${Date.now()}${extension}`;
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: 'wx' });

  const info = await stat(path.join(directory, filename));
  return { filename, url: toPublicUrl(category, filename), bytes: info.size, updatedAt: info.mtime.toISOString() };
}

export async function renameLibraryAsset(category: string, filename: string, newName: string) {
  const directory = getCategoryDirectory(category);
  const safeOriginal = path.basename(filename);
  if (safeOriginal !== filename) throw new Error('Archivo no válido.');
  const extension = path.extname(safeOriginal).toLowerCase();
  const safeNew = sanitizeFilename(`${newName}${extension}`);
  const source = path.join(directory, safeOriginal);
  const destination = path.join(directory, safeNew);
  await rename(source, destination);
  const info = await stat(destination);
  return { filename: safeNew, url: toPublicUrl(category, safeNew), bytes: info.size, updatedAt: info.mtime.toISOString() };
}

export async function archiveLibraryAsset(category: string, filename: string) {
  const directory = getCategoryDirectory(category);
  const safeFilename = path.basename(filename);
  if (safeFilename !== filename) throw new Error('Archivo no válido.');
  const archiveDirectory = path.join(ARCHIVE_ROOT, category);
  await mkdir(archiveDirectory, { recursive: true });
  await rename(path.join(directory, safeFilename), path.join(archiveDirectory, `${Date.now()}-${safeFilename}`));
}
