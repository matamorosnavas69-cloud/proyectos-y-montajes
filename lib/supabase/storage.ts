import { createClient } from './client';

export const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'proyectos';

export interface UploadProgress {
  file: File;
  progress: number;
  url?: string;
  error?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

/**
 * Sanitizes a file name for safe cloud storage keys
 */
export function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-');
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Uploads a single project image to Supabase Storage
 */
export async function uploadProjectImage(
  file: File,
  folder: string = 'gallery',
  bucket: string = DEFAULT_BUCKET
): Promise<{ url: string; path: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Formato "${file.type}" no permitido. Formatos válidos: JPG, PNG, WebP, AVIF.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`El archivo supera el límite de 10 MB (${(file.size / 1024 / 1024).toFixed(1)} MB).`);
  }

  const supabase = createClient();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanBase = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ''));
  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const filePath = `${folder}/${cleanBase}-${uniqueId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error(`[Supabase Storage] Error uploading ${file.name}:`, uploadError);
    throw new Error(uploadError.message || 'Error al subir la imagen al almacenamiento');
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
}

/**
 * Uploads multiple images concurrently with individual progress tracking
 */
export async function uploadMultipleProjectImages(
  files: File[],
  onProgress?: (index: number, state: UploadProgress) => void,
  folder: string = 'gallery',
  bucket: string = DEFAULT_BUCKET
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i, { file, progress: 15, status: 'uploading' });

    try {
      onProgress?.(i, { file, progress: 50, status: 'uploading' });
      const { url } = await uploadProjectImage(file, folder, bucket);
      results.push(url);
      onProgress?.(i, { file, progress: 100, url, status: 'completed' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al subir archivo';
      onProgress?.(i, { file, progress: 0, error: message, status: 'error' });
      throw err;
    }
  }

  return results;
}
