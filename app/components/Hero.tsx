"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, MapPin } from "lucide-react";
import { HeroSlide } from "@/app/components/ServiceHeroSlider";

interface HeroProps {
  slides?: HeroSlide[];
}

const DEFAULT_HOME_SLIDE: HeroSlide = {
  src: "/images/padel/IMG_3346.PNG",
  alt: "Pistas profesionales de pádel panorámico construidas por Proyectos y Montajes en Colombia",
  title: "Club Pádel Smash de Competición",
  location: "Sede Deportiva Cubierta",
  tag: "Pádel Panorámico WPT",
  focalX: 50,
  focalY: 50,
};

export default function Hero({ slides }: HeroProps) {
  const activeSlides = (slides && slides.length > 0) ? slides : [DEFAULT_HOME_SLIDE];
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isSlider = activeSlides.length > 1;

  const nextSlide = useCallback(() => {
    if (!isSlider) return;
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length, isSlider]);

  const prevSlide = useCallback(() => {
    if (!isSlider) return;
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length, isSlider]);

  // Auto-rotation timer (6.5s) if multiple slides are configured
  useEffect(() => {
    if (!isSlider || isPaused) return;
    const interval = setInterval(nextSlide, 6500);
    return () => clearInterval(interval);
  }, [isSlider, isPaused, nextSlide]);

  const currentSlide = activeSlides[current] || activeSlides[0];

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-brand-dark overflow-hidden font-sans">
      {/* Background authentic construction photography layers */}
      <div className="absolute inset-0 z-0">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === current;
          const focalPos =
            slide.focalPoint ||
            (slide.focalX != null && slide.focalY != null
              ? `${slide.focalX}% ${slide.focalY}%`
              : "50% 50%");

          return (
            <div
              key={`${slide.src}-${idx}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt || slide.title || "Fotografía de obra real"}
                fill
                priority={idx === 0}
                sizes="100vw"
                quality={85}
                style={{ objectPosition: focalPos }}
                className={`object-cover w-full h-full transform transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Minimal natural vignette preserving authentic photography brilliance while ensuring text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-black/40 to-brand-dark/50 z-10 pointer-events-none" />
      </div>

      {/* Ambient architectural glow accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none z-[12]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none z-[12]" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-16 sm:px-24 max-w-5xl mx-auto py-48 md:py-64">
        {/* Engineering Authority Badge */}
        <div className="inline-flex items-center gap-10 px-18 py-6 rounded-full bg-brand-green/25 border border-brand-green/60 text-brand-gold mb-24 md:mb-32 backdrop-blur-md badge-glow">
          <span className="relative flex h-[10px] w-[10px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-brand-gold"></span>
          </span>
          <span className="text-12 font-bold tracking-widest uppercase text-white/95">
            Más de 20 años transformando espacios en Colombia
          </span>
        </div>

        {/* Canonical Engineering Positioning Heading */}
        <h1 className="text-36 sm:text-48 md:text-56 lg:text-64 font-black text-white mb-20 md:mb-28 leading-[1.08] tracking-tight max-w-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          Ingeniería Deportiva, Recreativa y{" "}
          <span className="text-gradient-gold">
            Paisajismo Arquitectónico
          </span>
        </h1>

        {/* Value Proposition Description */}
        <p className="text-16 sm:text-18 md:text-20 text-gray-200 mb-36 md:mb-44 max-w-3xl leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Especialistas en pistas de Pádel profesionales, canchas de fútbol sintético, parques infantiles seguros y paisajismo corporativo y residencial de alta durabilidad.
        </p>

        {/* Responsive Conversion Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-16 sm:gap-20 w-full sm:w-auto">
          <a
            href="#simulador"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-gold text-brand-dark px-32 sm:px-40 py-16 sm:py-18 rounded-xl font-bold text-16 sm:text-18 hover:bg-yellow-400 transition-all shadow-flat hover:shadow-glow-gold hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Cotizar Mi Proyecto
          </a>
          <Link
            href="/portafolio"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/5 border border-white/20 text-white px-28 sm:px-36 py-16 sm:py-18 rounded-xl font-semibold text-16 sm:text-18 hover:bg-white/10 hover:border-brand-gold/60 hover:text-brand-gold transition-all backdrop-blur-sm shadow-flat focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Explorar Obras Reales
          </Link>
        </div>
      </div>

      {/* Floating Slide Caption (When multiple slides or tagged slide) */}
      {currentSlide.tag && (
        <div className="hidden lg:flex absolute bottom-8 left-10 z-30 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_#d4af37]" />
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold block truncate">
                {currentSlide.tag}
              </span>
              <p className="text-xs font-bold text-white truncate">
                {currentSlide.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Slider Controls (Active only when multiple slides are configured) */}
      {isSlider && (
        <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-10 z-30 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-2xl">
          {/* Slide counter */}
          <div className="text-[11px] font-mono font-bold tracking-wider text-gray-300 flex items-center gap-1">
            <span className="text-brand-gold font-black">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">
              {String(activeSlides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Pill progress dots */}
          <div className="flex items-center gap-1.5 px-1">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Ver diapositiva ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current
                    ? "w-5 bg-brand-gold shadow-[0_0_6px_rgba(212,175,55,0.8)]"
                    : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Pause / Play / Prev / Next Chevrons */}
          <div className="flex items-center gap-0.5 border-l border-white/10 pl-1.5">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Reanudar rotación" : "Pausar rotación"}
              title={isPaused ? "Reanudar rotación" : "Pausar rotación"}
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 fill-current text-brand-gold" />
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Diapositiva anterior"
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Siguiente diapositiva"
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Subtle Scroll Down Prompt */}
      {!isSlider && (
        <div className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-6 text-brand-gold/80 hover:text-brand-gold transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Descubrir Servicios
          </span>
          <svg
            className="w-20 h-20 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </section>
  );
}
