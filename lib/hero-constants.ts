import { HeroSlide } from '@/app/components/ServiceHeroSlider';

// Páginas de servicios: canchas, parques, paisajismo. Landing principal: landing-*.
export type ServiceKey = 'canchas' | 'parques' | 'paisajismo' | 'landing-canchas' | 'landing-padel' | 'landing-parques' | 'landing-terrazas' | 'landing-balcones';

export const SERVICE_PATH_MAP: Record<ServiceKey, string> = {
  canchas: '/servicios/canchas-deportivas',
  parques: '/servicios/parques-infantiles',
  paisajismo: '/servicios/paisajismo',
  'landing-canchas': '/servicios/canchas-deportivas',
  'landing-padel': '/servicios/canchas-deportivas',
  'landing-parques': '/servicios/parques-infantiles',
  'landing-terrazas': '/servicios/paisajismo',
  'landing-balcones': '/servicios/paisajismo',
};

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  canchas: 'Canchas Deportivas',
  parques: 'Parques Infantiles',
  paisajismo: 'Paisajismo y Terrazas',
  'landing-canchas': 'Canchas deportivas',
  'landing-padel': 'Pádel',
  'landing-parques': 'Parques infantiles',
  'landing-terrazas': 'Terrazas',
  'landing-balcones': 'Balcones',
};

const BASE_HERO_SLIDES: Record<Exclude<ServiceKey, 'landing-canchas' | 'landing-parques'>, HeroSlide[]> = {
  canchas: [
    {
      src: '/hero/cancha.png',
      alt: 'Cancha deportiva sintética profesional',
      title: 'Cancha deportiva de alto rendimiento',
      location: 'Proyectos deportivos',
      tag: 'Cancha profesional',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/hero/cancha2.png',
      alt: 'Cancha sintética para entrenamiento y competencia',
      title: 'Campo sintético para competencia',
      location: 'Santander, Colombia',
      tag: 'Fútbol sintético',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/hero/cancha3.png',
      alt: 'Cancha deportiva con iluminación profesional',
      title: 'Cancha con iluminación deportiva',
      location: 'Bucaramanga',
      tag: 'Iluminación',
      focalX: 50,
      focalY: 50,
    },
    {
      src: '/hero/cancha4.png',
      alt: 'Complejo deportivo de fútbol sintético',
      title: 'Complejo deportivo integral',
      location: 'Sede deportiva',
      tag: 'Infraestructura',
      focalX: 50,
      focalY: 50,
    },
  ],
  'landing-padel': [
    { src: '/images/padel/IMG_3346.PNG', alt: 'Pistas de pádel panorámico profesionales', title: 'Pistas de pádel profesionales', location: 'Complejos deportivos', tag: 'Pádel', focalX: 50, focalY: 50 },
    { src: '/images/padel/IMG_3348.PNG', alt: 'Pista de pádel con cerramiento panorámico', title: 'Cerramiento panorámico', location: 'Sedes deportivas', tag: 'Pádel panorámico', focalX: 50, focalY: 50 },
    { src: '/images/padel/IMG_3349.PNG', alt: 'Pista de pádel con grama sintética', title: 'Superficie de alto rendimiento', location: 'Colombia', tag: 'Rendimiento', focalX: 50, focalY: 50 },
    { src: '/images/padel/7ad44112-8715-477f-a253-8cd0c796ba8b.jpg', alt: 'Pista de pádel profesional', title: 'Pistas listas para competir', location: 'Colombia', tag: 'Competición', focalX: 50, focalY: 50 },
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
  'landing-terrazas': [
    { src: '/hero/balcones y terrazasa 1.png', alt: 'Terraza con grama sintética al atardecer', title: 'Terrazas verdes de bajo mantenimiento', location: 'Residencial y comercial', tag: 'Terrazas', focalX: 50, focalY: 50 },
    { src: '/hero/balcones y terrazasa2.png', alt: 'Balcón con vista a la ciudad y grama sintética', title: 'Más verde en menos espacio', location: 'Apartamentos y oficinas', tag: 'Exterior', focalX: 50, focalY: 50 },
  ],
  'landing-balcones': [
    { src: '/hero/balcones y terrazasa2.png', alt: 'Balcón con vista a la ciudad y grama sintética', title: 'Balcones con vida y confort', location: 'Vivienda urbana', tag: 'Balcones', focalX: 50, focalY: 50 },
    { src: '/hero/balcones y terrazasa 1.png', alt: 'Terraza con grama sintética al atardecer', title: 'Terrazas y balcones a tu medida', location: 'Residencial', tag: 'Exterior', focalX: 50, focalY: 50 },
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

export const DEFAULT_HERO_SLIDES: Record<ServiceKey, HeroSlide[]> = {
  ...BASE_HERO_SLIDES,
  'landing-canchas': [
    { src: '/hero/cancha.png', alt: 'Cancha deportiva sintética profesional', title: 'Cancha deportiva de alto rendimiento', location: 'Proyectos deportivos', tag: 'Cancha profesional', focalX: 50, focalY: 50 },
    { src: '/hero/cancha2.png', alt: 'Cancha deportiva sintética profesional', title: 'Estadio de fútbol con grama sintética', location: 'Colombia', tag: 'Fútbol sintético', focalX: 50, focalY: 50 },
    { src: '/hero/cancha3.png', alt: 'Cancha deportiva sintética profesional', title: 'Cancha con iluminación profesional', location: 'Bucaramanga', tag: 'Iluminación', focalX: 50, focalY: 50 },
    { src: '/hero/cancha4.png', alt: 'Cancha deportiva sintética profesional', title: 'Campo sintético para competencia', location: 'Santander, Colombia', tag: 'Competencia', focalX: 50, focalY: 50 },
    { src: '/hero/cancha5.png', alt: 'Cancha deportiva sintética profesional', title: 'Cancha deportiva con tribunas', location: 'Sede deportiva', tag: 'Infraestructura', focalX: 50, focalY: 50 },
  ],
  'landing-parques': [
    { src: '/hero/parque.png', alt: 'Parque infantil en terraza con grama sintética', title: 'Parques seguros para jugar', location: 'Conjuntos y colegios', tag: 'Parque infantil', focalX: 50, focalY: 50 },
    { src: '/hero/parque2.png', alt: 'Parque infantil con juegos modulares', title: 'Zonas infantiles durables', location: 'Espacios públicos', tag: 'Juegos modulares', focalX: 50, focalY: 50 },
    { src: '/hero/53fab49b-9e5c-41ad-914a-a69248cae6b4.jpg', alt: 'Parque infantil con grama sintética', title: 'Superficie suave y segura', location: 'Proyectos residenciales', tag: 'Seguridad', focalX: 50, focalY: 50 },
  ],
};
