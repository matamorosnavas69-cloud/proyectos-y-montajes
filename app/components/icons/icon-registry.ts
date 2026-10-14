/**
 * Brand Icon & Illustration Registry — Proyectos y Montajes
 *
 * Implements a hybrid design system architecture:
 * - Linear & Functional Icons (24-64px): Pure scalable SVG vectors.
 * - Architectural & Isometric Illustrations (96-240px): High-fidelity transparent WebP assets with PNG masters.
 */

export type AssetCategory = "sports" | "recreational" | "landscaping" | "technical" | "brand";
export type AssetFormat = "svg-vector" | "raster-illustration";

export interface BrandAssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  format: AssetFormat;
  description: string;
  recommendedSize: {
    min: number;
    default: number;
    max: number;
  };
  paths: {
    svg?: string;
    webp?: string;
    masterPng?: string;
  };
  altText: string;
}

export const BRAND_ASSET_REGISTRY: Record<string, BrandAssetDefinition> = {
  // ==========================================
  // 1. CORPORATE PILLARS (ISOMETRIC ARTWORK)
  // ==========================================
  "padel-court-isometric": {
    id: "padel-court-isometric",
    name: "Cancha de Pádel Panorámica Isométrica",
    category: "sports",
    format: "raster-illustration",
    description: "Ilustración isométrica con estructura de vidrio templado, césped texturizado y sub-base drenante.",
    recommendedSize: { min: 96, default: 160, max: 320 },
    paths: {
      webp: "/brand/illustrations/padel-court-isometric.webp",
      masterPng: "/brand/illustrations/padel-court-isometric.png",
    },
    altText: "Ilustración isométrica de cancha de pádel profesional Proyectos y Montajes",
  },
  "playground-castle-isometric": {
    id: "playground-castle-isometric",
    name: "Parque Infantil Modular Temático",
    category: "recreational",
    format: "raster-illustration",
    description: "Estructura recreativa infantil con torres de madera, toboganes de espiral y área de seguridad.",
    recommendedSize: { min: 96, default: 160, max: 320 },
    paths: {
      webp: "/brand/illustrations/playground-castle-isometric.webp",
      masterPng: "/brand/illustrations/playground-castle-isometric.png",
    },
    altText: "Estructura recreativa infantil modular para urbanismos y parques públicos",
  },
  "landscaping-pergola-terrace": {
    id: "landscaping-pergola-terrace",
    name: "Paisajismo Residencial con Pérgola y Terraza",
    category: "landscaping",
    format: "raster-illustration",
    description: "Diseño de jardín con pérgola arquitectónica, césped sintético decorativo y vegetación perimetral.",
    recommendedSize: { min: 96, default: 160, max: 320 },
    paths: {
      webp: "/brand/illustrations/landscaping-pergola-terrace.webp",
      masterPng: "/brand/illustrations/landscaping-pergola-terrace.png",
    },
    altText: "Arquitectura de exteriores, jardín zen y terraza residencial con pérgola",
  },

  // ==========================================
  // 2. LANDSCAPING TECHNICAL CUTAWAYS
  // ==========================================
  "landscaping-fibers": {
    id: "landscaping-fibers",
    name: "Detalle de Fibras Sintéticas y Relleno",
    category: "technical",
    format: "raster-illustration",
    description: "Detalle macro de hebras monofilamento con memoria de forma y arena de sílice graduada.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/landscaping-fibers.webp",
      masterPng: "/brand/illustrations/landscaping-fibers.png",
    },
    altText: "Corte microscópico de fibras sintéticas y arena de sílice",
  },
  "landscaping-vertical-garden": {
    id: "landscaping-vertical-garden",
    name: "Jardín Vertical y Muro Verde",
    category: "landscaping",
    format: "raster-illustration",
    description: "Panel botánico vertical con especies arquitectónicas y sistema de fijación resistente a intemperie.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/landscaping-vertical-garden.webp",
      masterPng: "/brand/illustrations/landscaping-vertical-garden.png",
    },
    altText: "Muro verde y jardín vertical para fachadas y áreas interiores",
  },
  "landscaping-drainage": {
    id: "landscaping-drainage",
    name: "Corte Técnico de Drenaje y Sub-Base",
    category: "technical",
    format: "raster-illustration",
    description: "Corte transversal con sistema de drenaje profundo, grava graduada, geotextil y manto de césped.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/landscaping-drainage.webp",
      masterPng: "/brand/illustrations/landscaping-drainage.png",
    },
    altText: "Corte técnico del sistema de filtración y drenaje multicapa",
  },
  "landscaping-terrace-lawn": {
    id: "landscaping-terrace-lawn",
    name: "Césped Sintético en Terraza y Deck",
    category: "landscaping",
    format: "raster-illustration",
    description: "Instalación de grama sobre losa de concreto con canalización de agua perimetral.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/landscaping-terrace-lawn.webp",
      masterPng: "/brand/illustrations/landscaping-terrace-lawn.png",
    },
    altText: "Instalación de césped sobre losa de terraza residencial y deck",
  },

  // ==========================================
  // 3. RECREATIONAL & ATHLETIC EQUIPMENT
  // ==========================================
  "playground-modular-castle": {
    id: "playground-modular-castle",
    name: "Módulo Lúdico con Puentes y Resbaladillas",
    category: "recreational",
    format: "raster-illustration",
    description: "Módulo infantil multifuncional con túneles de gateo, pasarelas colgantes y rampas.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/playground-modular-castle.webp",
      masterPng: "/brand/illustrations/playground-modular-castle.png",
    },
    altText: "Parque infantil con torres y pasarelas lúdicas",
  },
  "playground-safety-floor": {
    id: "playground-safety-floor",
    name: "Piso Amortiguante EPDM Continuo",
    category: "technical",
    format: "raster-illustration",
    description: "Corte de caucho vaciado in-situ con capa elástica SBR y capa de desgaste EPDM UV.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/playground-safety-floor.webp",
      masterPng: "/brand/illustrations/playground-safety-floor.png",
    },
    altText: "Estructura multicapa del piso de seguridad de caucho EPDM",
  },
  "outdoor-fitness-gym": {
    id: "outdoor-fitness-gym",
    name: "Gimnasio Biosaludable al Aire Libre",
    category: "recreational",
    format: "raster-illustration",
    description: "Aparatos de acondicionamiento físico de bajo impacto para parques urbanos y clubes.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/outdoor-fitness-gym.webp",
      masterPng: "/brand/illustrations/outdoor-fitness-gym.png",
    },
    altText: "Equipamiento de gimnasio biosaludable y cardiovascular exterior",
  },
  "calisthenics-frame": {
    id: "calisthenics-frame",
    name: "Estación de Calistenia Urbana Pro",
    category: "recreational",
    format: "raster-illustration",
    description: "Estructura de barras de dominadas, paralelas y fondos con anclaje de alta resistencia.",
    recommendedSize: { min: 96, default: 160, max: 280 },
    paths: {
      webp: "/brand/illustrations/calisthenics-frame.webp",
      masterPng: "/brand/illustrations/calisthenics-frame.png",
    },
    altText: "Parque de barras y calistenia de alto rendimiento",
  },

  // ==========================================
  // 4. ISOMETRIC SPORTS BADGES
  // ==========================================
  "court-futbol-isometric": {
    id: "court-futbol-isometric",
    name: "Insignia Cancha de Fútbol Isométrica",
    category: "sports",
    format: "raster-illustration",
    description: "Cancha de fútbol sintético con arquerías en perspectiva isométrica.",
    recommendedSize: { min: 64, default: 120, max: 200 },
    paths: {
      webp: "/brand/illustrations/court-futbol-isometric.webp",
      masterPng: "/brand/illustrations/court-futbol-isometric.png",
    },
    altText: "Insignia isométrica de cancha de fútbol",
  },
  "court-padel-badge-isometric": {
    id: "court-padel-badge-isometric",
    name: "Insignia Cancha de Pádel Isométrica",
    category: "sports",
    format: "raster-illustration",
    description: "Cancha de pádel con muros perimetrales en perspectiva isométrica.",
    recommendedSize: { min: 64, default: 120, max: 200 },
    paths: {
      webp: "/brand/illustrations/court-padel-badge-isometric.webp",
      masterPng: "/brand/illustrations/court-padel-badge-isometric.png",
    },
    altText: "Insignia isométrica de cancha de pádel",
  },
  "court-tenis-isometric": {
    id: "court-tenis-isometric",
    name: "Insignia Cancha de Tenis Isométrica",
    category: "sports",
    format: "raster-illustration",
    description: "Pista de tenis reglamentaria con red tensada en perspectiva isométrica.",
    recommendedSize: { min: 64, default: 120, max: 200 },
    paths: {
      webp: "/brand/illustrations/court-tenis-isometric.webp",
      masterPng: "/brand/illustrations/court-tenis-isometric.png",
    },
    altText: "Insignia isométrica de cancha de tenis",
  },
  "court-golf-isometric": {
    id: "court-golf-isometric",
    name: "Insignia Putting Green de Golf",
    category: "sports",
    format: "raster-illustration",
    description: "Green de golf sintético con bandera y contornos de aproximación.",
    recommendedSize: { min: 64, default: 120, max: 200 },
    paths: {
      webp: "/brand/illustrations/court-golf-isometric.webp",
      masterPng: "/brand/illustrations/court-golf-isometric.png",
    },
    altText: "Insignia isométrica de putting green de golf",
  },
  "court-multideporte-isometric": {
    id: "court-multideporte-isometric",
    name: "Insignia Pista Polideportiva",
    category: "sports",
    format: "raster-illustration",
    description: "Pista multideporte adaptada para baloncesto, voleibol y microfútbol.",
    recommendedSize: { min: 64, default: 120, max: 200 },
    paths: {
      webp: "/brand/illustrations/court-multideporte-isometric.webp",
      masterPng: "/brand/illustrations/court-multideporte-isometric.png",
    },
    altText: "Insignia isométrica de cancha polideportiva",
  },
  "court-volleyball-isometric": {
    id: "court-volleyball-isometric",
    name: "Insignia Cancha de Voleibol",
    category: "sports",
    format: "raster-illustration",
    description: "Pista de voleibol con red central en perspectiva isométrica.",
    recommendedSize: { min: 64, default: 120, max: 200 },
    paths: {
      webp: "/brand/illustrations/court-volleyball-isometric.webp",
      masterPng: "/brand/illustrations/court-volleyball-isometric.png",
    },
    altText: "Insignia isométrica de cancha de voleibol",
  },

  "montajes": {
    id: "montajes",
    name: "Montaje e Ingeniería Estructural",
    category: "technical",
    format: "raster-illustration",
    description: "Equipamiento y herramientas especializadas de montaje, tensado de césped y anclaje estructural.",
    recommendedSize: { min: 64, default: 120, max: 200 },
    paths: {
      webp: "/brand/illustrations/montajes.webp",
      masterPng: "/brand/illustrations/montajes.png",
    },
    altText: "Insignia de montajes e ingeniería estructural",
  },

  // ==========================================
  // 5. PURE SCALABLE VECTOR SVG ICONS (24-64px)
  // ==========================================
  // Note: 'padel-linear' is REJECTED per executive art direction and removed from public registry.
  "futbol-linear": {
    id: "futbol-linear",
    name: "Icono Lineal de Fútbol",
    category: "sports",
    format: "svg-vector",
    description: "Icono vectorial 64x64 con trazado de campo, porterías doradas y balón geométrico.",
    recommendedSize: { min: 24, default: 48, max: 64 },
    paths: { svg: "/brand/icons/svg/futbol-linear.svg" },
    altText: "Icono vectorial lineal de fútbol",
  },
  "tenis-linear": {
    id: "tenis-linear",
    name: "Icono Lineal de Tenis",
    category: "sports",
    format: "svg-vector",
    description: "Icono vectorial 64x64 con pista reglamentaria, red central y raqueta tensada.",
    recommendedSize: { min: 24, default: 48, max: 64 },
    paths: { svg: "/brand/icons/svg/tenis-linear.svg" },
    altText: "Icono vectorial lineal de tenis",
  },
  "golf-linear": {
    id: "golf-linear",
    name: "Icono Lineal de Golf",
    category: "sports",
    format: "svg-vector",
    description: "Icono vectorial 64x64 con topografía de green, hoyo, bandera dorada y pelota alveolada.",
    recommendedSize: { min: 24, default: 48, max: 64 },
    paths: { svg: "/brand/icons/svg/golf-linear.svg" },
    altText: "Icono vectorial lineal de golf",
  },
  "parques-linear": {
    id: "parques-linear",
    name: "Icono Lineal de Parques Infantiles",
    category: "recreational",
    format: "svg-vector",
    description: "Icono vectorial 64x64 con torre lúdica, tobogán de olas y piso amortiguante.",
    recommendedSize: { min: 24, default: 48, max: 64 },
    paths: { svg: "/brand/icons/svg/parques-linear.svg" },
    altText: "Icono vectorial lineal de parques infantiles",
  },
  "paisajismo-linear": {
    id: "paisajismo-linear",
    name: "Icono Lineal de Paisajismo y Terrazas",
    category: "landscaping",
    format: "svg-vector",
    description: "Icono vectorial 64x64 con pérgola arquitectónica, hojas botánicas y fibras de césped.",
    recommendedSize: { min: 24, default: 48, max: 64 },
    paths: { svg: "/brand/icons/svg/paisajismo-linear.svg" },
    altText: "Icono vectorial lineal de paisajismo y terrazas",
  },
  "cancha-isometric-linear": {
    id: "cancha-isometric-linear",
    name: "Ingeniería de Canchas Multicapa",
    category: "technical",
    format: "svg-vector",
    description: "Icono vectorial isométrico que ilustra las 4 capas de cimentación, shockpad y césped deportivo.",
    recommendedSize: { min: 24, default: 48, max: 96 },
    paths: { svg: "/brand/icons/svg/cancha-isometric-linear.svg" },
    altText: "Icono vectorial de ingeniería de canchas y sub-base",
  },
};

export type BrandAssetId = keyof typeof BRAND_ASSET_REGISTRY;
