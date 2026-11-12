import LandingHeroCarousel from "@/app/components/LandingHeroCarousel";
import { getPublishedHeroSlides } from "@/lib/hero-management";
import { SERVICE_PATH_MAP, SERVICE_LABELS, type ServiceKey } from "@/lib/hero-constants";

const BANNERS = [
  { id: "canchas", key: "canchas", eyebrow: "01 — Ingeniería deportiva", title: "Canchas diseñadas", highlight: "para competir", description: "Escenarios deportivos resistentes, funcionales y listos para el ritmo real de uso.", cta: "Ver canchas deportivas", stats: [["500+", "proyectos entregados"], ["20+", "años de experiencia"], ["FIFA", "materiales certificados"], ["45 días", "instalación promedio"]] },
  { id: "padel", key: "padel", eyebrow: "02 — Pádel profesional", title: "Pistas que elevan", highlight: "cada partido", description: "Diseño, estructura e iluminación para pistas de pádel con experiencia de alto rendimiento.", cta: "Explorar pistas de pádel", stats: [["WPT", "estándar de diseño"], ["360°", "visión panorámica"], ["LED", "iluminación deportiva"], ["8+", "años de vida útil"]] },
  { id: "parques", key: "parques", eyebrow: "03 — Recreación segura", title: "Parques que inspiran", highlight: "a jugar", description: "Zonas infantiles seguras y durables para colegios, conjuntos, hoteles y espacios públicos.", cta: "Ver parques infantiles", stats: [["EPDM", "pisos amortiguantes"], ["100%", "diseño seguro"], ["4", "líneas de juego"], ["20+", "años de experiencia"]] },
  { id: "terrazas", key: "terrazas", eyebrow: "04 — Paisajismo arquitectónico", title: "Terrazas pensadas", highlight: "para disfrutar", description: "Superficies verdes de bajo mantenimiento que convierten cada terraza en un lugar habitable.", cta: "Diseñar mi terraza", stats: [["0%", "riego permanente"], ["365", "días de uso"], ["20–50 mm", "alturas disponibles"], ["100%", "acompañamiento"]] },
  { id: "balcones", key: "balcones", eyebrow: "05 — Exterior residencial", title: "Balcones con vida", highlight: "y confort", description: "Soluciones verdes para ampliar visualmente tu hogar y disfrutarlo sin complicaciones.", cta: "Explorar balcones", stats: [["Mínimo", "mantenimiento"], ["Rápida", "instalación"], ["A medida", "cada superficie"], ["Colombia", "cobertura nacional"]] },
] as const;

export default async function Hero() {
  const slidesByService = await Promise.all(BANNERS.map((banner) => getPublishedHeroSlides(banner.key as ServiceKey)));

  return (
    <section className="bg-brand-dark text-white">
      {BANNERS.map((banner, index) => <LandingHeroCarousel key={banner.id} id={banner.id} category={SERVICE_LABELS[banner.key as ServiceKey]} eyebrow={banner.eyebrow} title={banner.title} highlight={banner.highlight} description={banner.description} href={SERVICE_PATH_MAP[banner.key as ServiceKey]} cta={banner.cta} stats={banner.stats} slides={slidesByService[index]} />)}
    </section>
  );
}
