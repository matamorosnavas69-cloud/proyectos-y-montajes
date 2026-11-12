"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";

const SLIDES = [
  {
    category: "Canchas",
    image: "/hero/cancha.png",
    eyebrow: "01 — Ingeniería deportiva",
    title: "Canchas diseñadas",
    highlight: "para competir",
    description: "Escenarios deportivos resistentes, funcionales y listos para el ritmo real de uso.",
    href: "/servicios/canchas-deportivas",
    cta: "Ver canchas deportivas",
    stats: [["500+", "proyectos entregados"], ["20+", "años de experiencia"], ["FIFA", "materiales certificados"], ["45 días", "instalación promedio"]],
  },
  {
    category: "Pádel",
    image: "/hero/hero-1.png",
    eyebrow: "02 — Pádel profesional",
    title: "Pistas que elevan",
    highlight: "cada partido",
    description: "Diseño, estructura e iluminación para pistas de pádel con experiencia de alto rendimiento.",
    href: "/servicios/canchas-deportivas",
    cta: "Explorar pistas de pádel",
    stats: [["WPT", "estándar de diseño"], ["360°", "visión panorámica"], ["LED", "iluminación deportiva"], ["8+", "años de vida útil"]],
  },
  {
    category: "Parques infantiles",
    image: "/hero/parque.png",
    eyebrow: "03 — Recreación segura",
    title: "Parques que inspiran",
    highlight: "a jugar",
    description: "Zonas infantiles seguras y durables para colegios, conjuntos, hoteles y espacios públicos.",
    href: "/servicios/parques-infantiles",
    cta: "Ver parques infantiles",
    stats: [["EPDM", "pisos amortiguantes"], ["100%", "diseño seguro"], ["4", "líneas de juego"], ["20+", "años de experiencia"]],
  },
  {
    category: "Terrazas",
    image: "/hero/hero-2.png",
    eyebrow: "04 — Paisajismo arquitectónico",
    title: "Terrazas pensadas",
    highlight: "para disfrutar",
    description: "Superficies verdes de bajo mantenimiento que convierten cada terraza en un lugar habitable.",
    href: "/servicios/paisajismo",
    cta: "Diseñar mi terraza",
    stats: [["0%", "riego permanente"], ["365", "días de uso"], ["20–50 mm", "alturas disponibles"], ["100%", "acompañamiento"]],
  },
  {
    category: "Balcones",
    image: "/hero/hero-3.png",
    eyebrow: "05 — Exterior residencial",
    title: "Balcones con vida",
    highlight: "y confort",
    description: "Soluciones verdes para ampliar visualmente tu hogar y disfrutarlo sin complicaciones.",
    href: "/servicios/paisajismo",
    cta: "Explorar balcones",
    stats: [["Mínimo", "mantenimiento"], ["Rápida", "instalación"], ["A medida", "cada superficie"], ["Colombia", "cobertura nacional"]],
  },
] as const;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate min-h-[calc(100svh-76px)] overflow-hidden bg-brand-dark text-white sm:min-h-[calc(100svh-80px)]">
      <div className="absolute inset-0">
        {SLIDES.map((item, itemIndex) => <div key={item.image} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${itemIndex === index ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url('${item.image}')` }} aria-hidden={itemIndex !== index} />)}
        <div className="absolute inset-0 bg-brand-dark/15" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-[1440px] flex-col px-6 pb-8 pt-8 sm:px-8 lg:min-h-[calc(100svh-80px)] lg:px-16 lg:pb-10 lg:pt-10">
        <nav aria-label="Categorías" className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SLIDES.map((item, itemIndex) => <button key={item.category} type="button" onClick={() => setIndex(itemIndex)} className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold backdrop-blur-sm transition ${itemIndex === index ? "border-brand-gold bg-brand-gold text-brand-dark" : "border-white/55 bg-black/10 text-white hover:border-brand-gold hover:bg-white/10"}`}>{item.category}</button>)}
        </nav>

        <div className="flex flex-1 items-center pb-10 pt-16 sm:pt-20 lg:pb-14 lg:pt-12">
          <div className="max-w-3xl rounded-3xl border border-white/30 bg-brand-dark/35 p-6 shadow-2xl backdrop-blur-[3px] sm:p-9 lg:p-11">
            <p className="mb-6 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-gold drop-shadow-sm sm:text-sm"><span>{slide.eyebrow.split(" — ")[0]}</span><span className="h-px w-8 bg-brand-gold" /><span>{slide.eyebrow.split(" — ")[1]}</span></p>
            <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-0.04em] drop-shadow-[0_3px_12px_rgba(0,0,0,.6)] sm:text-6xl lg:text-8xl">{slide.title}<br /><span className="text-brand-gold">{slide.highlight}</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.7)] sm:text-lg lg:text-xl">{slide.description}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><Link href={slide.href} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 font-bold text-brand-dark transition hover:bg-brand-gold">{slide.cta}<ArrowRight className="h-5 w-5" /></Link><Link href="#simulador" className="inline-flex min-h-14 items-center justify-center px-4 font-semibold text-white underline decoration-white/70 underline-offset-8 transition hover:text-brand-gold">Cotizar mi proyecto</Link></div>
          </div>
        </div>

        <div className="grid max-w-5xl grid-cols-2 overflow-hidden rounded-2xl border border-white/35 bg-brand-dark/80 backdrop-blur-md sm:grid-cols-4">{slide.stats.map(([value, label]) => <div key={label} className="border-white/20 px-5 py-4 first:border-r sm:border-r sm:px-6 sm:py-5 [&:nth-child(2)]:border-b sm:[&:nth-child(2)]:border-b-0"><p className="text-2xl font-black sm:text-3xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">{label}</p></div>)}</div>
      </div>

      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3 sm:right-10"><a href="#simulador" className="hidden items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold shadow-xl transition hover:bg-[#1ebe57] sm:inline-flex"><MessageCircle className="h-4 w-4" /> WhatsApp</a><div className="flex gap-2" aria-label="Cambiar banner">{SLIDES.map((item, itemIndex) => <button key={item.image} type="button" aria-label={`Ver banner de ${item.category}`} onClick={() => setIndex(itemIndex)} className={`h-2 rounded-full transition-all ${itemIndex === index ? "w-8 bg-brand-gold" : "w-2 bg-white/70"}`} />)}</div></div>
      <ChevronDown className="absolute bottom-8 left-1/2 z-20 hidden h-6 w-6 -translate-x-1/2 animate-bounce text-white/80 lg:block" aria-hidden="true" />
    </section>
  );
}
