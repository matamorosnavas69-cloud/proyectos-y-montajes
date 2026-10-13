import { z } from 'zod';

/**
 * Zod Schemas for Category Technical Specifications
 */

// Padel Courts Specification Schema
export const PadelSpecsSchema = z.object({
  structure: z.string().max(300).optional().nullable(),
  glassThickness: z.string().max(100).optional().nullable(),
  turfType: z.string().max(200).optional().nullable(),
  lighting: z.string().max(200).optional().nullable(),
  subbase: z.string().max(300).optional().nullable(),
  drainage: z.string().max(200).optional().nullable(),
  certification: z.string().max(100).optional().nullable(),
  warranty: z.string().max(100).optional().nullable(),
}).passthrough();

// Football / Soccer Synthetic Turf Specification Schema
export const FootballSpecsSchema = z.object({
  turfType: z.string().max(200).optional().nullable(),
  drainageSystem: z.string().max(200).optional().nullable(),
  subbase: z.string().max(300).optional().nullable(),
  fencing: z.string().max(200).optional().nullable(),
  lighting: z.string().max(200).optional().nullable(),
  equipment: z.string().max(200).optional().nullable(),
  infill: z.string().max(200).optional().nullable(),
  certification: z.string().max(100).optional().nullable(),
  warranty: z.string().max(100).optional().nullable(),
}).passthrough();

// Landscaping, Gardens & Synthetic Grass Schema
export const LandscapingSpecsSchema = z.object({
  turfType: z.string().max(200).optional().nullable(),
  substrate: z.string().max(300).optional().nullable(),
  irrigation: z.string().max(200).optional().nullable(),
  drainage: z.string().max(200).optional().nullable(),
  curbs: z.string().max(200).optional().nullable(),
  vegetation: z.string().max(300).optional().nullable(),
  lighting: z.string().max(200).optional().nullable(),
  maintenance: z.string().max(200).optional().nullable(),
}).passthrough();

// Playgrounds Specification Schema
export const PlaygroundsSpecsSchema = z.object({
  gameTypes: z.string().max(300).optional().nullable(),
  targetAge: z.string().max(100).optional().nullable(),
  safetySurface: z.string().max(200).optional().nullable(),
  structures: z.string().max(200).optional().nullable(),
  standard: z.string().max(150).optional().nullable(),
  equipment: z.string().max(200).optional().nullable(),
  warranty: z.string().max(100).optional().nullable(),
}).passthrough();

// Multisport Courts Schema
export const MultisportSpecsSchema = z.object({
  flooring: z.string().max(200).optional().nullable(),
  demarcation: z.string().max(200).optional().nullable(),
  lighting: z.string().max(200).optional().nullable(),
  equipment: z.string().max(200).optional().nullable(),
  subbase: z.string().max(200).optional().nullable(),
  warranty: z.string().max(100).optional().nullable(),
}).passthrough();

// Maintenance Specification Schema
export const MaintenanceSpecsSchema = z.object({
  serviceType: z.string().max(200).optional().nullable(),
  frequency: z.string().max(100).optional().nullable(),
  equipmentUsed: z.string().max(200).optional().nullable(),
  infillReplenishment: z.string().max(200).optional().nullable(),
  warranty: z.string().max(100).optional().nullable(),
}).passthrough();

// Generic fallback schema for other categories
export const GenericSpecsSchema = z.record(z.string(), z.unknown());

/**
 * Validates specifications object against category requirements.
 * Sanitizes entries and returns safe, typed JSON for storage in PostgreSQL.
 */
export function validateSpecifications(category: string, rawSpecs: unknown): Record<string, unknown> {
  if (!rawSpecs || typeof rawSpecs !== 'object' || Array.isArray(rawSpecs)) {
    return {};
  }

  const cat = (category || '').toLowerCase().trim();

  let parsed: Record<string, unknown>;

  if (cat.includes('pádel') || cat.includes('padel') || cat.includes('tenis')) {
    parsed = PadelSpecsSchema.parse(rawSpecs) as Record<string, unknown>;
  } else if (cat.includes('fútbol') || cat.includes('futbol') || cat.includes('canchas sintéticas')) {
    parsed = FootballSpecsSchema.parse(rawSpecs) as Record<string, unknown>;
  } else if (cat.includes('paisajismo') || cat.includes('grama sintética') || cat.includes('jardines') || cat.includes('terrazas')) {
    parsed = LandscapingSpecsSchema.parse(rawSpecs) as Record<string, unknown>;
  } else if (cat.includes('parques') || cat.includes('infantiles')) {
    parsed = PlaygroundsSpecsSchema.parse(rawSpecs) as Record<string, unknown>;
  } else if (cat.includes('polideportivos') || cat.includes('múltiples')) {
    parsed = MultisportSpecsSchema.parse(rawSpecs) as Record<string, unknown>;
  } else if (cat.includes('mantenimiento')) {
    parsed = MaintenanceSpecsSchema.parse(rawSpecs) as Record<string, unknown>;
  } else {
    parsed = GenericSpecsSchema.parse(rawSpecs);
  }

  // Filter out null/undefined/empty string keys for clean storage
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      cleaned[key] = typeof value === 'string' ? value.trim() : value;
    }
  }

  return cleaned;
}
