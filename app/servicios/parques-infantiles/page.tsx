import Image from "next/image";
import QuoteSimulator from "@/app/components/QuoteSimulator";
import ServiceShowcaseGallery from "@/app/components/ServiceShowcaseGallery";
import ServiceHeroSlider, { HeroSlide } from "@/app/components/ServiceHeroSlider";
import BrandIcon from "@/app/components/icons/BrandIcon";
import ParquesLinearIcon from "@/app/components/icons/ParquesLinearIcon";
import {
  ShieldSafetyIcon,
  FloorShockpadIcon,
  ModularCastleIcon,
} from "@/app/components/icons/TechnicalIcons";
import { getPublishedHeroSlides } from "@/lib/hero-management";

export const metadata = {
  title: "Parques Infantiles de Alta Seguridad y Pisos EPDM | Proyectos y Montajes",
  description: "Diseño e instalación de parques infantiles para conjuntos residenciales, colegios y parques públicos. Seguridad europea EN-1177 y durabilidad garantizada.",
};

const PARQUES_HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/drive organice/parques/15d81928-0e73-46bd-b651-897cd955e52b.jpg",
    alt: "Parque infantil modular multitorre instalado en conjunto residencial",
    title: "Parque Infantil Modular Multitorre",
    location: "Conjunto Residencial Campestre",
    tag: "Módulos Lúdicos",
  },
  {
    src: "/images/drive organice/parques/1f33c515-446d-4452-81d3-ed1df4d15211.JPG",
    alt: "Piso amortiguante de caucho EPDM vaciado continuo de alta seguridad",
    title: "Piso Amortiguante EPDM Continuo",
    location: "Área Recreativa Infantil",
    tag: "Seguridad EN-1177",
  },
  {
    src: "/images/drive organice/parques/207e5725-8eb2-4049-8a03-5ab905d1b1ee.jpg",
    alt: "Circuito recreativo infantil con madera inmunizada y tobogán",
    title: "Estructura Recreativa en Madera Inmunizada",
    location: "Urbanización Cerrada",
    tag: "Módulos de Madera",
  },
  {
    src: "/images/drive organice/parques/IMG_4629.JPG",
    alt: "Zona de juegos infantiles con estimulación motriz y destreza",
    title: "Zona de Estimulación Motriz y Juegos",
    location: "Club Social e Institucional",
    tag: "Equipamiento Lúdico",
  },
];

const PARQUES_STATS = [
  { value: "20+ Años", label: "Experiencia en Obras" },
  { value: "EN-1177", label: "Criterio HIC de Caída" },
  { value: "EPDM", label: "Caucho Vaciado Continuo" },
];

const SOLUCIONES_RECREATIVAS = [
  {
    id: "modulares",
    name: "Parques Modulares",
    icon: "playground-modular-castle" as const,
    subtitle: "Desarrollo Motor & Juego",
    description: "Torres multinivel, toboganes de espiral, pasarelas colgantes y rampas fabricadas en acero galvanizado y polietileno HDPE de alta densidad.",
  },
  {
    id: "epdm",
    name: "Pisos Amortiguantes EPDM",
    icon: "playground-safety-floor" as const,
    subtitle: "Seguridad Continua Anti-Impacto",
    description: "Superficie continua vaciada in-situ con base amortiguante SBR y capa de desgaste EPDM en color. Elimina juntas peligrosas y absorbe caídas críticas.",
  },
  {
    id: "biosaludables",
    name: "Gimnasios Biosaludables",
    icon: "outdoor-fitness-gym" as const,
    subtitle: "Acondicionamiento al Aire Libre",
    description: "Equipamiento cardiovascular y de movilidad articular para adultos y jóvenes, con pintura electrostática resistente a la intemperie.",
  },
  {
    id: "calistenia",
    name: "Estaciones de Calistenia",
    icon: "calisthenics-frame" as const,
    subtitle: "Fitness Urbano de Alto Desempeño",
    description: "Estructuras de barras paralelas, dominadas y anillas con soldadura reforzada para entrenamiento funcional en parques urbanos y clubes.",
  },
];

export default async function ParquesInfantilesPage() {
  const heroSlides = await getPublishedHeroSlides("parques");

  return (
    <div className="flex flex-col w-full bg-brand-light">
      {/* High-End Unobstructed Rotating Hero */}
      <ServiceHeroSlider
        badge="Ingeniería Recreativa y Seguridad Infantil"
        title="Parques Infantiles y"
        titleAccent="Pisos de Seguridad"
        description="Creamos entornos recreativos que estimulan la imaginación y protegen a los más pequeños. Módulos lúdicos certificados, pisos amortiguantes EPDM y circuitos saludables."
        stats={PARQUES_STATS}
        slides={heroSlides}
      />

      {/* Four Solutions Architectural Grid */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-dark text-xs font-bold uppercase tracking-widest mb-3">
            Infraestructura Recreativa Integral
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
            Cuatro Soluciones para Espacios Públicos y Residenciales
          </h2>
          <p className="text-gray-600 text-base md:text-lg mt-3">
            Más que suministrar juegos, diseñamos e instalamos sistemas completos de bienestar que valorizan las áreas comunes de su copropiedad o institución.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {SOLUCIONES_RECREATIVAS.map((sol) => (
            <div
              key={sol.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-flat hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-brand-gold/50"
            >
              <div className="w-full h-60 sm:h-72 flex items-center justify-center p-2 mb-5 group-hover:scale-105 transition-transform duration-300">
                <BrandIcon name={sol.icon} size={260} className="drop-shadow-xl select-none" />
              </div>
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block mb-1">
                {sol.subtitle}
              </span>
              <h3 className="text-xl font-black text-brand-dark group-hover:text-brand-gold transition-colors mb-2.5">
                {sol.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {sol.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Details Section: Child Safety & Technical Criteria */}
      <section className="py-16 md:py-20 bg-white border-y border-gray-200/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
              <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
                <Image
                  src="/images/drive organice/parques/1f33c515-446d-4452-81d3-ed1df4d15211.JPG"
                  alt="Parque infantil modular con piso de caucho"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg mt-8 border border-gray-100">
                <Image
                  src="/images/drive organice/parques/207e5725-8eb2-4049-8a03-5ab905d1b1ee.jpg"
                  alt="Estructura de juego para conjunto residencial"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider mb-4">
                Seguridad &amp; Tranquilidad
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6 leading-tight">
                Protección para Niños y Respaldo para Copropiedades
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                Nos especializamos en proyectos recreativos de alta durabilidad para constructoras y conjuntos residenciales. Cada instalación se dimensiona considerando las alturas críticas de caída (criterio HIC), garantizando amortiguación real y máxima higiene.
              </p>

              <ul className="space-y-5 mb-8">
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center mr-5 shrink-0 border border-brand-green/25 shadow-sm">
                    <ShieldSafetyIcon size={36} className="text-brand-green" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Estructuras en acero galvanizado termoesmaltado y plásticos rotomoldeados HDPE con filtro UV.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center mr-5 shrink-0 border border-brand-gold/30 shadow-sm">
                    <FloorShockpadIcon size={36} className="text-brand-gold" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Pisos de caucho EPDM vaciado in-situ sin uniones ni filos cortantes para absorción de impacto.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center mr-5 shrink-0 border border-brand-green/25 shadow-sm">
                    <ParquesLinearIcon size={36} className="text-brand-green" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Módulos inclusivos y accesibles diseñados para diferentes grupos de edad y motricidad.
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold/15 flex items-center justify-center mr-5 shrink-0 border border-brand-gold/30 shadow-sm">
                    <ModularCastleIcon size={36} className="text-brand-gold" />
                  </div>
                  <span className="text-brand-dark font-medium text-sm md:text-base">
                    Configuraciones modulares personalizables al metraje y presupuesto de cada proyecto.
                  </span>
                </li>
              </ul>

              {/* Architectural Safety Feature Callout */}
              <div className="p-6 bg-brand-dark rounded-2xl border border-brand-gold/30 flex items-center gap-6 shadow-xl">
                <BrandIcon name="playground-safety-floor" size={160} priority className="shrink-0 hidden sm:flex drop-shadow-2xl" />
                <div>
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-wider block mb-1">
                    Seguridad Certificada EN-1177
                  </span>
                  <p className="text-gray-200 text-sm leading-snug">
                    Pisos amortiguantes de caucho EPDM continuo vaciados in-situ y estructuras ensayadas para alturas críticas de impacto (HIC).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-End Showcase Gallery Aligned with Service */}
      <ServiceShowcaseGallery
        service="parques"
        customEyebrow="Archivo Técnico de Parques"
        customTitle="Cada zona de juego, resuelta hasta el último detalle."
        customDescription="Recorra más de 200 instalaciones de módulos recreativos, vaciado de pisos continuos de caucho EPDM amortiguante y zonas de juego inclusivas en proyectos residenciales e institucionales."
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
