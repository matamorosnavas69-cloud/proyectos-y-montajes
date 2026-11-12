"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/app/components/ServiceHeroSlider";

type LandingHeroCarouselProps = {
  id: string;
  category: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  href: string;
  cta: string;
  stats: readonly (readonly [string, string])[];
  slides: HeroSlide[];
};

export default function LandingHeroCarousel({
  id,
  category,
  eyebrow,
  title,
  highlight,
  description,
  href,
  cta,
  stats,
  slides,
}: LandingHeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const activeSlide = slides[current] || slides[0];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!activeSlide) return null;

  return (
    <article id={id} className="relative isolate min-h-screen scroll-mt-28 overflow-hidden border-b border-white/10 bg-brand-dark text-white">
      <div className="absolute inset-0">
        {slides.map((slide, index) => <Image key={`${slide.src}-${index}`} src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw" style={{ objectPosition: slide.focalPoint || "50% 50%" }} className={`object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`} />)}
        <div className="absolute inset-0 bg-brand-dark/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-between px-6 pb-7 pt-14 sm:px-8 sm:pt-16 lg:px-16 lg:pb-9">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-white/55 bg-black/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm">{category}</span>
          {slides.length > 1 && <span className="rounded-full border border-white/30 bg-black/15 px-3 py-1.5 text-[11px] font-mono font-bold backdrop-blur-sm"><span className="text-brand-gold">{String(current + 1).padStart(2, "0")}</span> / {String(slides.length).padStart(2, "0")}</span>}
        </div>

        <div className="flex flex-1 items-center py-12 sm:py-16">
          <div className="max-w-xl rounded-2xl border border-white/25 bg-brand-dark/25 p-5 shadow-2xl backdrop-blur-[2px] sm:p-7 lg:p-8">
            <p className="mb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-gold sm:text-[10px]"><span>{eyebrow.split(" — ")[0]}</span><span className="h-px w-5 bg-brand-gold" /><span>{eyebrow.split(" — ")[1]}</span></p>
            <h2 className="text-3xl font-extrabold leading-[1.04] tracking-[-0.025em] drop-shadow-[0_2px_8px_rgba(0,0,0,.65)] sm:text-4xl lg:text-5xl">{title}<br /><span className="text-brand-gold">{highlight}</span></h2>
            <p className="mt-4 max-w-lg text-xs leading-relaxed text-white drop-shadow-[0_1px_5px_rgba(0,0,0,.7)] sm:text-sm lg:text-base">{activeSlide.title || description}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-white/75">{activeSlide.tag}{activeSlide.location ? ` · ${activeSlide.location}` : ""}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3"><Link href={href} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-brand-dark transition hover:bg-brand-gold">{cta}<ArrowRight className="h-4 w-4" /></Link><Link href="#simulador" className="text-xs font-semibold text-white underline underline-offset-4 hover:text-brand-gold">Cotizar proyecto</Link></div>
          </div>
        </div>

        <div className="grid max-w-4xl grid-cols-2 overflow-hidden rounded-xl border border-white/30 bg-brand-dark/75 backdrop-blur-md sm:grid-cols-4">{stats.map(([value, label]) => <div key={label} className="border-white/20 px-4 py-3 first:border-r sm:border-r sm:px-5 sm:py-3.5 [&:nth-child(2)]:border-b sm:[&:nth-child(2)]:border-b-0"><p className="text-lg font-extrabold sm:text-xl">{value}</p><p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white/70 sm:text-[9px]">{label}</p></div>)}</div>
        {slides.length > 1 && <div className="mt-3 flex gap-1.5" aria-label={`Imágenes de ${category}`}>{slides.map((slide, index) => <button key={`${slide.src}-dot`} type="button" onClick={() => setCurrent(index)} aria-label={`Ver imagen ${index + 1} de ${category}`} className={`h-1.5 rounded-full transition-all ${index === current ? "w-7 bg-brand-gold" : "w-1.5 bg-white/70"}`} />)}</div>}
      </div>
    </article>
  );
}
