export interface PublicProjectDTO {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  location?: string | null;
  city?: string | null;
  mainImage?: string | null;
  gallery: string[];
  sqMeters?: number | null;
  duration?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  status: string;
  published: boolean;
  featured: boolean;
  portfolioOrder: number;
  testimonialQuote?: string | null;
  testimonialAuthor?: string | null;
  testimonialRole?: string | null;
  createdAt: string;
}

export interface ProjectImageRecord {
  id?: string;
  url: string;
  isCover?: boolean;
}

export interface ProjectDatabaseRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  client?: string | null;
  location?: string | null;
  city?: string | null;
  mainImage?: string | null;
  gallery?: string[];
  sqMeters?: number | null;
  duration?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  status?: string;
  published?: boolean;
  featured?: boolean;
  portfolioOrder?: number;
  testimonialQuote?: string | null;
  testimonialAuthor?: string | null;
  testimonialRole?: string | null;
  createdAt: string | Date;
  images?: ProjectImageRecord[];
  [key: string]: unknown;
}

/**
 * Strips all internal engineering, financial, and private notes,
 * returning exclusively public presentation data.
 */
export function toPublicProject(project: ProjectDatabaseRecord): PublicProjectDTO {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    client: project.client || null,
    location: project.location || null,
    city: project.city || null,
    mainImage: project.mainImage || (project.images && project.images.find((img) => img.isCover)?.url) || null,
    gallery: Array.isArray(project.gallery) && project.gallery.length > 0 
      ? project.gallery 
      : (project.images ? project.images.map((img) => img.url) : []),
    sqMeters: project.sqMeters || null,
    duration: project.duration || null,
    description: project.description || null,
    shortDescription: project.shortDescription || null,
    status: project.status || 'COMPLETED',
    published: Boolean(project.published),
    featured: Boolean(project.featured),
    portfolioOrder: typeof project.portfolioOrder === 'number' ? project.portfolioOrder : 0,
    testimonialQuote: project.testimonialQuote || null,
    testimonialAuthor: project.testimonialAuthor || null,
    testimonialRole: project.testimonialRole || null,
    createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : String(project.createdAt),
  };
}
