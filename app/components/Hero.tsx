import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

const BANNERS = [
  { id: "canchas", category: "Canchas", image: "/hero/cancha.png", eyebrow: "01 — Ingeniería deportiva", title: "Canchas diseñadas", highlight: "para competir", description: "Escenarios deportivos resistentes, funcionales y listos para el ritmo real de uso.", href: "/servicios/canchas-deportivas", cta: "Ver canchas deportivas", stats: [["500+", "proyectos entregados"], ["20+", "años de experiencia"], ["FIFA", "materiales certificados"], ["45 días", "instalación promedio"]] },
  { id: "padel", category: "Pádel", image: "/hero/hero-1.png", eyebrow: "02 — Pádel profesional", title: "Pistas que elevan", highlight: "cada partido", description: "Diseño, estructura e iluminación para pistas de pádel con experiencia de alto rendimiento.", href: "/servicios/canchas-deportivas", cta: "Explorar pistas de pádel", stats: [["WPT", "estándar de diseño"], ["360°", "visión panorámica"], ["LED", "iluminación deportiva"], ["8+", "años de vida útil"]] },
  { id: "parques", category: "Parques infantiles", image: "/hero/parque.png", eyebrow: "03 — Recreación segura", title: "Parques que inspiran", highlight: "a jugar", description: "Zonas infantiles seguras y durables para colegios, conjuntos, hoteles y espacios públicos.", href: "/servicios/parques-infantiles", cta: "Ver parques infantiles", stats: [["EPDM", "pisos amortiguantes"], ["100%", "diseño seguro"], ["4", "líneas de juego"], ["20+", "años de experiencia"]] },
  { id: "terrazas", category: "Terrazas", image: "/hero/hero-2.png", eyebrow: "04 — Paisajismo arquitectónico", title: "Terrazas pensadas", highlight: "para disfrutar", description: "Superficies verdes de bajo mantenimiento que convierten cada terraza en un lugar habitable.", href: "/servicios/paisajismo", cta: "Diseñar mi terraza", stats: [["0%", "riego permanente"], ["365", "días de uso"], ["20–50 mm", "alturas disponibles"], ["100%", "acompañamiento"]] },
  { id: "balcones", category: "Balcones", image: "/hero/hero-3.png", eyebrow: "05 — Exterior residencial", title: "Balcones con vida", highlight: "y confort", description: "Soluciones verdes para ampliar visualmente tu hogar y disfrutarlo sin complicaciones.", href: "/servicios/paisajismo", cta: "Explorar balcones", stats: [["Mínimo", "mantenimiento"], ["Rápida", "instalación"], ["A medida", "cada superficie"], ["Colombia", "cobertura nacional"]] },
] as const;

export default function Hero() {
  return (
    <section className="bg-brand-dark text-white">
      <nav aria-label="Categorías del landing" className="sticky top-[76px] z-30 flex gap-2 overflow-x-auto border-b border-white/10 bg-brand-dark/95 px-6 py-4 backdrop-blur-md scrollbar-hide sm:top-[80px] sm:px-8 lg:px-16">
        {BANNERS.map((banner) => <a key={banner.id} href={`#${banner.id}`} className="shrink-0 rounded-full border border-white/35 px-5 py-2 text-sm font-semibold transition hover:border-brand-gold hover:bg-brand-gold hover:text-brand-dark">{banner.category}</a>)}
      </nav>

      {BANNERS.map((banner) => (
        <article id={banner.id} key={banner.id} className="relative isolate min-h-[calc(100svh-76px)] scroll-mt-28 overflow-hidden sm:min-h-[calc(100svh-80px)]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${banner.image}')` }} />
          <div className="absolute inset-0 bg-brand-dark/15" />
          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-[1440px] flex-col justify-between px-6 pb-8 pt-14 sm:px-8 sm:pt-16 lg:min-h-[calc(100svh-80px)] lg:px-16 lg:pb-10">
            <div className="flex flex-1 items-center py-14 sm:py-20">
              <div className="max-w-3xl rounded-3xl border border-white/30 bg-brand-dark/35 p-6 shadow-2xl backdrop-blur-[3px] sm:p-9 lg:p-11">
                <p className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold drop-shadow-sm sm:text-xs"><span>{banner.eyebrow.split(" — ")[0]}</span><span className="h-px w-6 bg-brand-gold" /><span>{banner.eyebrow.split(" — ")[1]}</span></p>
                <h2 className="max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] drop-shadow-[0_3px_12px_rgba(0,0,0,.6)] sm:text-5xl lg:text-6xl">{banner.title}<br /><span className="text-brand-gold">{banner.highlight}</span></h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.7)] sm:text-base lg:text-lg">{banner.description}</p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><Link href={banner.href} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 font-bold text-brand-dark transition hover:bg-brand-gold">{banner.cta}<ArrowRight className="h-5 w-5" /></Link><Link href="#simulador" className="inline-flex min-h-14 items-center justify-center px-4 font-semibold text-white underline decoration-white/70 underline-offset-8 transition hover:text-brand-gold">Cotizar mi proyecto</Link></div>
              </div>
            </div>
            <div className="grid max-w-5xl grid-cols-2 overflow-hidden rounded-2xl border border-white/35 bg-brand-dark/80 backdrop-blur-md sm:grid-cols-4">{banner.stats.map(([value, label]) => <div key={label} className="border-white/20 px-4 py-3 first:border-r sm:border-r sm:px-5 sm:py-4 [&:nth-child(2)]:border-b sm:[&:nth-child(2)]:border-b-0"><p className="text-xl font-extrabold sm:text-2xl">{value}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/70">{label}</p></div>)}</div>
          </div>
        </article>
      ))}

      <a href="#simulador" className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold shadow-xl transition hover:bg-[#1ebe57]" aria-label="Cotizar por WhatsApp"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
    </section>
  );
}
