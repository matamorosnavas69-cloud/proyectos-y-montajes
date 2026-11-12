import LandingHeroCarousel from "@/app/components/LandingHeroCarousel";
import { getPublishedHeroSlides } from "@/lib/hero-management";
import { SERVICE_PATH_MAP, type ServiceKey } from "@/lib/hero-constants";
import { Award, BadgeCheck, MapPin } from "lucide-react";

// items: [icono, título, subtítulo]; la garantía se agrega siempre como tercer ítem.
const BANNERS = [
  { id: "canchas", key: "canchas", eyebrow: "Ingeniería deportiva", title: "Canchas diseñadas", highlight: "para competir", benefit: "Juega todo el año, sin barro ni riego y con menos costos de mantenimiento.", items: [["goal", "Juego parejo", "todo el año"], ["drop", "Sin riego", "ni mantenimiento alto"]], warranty: "en material e instalación", cta: "Ver canchas deportivas", stats: [["500+", "Proyectos"], ["20+", "Años"], ["FIFA", "Certificado"], ["Garantía", "Por escrito"]] },
  { id: "padel", key: "padel", eyebrow: "Pádel profesional", title: "Pistas que elevan", highlight: "cada partido", benefit: "Bote predecible y superficie estable con sol, lluvia o uso intensivo.", items: [["target", "Bote predecible", "mejor nivel de juego"], ["weather", "Estable", "en cualquier clima"]], warranty: "en superficie y estructura", cta: "Explorar pistas de pádel", stats: [["WPT", "Estándar"], ["LED", "Iluminación"], ["360°", "Panorámica"], ["Garantía", "Por escrito"]] },
  { id: "parques", key: "parques", eyebrow: "Recreación segura", title: "Parques que inspiran", highlight: "a jugar", benefit: "Superficie suave que amortigua caídas, limpia y sin lodo para uso diario.", items: [["baby", "Caídas más seguras", "superficie amortiguante"], ["sparkles", "Siempre limpio", "sin lodo ni polvo"]], warranty: "en seguridad y durabilidad", cta: "Ver parques infantiles", stats: [["EPDM", "Amortiguante"], ["100%", "Diseño seguro"], ["4", "Líneas de juego"], ["Garantía", "Por escrito"]] },
  { id: "terrazas", key: "terrazas", eyebrow: "Paisajismo arquitectónico", title: "Terrazas pensadas", highlight: "para disfrutar", benefit: "Verde permanente sin riego ni podas, resistente al sol y a la lluvia.", items: [["sprout", "Verde permanente", "color estable al sol"], ["layers", "Valoriza tu espacio", "acabado profesional"]], warranty: "contra decoloración", cta: "Diseñar mi terraza", stats: [["0%", "Riego"], ["365", "Días de uso"], ["20–50 mm", "Alturas"], ["Garantía", "Por escrito"]] },
  { id: "balcones", key: "balcones", eyebrow: "Exterior residencial", title: "Balcones con vida", highlight: "y confort", benefit: "Un rincón verde liviano, sin humedad y con mínimo mantenimiento.", items: [["feather", "Liviana", "sin humedad"], ["clock", "Instalación rápida", "sin obra pesada"]], warranty: "en instalación y acabado", cta: "Explorar balcones", stats: [["Mínimo", "Mantenimiento"], ["Rápida", "Instalación"], ["A medida", "Cada superficie"], ["Garantía", "Por escrito"]] },
] as const;

export default async function Hero() {
  const slidesByService = await Promise.all(BANNERS.map((banner) => getPublishedHeroSlides(banner.key as ServiceKey)));

  return (
    <section className="bg-brand-dark text-white">
      {BANNERS.map((banner, index) => <LandingHeroCarousel key={banner.id} id={banner.id} number={String(index + 1).padStart(2, "0")} align={index % 2 === 0 ? "left" : "right"} eyebrow={banner.eyebrow} title={banner.title} highlight={banner.highlight} benefit={banner.benefit} items={banner.items} warranty={banner.warranty} href={SERVICE_PATH_MAP[banner.key as ServiceKey]} cta={banner.cta} stats={banner.stats} slides={slidesByService[index]} />)}
      <div className="border-t border-white/10 bg-brand-dark px-6 py-6 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8 text-xs leading-snug">
            <span className="flex items-center gap-2"><BadgeCheck className="h-6 w-6 text-brand-gold" /><span className="font-semibold">Garantía<br /><span className="font-normal text-white/70">en cada proyecto</span></span></span>
            <span className="flex items-center gap-2"><Award className="h-6 w-6 text-brand-gold" /><span className="font-semibold">Materiales<br /><span className="font-normal text-white/70">certificados</span></span></span>
            <span className="flex items-center gap-2"><MapPin className="h-6 w-6 text-brand-gold" /><span className="font-semibold">Cobertura<br /><span className="font-normal text-white/70">nacional</span></span></span>
          </div>
          <a href="#simulador" className="inline-flex min-h-11 items-center rounded-full bg-brand-gold px-6 text-sm font-bold text-brand-dark transition hover:bg-white">Cotizar mi proyecto</a>
        </div>
      </div>
    </section>
  );
}
