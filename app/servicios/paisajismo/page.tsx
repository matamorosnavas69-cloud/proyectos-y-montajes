import Image from "next/image";
import QuoteSimulator from "@/app/components/QuoteSimulator";
import ServiceShowcaseGallery from "@/app/components/ServiceShowcaseGallery";
import ServiceHeroSlider, { HeroSlide } from "@/app/components/ServiceHeroSlider";
import BrandIcon from "@/app/components/icons/BrandIcon";
import PaisajismoLinearIcon from "@/app/components/icons/PaisajismoLinearIcon";
import {
  EcoWaterDropIcon,
  SunShieldIcon,
  PetFriendlyIcon,
  DrainageFlowIcon,
} from "@/app/components/icons/TechnicalIcons";
import { getPublishedHeroSlides } from "@/lib/hero-management";

export const metadata = {
  title: "Paisajismo y Terrazas con Grama Sintética | Proyectos y Montajes",
  description: "Transformamos espacios. Instalación de grama sintética decorativa para jardines, terrazas y zonas comunes. Máxima estética y cero mantenimiento.",
};

const PAISAJISMO_HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/drive organice/residencial/IMG_4638.JPG",
    alt: "Terraza residencial zen con grama sintética premium y jardín perimetral",
    title: "Terraza Zen y Jardín de Alto Confort",
    location: "Residencia Campestre",
    tag: "Paisajismo Residencial",
  },
  {
    src: "/images/drive organice/piscina/IMG_8074.JPG",
    alt: "Solárium de grama sintética atérmica y antideslizante en zona húmeda",
    title: "Solárium y Entorno de Piscina Atérmico",
    location: "Áreas Húmedas de Lujo",
    tag: "Piscina & Solárium",
  },
  {
    src: "/images/drive organice/residencial/IMG_5679.JPEG",
    alt: "Jardín perimetral con pérgola arquitectónica y acabado de césped",
    title: "Jardín Perimetral con Pérgola y Deck",
    location: "Condominio Campestre",
    tag: "Deck & Terraza",
  },
  {
    src: "/images/drive organice/piscina/IMG_3672.JPG",
    alt: "Entorno de piscina con drenaje técnico perimetral de secado rápido",
    title: "Acabado de Piscina con Drenaje Rápido",
    location: "Vivienda Unifamiliar",
    tag: "Drenaje Perimetral",
  },
];

const PAISAJISMO_STATS = [
  { value: "Cero Riego", label: "Eficiencia Hídrica" },
  { value: "Hasta 8 Años", label: "Garantía de Fábrica UV" },
  { value: "Pet-Safe", label: "Atérmico y No Tóxico" },
];

const SOLUCIONES_PAISAJISMO = [
  {
    id: "fibras",
    name: "Fibras y Materiales Sintéticos",
    icon: "landscaping-fibers" as const,
    subtitle: "Ingeniería de Polímeros",
    description: "Hebras monofilamento con nervio central de memoria elástica, doble backing de poliuretano y relleno de arena de sílice redondeada que previene el aplastamiento.",
  },
  {
    id: "muros-verdes",
    name: "Jardines Verticales",
    icon: "landscaping-vertical-garden" as const,
    subtitle: "Muros Verdes Arquitectónicos",
    description: "Paneles botánicos modulares de follaje sintético con protección UV continua. Máximo impacto estético en fachadas, lobbies y cerramientos sin consumo hídrico.",
  },
  {
    id: "drenajes",
    name: "Drenajes & Sub-Bases",
    icon: "landscaping-drainage" as const,
    subtitle: "Evacuación Pluvial Continua",
    description: "Sistemas de geomalla drenante, grava calibrada y tuberías ranuradas para eliminar charcos y humedad acumulada en jardines naturales o sobre losas.",
  },
  {
    id: "terrazas",
    name: "Terrazas & Áticos",
    icon: "landscaping-terrace-lawn" as const,
    subtitle: "Instalación en Losas y Decks",
    description: "Adecuación liviana sobre placas de concreto con pads de amortiguación acústica y canalización perimetral de escorrentía hacia sifones existentes.",
  },
];

export default async function PaisajismoPage() {
  const heroSlides = await getPublishedHeroSlides("paisajismo");

  return (
    <div className="flex flex-col w-full bg-brand-light">
      {/* High-End Unobstructed Rotating Hero */}
      <ServiceHeroSlider
        badge="Arquitectura Biofílica y Paisajismo"
        title="Diseño de Paisajismo y"
        titleAccent="Terrazas Residenciales"
        description="Transformamos áreas exteriores en oasis de confort permanente. Grama sintética decorativa premium, jardines verticales y sistemas de drenaje que eliminan el mantenimiento."
        stats={PAISAJISMO_STATS}
        slides={heroSlides}
      />

      {/* Four Landscaping Solutions Architectural Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-widest mb-3">
            Ingeniería de Superficies Verdes
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
            Cuatro Pilares de Arquitectura Paisajística
          </h2>
          <p className="text-gray-600 text-base md:text-lg mt-3">
            Más que instalar grama, resolvemos la hidrología, el confort térmico y la durabilidad estética de su entorno residencial o corporativo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {SOLUCIONES_PAISAJISMO.map((sol) => (
            <div
              key={sol.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-flat hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-brand-green/50"
            >
              <div className="w-full h-60 sm:h-72 flex items-center justify-center p-2 mb-5 group-hover:scale-105 transition-transform duration-300">
                <BrandIcon name={sol.icon} size={260} className="drop-shadow-xl select-none" />
              </div>
              <span className="text-xs font-bold text-brand-green uppercase tracking-wider block mb-1">
                {sol.subtitle}
              </span>
              <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-green transition-colors mb-2.5">
                {sol.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {sol.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Details Section: Permanent Aesthetics & Zero Watering */}
      <section className="py-16 md:py-20 bg-white border-y border-gray-200/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider mb-4">
                Eficiencia Hídrica &amp; Estética
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6 leading-tight">
                Estética Permanente, Cero Riego
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                Adecuamos terrazas de apartamentos, jardines de casas campestres y zonas comunes de conjuntos cerrados. Nuestra grama decorativa cuenta con protección UV avanzada, sistema de drenaje continuo de alta velocidad y apariencia “Real Feel” indistinguible del pasto natural.
              </p>

              <ul className="space-y-5 mb-8">
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center mr-5 shrink-0 border border-brand-green/25 shadow-sm">
                    <EcoWaterDropIcon size={36} className="text-brand-green" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Eliminación de riego continuo y fertilizantes, reduciendo sensiblemente los costos de mantenimiento mensual.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center mr-5 shrink-0 border border-brand-gold/30 shadow-sm">
                    <SunShieldIcon size={36} className="text-brand-gold" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Protección UV certificada contra decoloración (garantía de fábrica de hasta 8 años según especificación del producto).
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center mr-5 shrink-0 border border-brand-green/25 shadow-sm">
                    <PetFriendlyIcon size={36} className="text-brand-green" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Seguro para niños y 100% amigable con mascotas (Pet-Friendly, atérmico y fácil de sanitizar).
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center mr-5 shrink-0 border border-brand-gold/30 shadow-sm">
                    <DrainageFlowIcon size={36} className="text-brand-gold" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Base drenante que evacúa más de 60 litros por minuto por metro cuadrado, evitando encharcamientos.
                  </span>
                </li>
              </ul>

              {/* Architectural Landscaping Feature Callout */}
              <div className="p-6 bg-brand-dark rounded-2xl border border-brand-green/30 flex items-center gap-6 shadow-xl">
                <BrandIcon name="landscaping-fibers" size={160} priority className="shrink-0 hidden sm:flex drop-shadow-2xl" />
                <div>
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-wider block mb-1">
                    Fibras de Alta Densidad y Resiliencia
                  </span>
                  <p className="text-gray-200 text-sm leading-snug">
                    Monofilamentos atérmicos con memoria de forma y filtro UV grado C9 que mantienen la frescura y la verticalidad del césped todo el año.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/images/drive%20organice/residencial/IMG_1271.PNG"
                  alt="Terraza residencial con grama sintética"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg mt-8 border border-gray-100">
                <Image
                  src="/images/drive%20organice/piscina/IMG_8075.JPG"
                  alt="Zona de piscina y deck con césped decorativo"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-End Showcase Gallery Aligned with Service */}
      <ServiceShowcaseGallery
        service="paisajismo"
        customEyebrow="Archivo Técnico de Paisajismo"
        customTitle="Espacios exteriores que se disfrutan todos los días."
        customDescription="Explore más de 390 intervenciones reales en zonas comunes, terrazas en áticos, jardines campestres y entornos de piscina ejecutados con grama decorativa atérmica de alta durabilidad."
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
