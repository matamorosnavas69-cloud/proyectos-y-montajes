"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";

const SLIDES = [
  { image: "/hero/cancha.png", eyebrow: "01 — Ingeniería deportiva", title: "Canchas diseñadas", highlight: "para competir", description: "Construimos escenarios deportivos resistentes, funcionales y listos para el ritmo de uso de tu proyecto.", href: "/servicios/canchas-deportivas", cta: "Ver canchas deportivas" },
  { image: "/hero/hero-2.png", eyebrow: "02 — Paisajismo arquitectónico", title: "Espacios verdes", highlight: "para disfrutar", description: "Terrazas, jardines y balcones con soluciones de alto desempeño, diseñadas para verse bien todos los días.", href: "/servicios/paisajismo", cta: "Explorar paisajismo" },
  { image: "/hero/parque.png", eyebrow: "03 — Recreación segura", title: "Parques que inspiran", highlight: "a jugar", description: "Diseñamos zonas infantiles seguras y durables para colegios, conjuntos, hoteles y espacios públicos.", href: "/servicios/parques-infantiles", cta: "Ver parques infantiles" },
] as const;

const CATEGORIES = [["Canchas", "/servicios/canchas-deportivas"], ["Pádel", "/servicios/canchas-deportivas"], ["Parques", "/servicios/parques-infantiles"], ["Terrazas", "/servicios/paisajismo"], ["Balcones", "/servicios/paisajismo"]] as const;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate min-h-[calc(100svh-76px)] overflow-hidden bg-brand-dark text-white sm:min-h-[calc(100svh-80px)]">
      <div className="absolute inset-0">
        {SLIDES.map((item, itemIndex) => <div key={item.image} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${itemIndex === index ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url('${item.image}')` }} aria-hidden={itemIndex !== index} />)}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,43,42,.92)_0%,rgba(3,43,42,.72)_38%,rgba(3,43,42,.16)_78%),linear-gradient(0deg,rgba(3,43,42,.92)_0%,rgba(3,43,42,.08)_52%)]" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-[1440px] flex-col px-6 pb-8 pt-8 sm:px-8 lg:min-h-[calc(100svh-80px)] lg:px-16 lg:pb-10 lg:pt-10">
        <nav aria-label="Categorías" className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">{CATEGORIES.map(([label, href]) => <Link key={label} href={href} className="shrink-0 rounded-full border border-white/35 bg-black/10 px-5 py-2 text-sm font-semibold text-white/95 backdrop-blur-sm transition hover:border-brand-gold hover:bg-white/10">{label}</Link>)}</nav>
        <div className="flex flex-1 items-center pb-10 pt-20 sm:pt-24 lg:pb-16 lg:pt-16"><div className="max-w-3xl">
          <p className="mb-6 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-gold sm:text-sm"><span>{slide.eyebrow.split(" — ")[0]}</span><span className="h-px w-8 bg-brand-gold" /><span>{slide.eyebrow.split(" — ")[1]}</span></p>
          <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-0.04em] sm:text-6xl lg:text-8xl">{slide.title}<br /><span className="text-brand-gold">{slide.highlight}</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg lg:text-xl">{slide.description}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><Link href={slide.href} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 font-bold text-brand-dark transition hover:bg-brand-gold">{slide.cta}<ArrowRight className="h-5 w-5" /></Link><Link href="#simulador" className="inline-flex min-h-14 items-center justify-center px-4 font-semibold text-white underline decoration-white/50 underline-offset-8 transition hover:text-brand-gold">Cotizar mi proyecto</Link></div>
        </div></div>
        <div className="grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-white/25 bg-brand-dark/75 backdrop-blur-md sm:grid-cols-4">{[["20+", "años de experiencia"], ["100%", "acompañamiento"], ["4", "líneas de servicio"], ["Colombia", "cobertura nacional"]].map(([value, label]) => <div key={label} className="border-white/20 px-5 py-4 first:border-r sm:border-r sm:px-6 sm:py-5 [&:nth-child(2)]:border-b sm:[&:nth-child(2)]:border-b-0"><p className="text-2xl font-black sm:text-3xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">{label}</p></div>)}</div>
      </div>
      <div className="absolute bottom-8 right-6 z-20 flex items-center gap-3 sm:right-10"><a href="#simulador" className="hidden items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold shadow-xl transition hover:bg-[#1ebe57] sm:inline-flex"><MessageCircle className="h-4 w-4" /> WhatsApp</a><div className="flex gap-2" aria-label="Cambiar imagen del hero">{SLIDES.map((item, itemIndex) => <button key={item.image} type="button" aria-label={`Ver imagen ${itemIndex + 1}`} onClick={() => setIndex(itemIndex)} className={`h-2 rounded-full transition-all ${itemIndex === index ? "w-8 bg-brand-gold" : "w-2 bg-white/60"}`} />)}</div></div>
      <ChevronDown className="absolute bottom-8 left-1/2 z-20 hidden h-6 w-6 -translate-x-1/2 animate-bounce text-white/60 lg:block" aria-hidden="true" />
    </section>
  );
}
