import Image from "next/image";
import QuoteSimulator from "@/app/components/QuoteSimulator";
import ServiceShowcaseGallery from "@/app/components/ServiceShowcaseGallery";
import ServiceHeroSlider, { HeroSlide } from "@/app/components/ServiceHeroSlider";
import BrandIcon from "@/app/components/icons/BrandIcon";
import PadelLinearIcon from "@/app/components/icons/PadelLinearIcon";
import FutbolLinearIcon from "@/app/components/icons/FutbolLinearIcon";
import GolfLinearIcon from "@/app/components/icons/GolfLinearIcon";
import CanchaLinearIcon from "@/app/components/icons/CanchaLinearIcon";
import { getPublishedHeroSlides } from "@/lib/hero-management";

export const metadata = {
  title: "Construcción de Canchas Deportivas y Pistas de Pádel | Proyectos y Montajes",
  description: "Especialistas en diseño y construcción de pistas de Pádel, canchas de fútbol sintéticas y campos de golf con estándares profesionales y materiales europeos certificados.",
};

const CANCHAS_HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/padel/7ad44112-8715-477f-a253-8cd0c796ba8b.jpg",
    alt: "Pista de pádel panorámica profesional con cerramientos de cristal templado",
    title: "Pista de Pádel Panorámica de Competición",
    location: "Complejo Deportivo Club",
    tag: "Pádel Panorámico",
  },
  {
    src: "/images/futbol/IMG_7552.JPG",
    alt: "Cancha de fútbol sintética profesional de 11 jugadores",
    title: "Campo de Fútbol Sintético Profesional",
    location: "Santander, Colombia",
    tag: "Fútbol Césped Pro",
  },
  {
    src: "/images/futbol/806ebee3-c75b-4dcf-8e3b-eae1d864d211.jpg",
    alt: "Cancha de fútbol con sistema de iluminación deportiva LED",
    title: "Cancha Comunitaria con Iluminación LED",
    location: "Bucaramanga",
    tag: "Iluminación",
  },
  {
    src: "/images/padel/IMG_3346.PNG",
    alt: "Complejo de pádel cubierto Club Smash",
    title: "Club Pádel Smash de Competición",
    location: "Sede Deportiva Cubierta",
    tag: "Club Deportivo",
  },
];

const CANCHAS_STATS = [
  { value: "20+ Años", label: "Experiencia Constructiva" },
  { value: "FIP / WPT", label: "Medidas Reglamentarias" },
  { value: "Hasta 8 Años", label: "Garantía de Fábrica UV" },
];

const DISCIPLINAS = [
  {
    id: "padel",
    name: "Pistas de Pádel",
    icon: "court-padel-badge-isometric" as const,
    subtitle: "Medidas FIP & WPT",
    description: "Cristal templado de 12mm, estructura galvanizada y césped texturizado monofilamento de 12mm.",
  },
  {
    id: "futbol",
    name: "Canchas de Fútbol",
    icon: "court-futbol-isometric" as const,
    subtitle: "Fútbol 5, 7, 8 y 11",
    description: "Grama monofilamento certificada FIFA con absorción de impacto y drenaje técnico sub-base.",
  },
  {
    id: "tenis",
    name: "Pistas de Tenis",
    icon: "court-tenis-isometric" as const,
    subtitle: "Rápidas & Sintéticas",
    description: "Superficies sintéticas con bote controlado, cerramiento perimetral y postes de tensión micrométrica.",
  },
  {
    id: "golf",
    name: "Putting Greens",
    icon: "court-golf-isometric" as const,
    subtitle: "Golf Residencial & Club",
    description: "Césped ultradenso con nivelación milimétrica por láser y velocidad de rodadura profesional Stimp 10-12.",
  },
  {
    id: "multideporte",
    name: "Pistas Múltiples",
    icon: "court-multideporte-isometric" as const,
    subtitle: "Baloncesto & Microfútbol",
    description: "Polideportivos versátiles con demarcación reglamentaria de múltiples disciplinas y tableros antivandálicos.",
  },
  {
    id: "voleibol",
    name: "Voleibol & Arena",
    icon: "court-volleyball-isometric" as const,
    subtitle: "Vóley Playa & Sintético",
    description: "Canchas de arena de sílice lavada o piso sintético con redes de alta resistencia a la tracción.",
  },
];

export default async function CanchasDeportivasPage() {
  const heroSlides = await getPublishedHeroSlides("canchas");

  return (
    <div className="flex flex-col w-full bg-brand-light">
      {/* High-End Unobstructed Rotating Hero */}
      <ServiceHeroSlider
        badge="Ingeniería Deportiva de Competición"
        title="Canchas Deportivas y"
        titleAccent="Pistas de Pádel"
        description="Diseñamos y construimos infraestructura deportiva de alto rendimiento bajo estándares WPT y FIFA. Geometría exacta, drenaje profundo y máxima durabilidad."
        stats={CANCHAS_STATS}
        slides={heroSlides}
      />

      {/* Six Isometric Disciplines Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-widest mb-3">
            Especialidades de Construcción
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
            Seis Disciplinas, Una Sola Exigencia Técnica
          </h2>
          <p className="text-gray-600 text-base md:text-lg mt-3">
            Cada deporte exige una respuesta biomecánica, un drenaje y un coeficiente de fricción específico. Conozca nuestras soluciones especializadas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {DISCIPLINAS.map((disc) => (
            <div
              key={disc.id}
              className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-flat hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-brand-green/50"
            >
              <div className="w-full h-56 sm:h-64 flex items-center justify-center p-2 mb-4 group-hover:scale-105 transition-transform duration-300">
                <BrandIcon name={disc.icon} size={240} className="drop-shadow-xl select-none" />
              </div>
              <span className="text-xs font-bold text-brand-green uppercase tracking-wider block mb-1">
                {disc.subtitle}
              </span>
              <h3 className="text-2xl font-black text-brand-dark group-hover:text-brand-green transition-colors mb-2">
                {disc.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {disc.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Details Section: World Class Specs & Technical Showcase */}
      <section className="py-16 md:py-20 bg-white border-y border-gray-200/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-dark text-xs font-bold uppercase tracking-wider mb-4">
                Criterios Constructivos
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6 leading-tight">
                Especificaciones de Clase Mundial
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                Construimos canchas y pistas deportivas siguiendo especificaciones técnicas de federaciones internacionales (FIP para Pádel, especificaciones de césped sintético FIFA Quality). Utilizamos grama de última generación con monofilamentos texturizados que garantizan un rebote homogéneo y cuidan las articulaciones de los deportistas.
              </p>

              <ul className="space-y-5 mb-8">
                <li className="flex items-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mr-5 shrink-0 border border-brand-green/25 shadow-sm">
                    <PadelLinearIcon size={48} className="text-brand-green" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Pistas de Pádel con cristal templado de 12mm y estructura autoportante galvanizada.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mr-5 shrink-0 border border-brand-green/25 shadow-sm">
                    <FutbolLinearIcon size={48} className="text-brand-green" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Canchas de Fútbol 5, 7 y 11 con sistema de drenaje continuo de alta capacidad.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold/15 flex items-center justify-center mr-5 shrink-0 border border-brand-gold/30 shadow-sm">
                    <GolfLinearIcon size={48} className="text-brand-gold" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Putting greens de golf residenciales y comerciales con velocidad controlada.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center mr-5 shrink-0 border border-brand-green/25 shadow-sm">
                    <CanchaLinearIcon size={48} className="text-brand-green" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Ingeniería de sub-base, shockpad elástico e iluminación LED deportiva anti-deslumbrante.
                  </span>
                </li>
              </ul>

              {/* Architectural Engineering Feature Callout */}
              <div className="p-6 bg-brand-dark rounded-2xl border border-brand-green/30 flex items-center gap-6 shadow-xl">
                <BrandIcon name="padel-court-isometric" size={200} priority className="shrink-0 hidden sm:flex" />
                <div>
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-wider block mb-1">
                    Ingeniería Certificada
                  </span>
                  <p className="text-gray-200 text-sm leading-snug">
                    Cálculo estructural de muros de vidrio, absorción biomecánica y canalización hídrica para operación ininterrumpida los 365 días del año.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/images/futbol/806ebee3-c75b-4dcf-8e3b-eae1d864d211.jpg"
                  alt="Cancha de fútbol con iluminación"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg mt-8 border border-gray-100">
                <Image
                  src="/images/futbol/5083d30f-983b-4c09-8fb5-f973e703ac1d.jpg"
                  alt="Cancha de fútbol comunitaria"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Material Authority */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <Image
              src="/images/futbol/3ACAD10F-DF5C-4A03-988E-72406A244748.JPG"
              alt="CCGrass FIFA Quality Preferred Producer"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs font-bold tracking-widest uppercase mb-4">
              Proveedor Certificado FIFA
            </div>
            <h2 className="text-3xl font-black text-brand-dark mb-4">Grama CCGrass — FIFA Quality</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Trabajamos exclusivamente con <strong>CCGrass</strong>, el productor preferido de FIFA para grama sintética de alto rendimiento. Cada rollo que instalamos cuenta con certificación de laboratorio y trazabilidad completa de lote.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-l-4 border-brand-green pl-4">
                <div className="text-2xl font-black text-brand-dark">60mm</div>
                <div className="text-xs font-bold text-gray-500 uppercase">Altura de Fibra</div>
              </div>
              <div className="border-l-4 border-brand-gold pl-4">
                <div className="text-2xl font-black text-brand-dark">8+ años</div>
                <div className="text-xs font-bold text-gray-500 uppercase">Vida Útil UV</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-End Showcase Gallery Aligned with Service */}
      <ServiceShowcaseGallery
        service="canchas"
        customEyebrow="Archivo Técnico de Canchas"
        customTitle="Obras que elevan la experiencia de competir."
        customDescription="Explore más de 180 canchas sintéticas, pistas de pádel panorámicas, greens de golf y cerramientos perimetrales ejecutados por nuestro equipo técnico en toda Colombia."
      />

      {/* Embedded Lead Capture */}
      <section id="simulador" aria-labelledby="diagnostic-heading" className="relative overflow-hidden border-t border-gray-200 bg-[#f3f6f2] px-6 py-[72px] md:py-[112px]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-[40px] grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-green">Planificación guiada</p>
              <h2 id="diagnostic-heading" className="mt-3 text-3xl font-black leading-tight text-brand-dark md:text-4xl">Una propuesta precisa empieza con un buen diagnóstico.</h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600 md:pb-1">Comparta los datos esenciales de su proyecto. Nuestro equipo los convierte en una revisión técnica, una visita bien preparada y una propuesta con alcance claro.</p>
          </div>
          <QuoteSimulator />
        </div>
      </section>
    </div>
  );
}
