import LandingHeroCarousel from "@/app/components/LandingHeroCarousel";
import { getPublishedHeroSlides } from "@/lib/hero-management";
import { SERVICE_PATH_MAP, SERVICE_LABELS, type ServiceKey } from "@/lib/hero-constants";

const BANNERS = [
  { id: "canchas", key: "canchas", eyebrow: "01 — Ingeniería deportiva", title: "Canchas diseñadas", highlight: "para competir", description: "Por qué grama sintética: juego parejo todo el año, sin barro ni riego y con amortiguación que protege a los deportistas. Para canchas de alto uso.", guarantee: "Garantía por escrito en material e instalación", cta: "Ver canchas deportivas", stats: [["500+", "proyectos entregados"], ["20+", "años de experiencia"], ["FIFA", "materiales certificados"], ["Garantía", "material e instalación"]] },
  { id: "padel", key: "padel", eyebrow: "02 — Pádel profesional", title: "Pistas que elevan", highlight: "cada partido", description: "Por qué grama sintética: bote predecible, buen agarre y superficie estable en cualquier clima. Para pistas con juego intensivo y competencia.", guarantee: "Garantía por escrito sobre superficie y estructura", cta: "Explorar pistas de pádel", stats: [["WPT", "estándar de diseño"], ["360°", "visión panorámica"], ["LED", "iluminación deportiva"], ["Garantía", "superficie y estructura"]] },
  { id: "parques", key: "parques", eyebrow: "03 — Recreación segura", title: "Parques que inspiran", highlight: "a jugar", description: "Por qué grama sintética: superficie suave que amortigua caídas, limpia y sin lodo. Para colegios, conjuntos, hoteles y espacios públicos.", guarantee: "Garantía por escrito en seguridad y durabilidad", cta: "Ver parques infantiles", stats: [["EPDM", "pisos amortiguantes"], ["100%", "diseño seguro"], ["4", "líneas de juego"], ["Garantía", "seguridad y durabilidad"]] },
  { id: "terrazas", key: "terrazas", eyebrow: "04 — Paisajismo arquitectónico", title: "Terrazas pensadas", highlight: "para disfrutar", description: "Por qué grama sintética: verde permanente sin riego ni podas, resistente al sol y a la lluvia. Para terrazas que se usan todo el año.", guarantee: "Garantía por escrito contra decoloración y desgaste", cta: "Diseñar mi terraza", stats: [["0%", "riego permanente"], ["365", "días de uso"], ["20–50 mm", "alturas disponibles"], ["Garantía", "color y desgaste"]] },
  { id: "balcones", key: "balcones", eyebrow: "05 — Exterior residencial", title: "Balcones con vida", highlight: "y confort", description: "Por qué grama sintética: un rincón verde liviano, sin humedad ni mantenimiento. Para balcones y espacios pequeños que quieres disfrutar ya.", guarantee: "Garantía por escrito en instalación y acabado", cta: "Explorar balcones", stats: [["Mínimo", "mantenimiento"], ["Rápida", "instalación"], ["A medida", "cada superficie"], ["Garantía", "instalación y acabado"]] },
] as const;

export default async function Hero() {
  const slidesByService = await Promise.all(BANNERS.map((banner) => getPublishedHeroSlides(banner.key as ServiceKey)));

  return (
    <section className="bg-brand-dark text-white">
      {BANNERS.map((banner, index) => <LandingHeroCarousel key={banner.id} id={banner.id} category={SERVICE_LABELS[banner.key as ServiceKey]} eyebrow={banner.eyebrow} title={banner.title} highlight={banner.highlight} description={banner.description} guarantee={banner.guarantee} href={SERVICE_PATH_MAP[banner.key as ServiceKey]} cta={banner.cta} stats={banner.stats} slides={slidesByService[index]} />)}
    </section>
  );
}
