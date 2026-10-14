import { HeroSlide } from '@/app/components/ServiceHeroSlider';

export type ServiceKey = 'canchas' | 'parques' | 'paisajismo';

export const SERVICE_PATH_MAP: Record<ServiceKey, string> = {
  canchas: '/servicios/canchas-deportivas',
  parques: '/servicios/parques-infantiles',
  paisajismo: '/servicios/paisajismo',
};

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  canchas: 'Canchas Deportivas',
  parques: 'Parques Infantiles',
  paisajismo: 'Paisajismo y Terrazas',
};

export const DEFAULT_HERO_SLIDES: Record<ServiceKey, HeroSlide[]> = {
  canchas: [
    {
      src: '/images/padel/7ad44112-8715-477f-a253-8cd0c796ba8b.jpg',
      alt: 'Pista de pádel panorámica profesional con cerramientos de cristal templado',
      title: 'Pista de Pádel Panorámica de Competición',
      location: 'Complejo Deportivo Club',
      tag: 'Pádel Panorámico',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/futbol/IMG_7552.JPG',
      alt: 'Cancha de fútbol sintética profesional de 11 jugadores',
      title: 'Campo de Fútbol Sintético Profesional',
      location: 'Santander, Colombia',
      tag: 'Fútbol Césped Pro',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/futbol/806ebee3-c75b-4dcf-8e3b-eae1d864d211.jpg',
      alt: 'Cancha de fútbol con sistema de iluminación deportiva LED',
      title: 'Cancha Comunitaria con Iluminación LED',
      location: 'Bucaramanga',
      tag: 'Iluminación',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/padel/IMG_3346.PNG',
      alt: 'Complejo de pádel cubierto Club Smash',
      title: 'Club Pádel Smash de Competición',
      location: 'Sede Deportiva Cubierta',
      tag: 'Club Deportivo',
      focalX: 50,
      focalY: 50,
    },
  ],
  parques: [
    {
      src: '/images/drive organice/parques/15d81928-0e73-46bd-b651-897cd955e52b.jpg',
      alt: 'Parque infantil modular multitorre instalado en conjunto residencial',
      title: 'Parque Infantil Modular Multitorre',
      location: 'Conjunto Residencial Campestre',
      tag: 'Módulos Lúdicos',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/drive organice/parques/1f33c515-446d-4452-81d3-ed1df4d15211.JPG',
      alt: 'Piso amortiguante de caucho EPDM vaciado continuo de alta seguridad',
      title: 'Piso Amortiguante EPDM Continuo',
      location: 'Área Recreativa Infantil',
      tag: 'Seguridad EN-1177',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/drive organice/parques/207e5725-8eb2-4049-8a03-5ab905d1b1ee.jpg',
      alt: 'Circuito recreativo infantil con madera inmunizada y tobogán',
      title: 'Estructura Recreativa en Madera Inmunizada',
      location: 'Urbanización Cerrada',
      tag: 'Módulos de Madera',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/drive organice/parques/IMG_4629.JPG',
      alt: 'Zona de juegos infantiles con estimulación motriz y destreza',
      title: 'Zona de Estimulación Motriz y Juegos',
      location: 'Club Social e Institucional',
      tag: 'Equipamiento Lúdico',
      focalX: 50,
      focalY: 50,
    },
  ],
  paisajismo: [
    {
      src: '/images/drive organice/residencial/IMG_4638.JPG',
      alt: 'Terraza residencial zen con grama sintética premium y jardín perimetral',
      title: 'Terraza Zen y Jardín de Alto Confort',
      location: 'Residencia Campestre',
      tag: 'Paisajismo Residencial',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/drive organice/piscina/IMG_8074.JPG',
      alt: 'Solárium de grama sintética atérmica y antideslizante en zona húmeda',
      title: 'Solárium y Entorno de Piscina Atérmico',
      location: 'Áreas Húmedas de Lujo',
      tag: 'Piscina & Solárium',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/drive organice/residencial/IMG_5679.JPEG',
      alt: 'Jardín perimetral con pérgola arquitectónica y acabado de césped',
      title: 'Jardín Perimetral con Pérgola y Deck',
      location: 'Condominio Campestre',
      tag: 'Deck & Terraza',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/images/drive organice/piscina/IMG_3672.JPG',
      alt: 'Entorno de piscina con drenaje técnico perimetral de secado rápido',
      title: 'Acabado de Piscina con Drenaje Rápido',
      location: 'Vivienda Unifamiliar',
      tag: 'Drenaje Perimetral',
      focalX: 50,
      focalY: 50,
    },
  ],
};
