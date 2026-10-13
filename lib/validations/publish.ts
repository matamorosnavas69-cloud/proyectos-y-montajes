export interface PublishValidationResult {
  canPublish: boolean;
  missingFields: string[];
  reasons: string[];
}

export interface PublishableProjectCandidate {
  title?: string | null;
  slug?: string | null;
  category?: string | null;
  mainImage?: string | null;
  gallery?: string[] | null;
  images?: Array<{ url: string; isCover?: boolean }> | null;
  description?: string | null;
  shortDescription?: string | null;
  location?: string | null;
  city?: string | null;
  technicalSheet?: {
    specifications?: unknown;
    materials?: unknown[];
    observations?: string | null;
  } | null;
}

/**
 * State machine validator to transition a project from DRAFT/PRIVATE to PUBLISHED.
 * Guarantees that incomplete or broken projects cannot be exposed in the public portfolio.
 */
export function validateProjectPublishable(project: PublishableProjectCandidate): PublishValidationResult {
  const missingFields: string[] = [];
  const reasons: string[] = [];

  // 1. Title verification
  const trimmedTitle = (project.title || '').trim();
  if (!trimmedTitle || trimmedTitle.length < 5) {
    missingFields.push('Título formal de la obra (mínimo 5 caracteres)');
    reasons.push('El título es requerido para la indexación y encabezado del portafolio.');
  }

  // 2. Slug integrity
  const trimmedSlug = (project.slug || '').trim();
  if (!trimmedSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
    missingFields.push('Slug URL válido');
    reasons.push('Se requiere un identificador slug limpio y estable para la ruta pública.');
  }

  // 3. Category
  const trimmedCat = (project.category || '').trim();
  if (!trimmedCat) {
    missingFields.push('Categoría de infraestructura deportiva o paisajismo');
    reasons.push('El portafolio clasifica los proyectos por su especialidad técnica.');
  }

  // 4. Cover Image
  const hasMainImage = Boolean(project.mainImage && project.mainImage.trim());
  const hasCoverImage = Boolean(project.images?.some((img) => img.isCover && img.url));
  const hasGalleryFirst = Boolean(project.gallery && project.gallery.length > 0 && project.gallery[0]);

  if (!hasMainImage && !hasCoverImage && !hasGalleryFirst) {
    missingFields.push('Fotografía de portada o imagen principal');
    reasons.push('El portafolio público requiere una imagen de portada de alta resolución.');
  }

  // 5. Public Description
  const desc = (project.description || '').trim();
  const shortDesc = (project.shortDescription || '').trim();
  if (desc.length < 20 && shortDesc.length < 20) {
    missingFields.push('Descripción pública del proyecto (mínimo 20 caracteres)');
    reasons.push('Se requiere un texto descriptivo para los visitantes y la metadata SEO.');
  }

  // 6. Geographic Context
  const hasLocation = Boolean(project.location && project.location.trim());
  const hasCity = Boolean(project.city && project.city.trim());
  if (!hasLocation && !hasCity) {
    missingFields.push('Ciudad o ubicación de la obra');
    reasons.push('Es mandatorio especificar la localización geográfica del proyecto.');
  }

  return {
    canPublish: missingFields.length === 0,
    missingFields,
    reasons,
  };
}
