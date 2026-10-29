"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface HeroSlide {
  src: string;
  alt: string;
  title: string;
  location: string;
  tag: string;
  focalPoint?: string;
  focalX?: number;
  focalY?: number;
  assetId?: string | null;
}

export interface ServiceHeroProps {
  badge: string;
  title: string;
  titleAccent?: string;
  description: string;
  stats: { value: string; label: string }[];
  slides: HeroSlide[];
  primaryCtaText?: string;
  primaryCtaLink?: string;
}

/**
 * ServiceHeroSlider — Senior Architectural Split-Bleed Hero
 *
 * Senior UI/UX Architecture:
 * - NO ENCLOSED CONTAINER: The photography canvas is NOT trapped in a rounded box.
 *   It takes the ENTIRE right side of the screen on the back, bleeding edge-to-edge
 *   to the top, bottom, and right viewport boundaries.
 * - Cinematic Gradient Bleed: Seamless horizontal gradient transition dissolving into the
 *   deep brand obsidian background (#0b120d), ensuring flawless typography legibility.
 * - Grid-Aligned Content: Left editorial copy adheres strictly to the 7xl container grid.
 * - Precision Focal Framing: Dynamic focal points (focalX, focalY) ensure critical
 *   sports court elements (padel glass, turf, modules) are never cropped awkwardly.
 * - Floating Cinematic Controls: Discreet glassmorphism navigation with animated slide
 *   indicators, location pills, and smooth transitions.
 */
export default function ServiceHeroSlider({
  badge,
  title,
  titleAccent,
  description,
  stats,
  slides,
  primaryCtaText = "Cotizar Proyecto",
  primaryCtaLink = "/#simulador",
}: ServiceHeroProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-rotation timer (5.5s intervals)
  useEffect(() => {
    if (isPaused || prefersReducedMotion || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion, nextSlide, slides.length]);

  // Keyboard navigation when slider area is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  };

  const activeSlide = slides[current] || slides[0] || {
    src: "",
    alt: "",
    title: "",
    location: "",
    tag: "",
  };

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full min-h-[580px] lg:min-h-[660px] xl:min-h-[720px] bg-[#0b120d] text-white border-b border-brand-green/20 overflow-hidden font-sans select-none focus:outline-none"
      aria-roledescription="carousel"
      aria-label={`Galería de ${title}`}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ========================================================================= */}
      {/* RIGHT SIDE CINEMATIC PHOTOGRAPHY CANVAS — TAKES THE ENTIRE RIGHT SIDE ON BACK */}
      {/* ========================================================================= */}
      <div className="lg:absolute lg:top-0 lg:bottom-0 lg:right-0 lg:w-[58%] xl:w-[60%] 2xl:w-[62%] w-full h-[340px] sm:h-[420px] lg:h-full z-0 overflow-hidden">
        {/* Slides rendering */}
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          const focalPos =
            slide.focalPoint ||
            (slide.focalX != null && slide.focalY != null
              ? `${slide.focalX}% ${slide.focalY}%`
              : "50% 50%");

          return (
            <div
              key={idx}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt || slide.title || "Fotografía de obra"}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 65vw"
                style={{ objectPosition: focalPos }}
                className={`object-cover w-full h-full transform transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* --- ARCHITECTURAL GRADIENT OVERLAYS (BLENDS SEAMLESSLY INTO BACKGROUND) --- */}
        
        {/* 1. Left-to-Right Edge Bleed Gradient (Desktop) */}
        <div
          className="hidden lg:block absolute inset-y-0 left-0 w-64 xl:w-96 z-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #0b120d 0%, rgba(11, 18, 13, 0.95) 25%, rgba(11, 18, 13, 0.6) 60%, transparent 100%)",
          }}
        />

        {/* 2. Top Shade for Global Nav contrast */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#0b120d]/80 via-[#0b120d]/30 to-transparent z-20 pointer-events-none" />

        {/* 3. Bottom Gradient for Controls & Mobile readability */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#0b120d] via-[#0b120d]/60 to-transparent z-20 pointer-events-none" />

        {/* 4. Subtle Radial Highlight (Atmospheric glow) */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none z-10" />

        {/* --- FLOATING CINEMATIC CAPTION PILL (DESKTOP) --- */}
        {activeSlide && (
          <div className="hidden lg:flex absolute bottom-8 left-12 xl:left-16 z-30 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_8px_#d4af37]" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-gold">
                    {activeSlide.tag}
                  </span>
                  {activeSlide.location && (
                    <span className="text-[10px] text-gray-300 font-medium flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-gray-400" />
                      {activeSlide.location}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-white truncate mt-0.5">
                  {activeSlide.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- FLOATING SLIDER NAVIGATION & PROGRESS BAR (BOTTOM RIGHT) --- */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-10 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-2xl">
            {/* Slide counter */}
            <div className="text-[11px] font-mono font-bold tracking-wider text-gray-300 flex items-center gap-1">
              <span className="text-brand-gold font-black">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-400">
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            {/* Pill progress bars */}
            <div className="flex items-center gap-1.5 px-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Ver fotografía ${idx + 1} de ${slides.length}`}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === current
                      ? "w-6 bg-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next Chevrons */}
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
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
      </div>

      {/* ========================================================================= */}
      {/* LEFT SIDE CONTENT CONTAINER — STRICTLY ALIGNED TO 7XL GRID */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16 xl:py-20 relative z-10 flex flex-col justify-center min-h-[580px] lg:min-h-[660px] xl:min-h-[720px]">
        <div className="w-full lg:max-w-xl xl:max-w-2xl flex flex-col justify-center">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Migas de pan" className="mb-4 flex items-center gap-2 text-xs md:text-sm font-medium tracking-wider uppercase text-gray-400">
            <Link
              href="/#servicios"
              className="hover:text-brand-gold transition-colors inline-flex items-center gap-1.5"
            >
              <span>&larr;</span> Volver a Servicios
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-brand-gold font-bold truncate">{badge}</span>
          </nav>

          {/* Service Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-green/25 border border-brand-green/50 text-emerald-300 text-xs font-bold tracking-widest uppercase mb-4 w-fit shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight mb-4 drop-shadow-sm">
            {title}{" "}
            {titleAccent && (
              <span className="text-brand-gold block sm:inline">{titleAccent}</span>
            )}
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-normal max-w-xl">
            {description}
          </p>

          {/* Key Technical Metric Pills */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/10 mb-6 bg-black/20 lg:bg-transparent rounded-xl lg:rounded-none px-3 lg:px-0">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-lg md:text-xl xl:text-2xl font-black text-brand-gold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Call to Action Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={primaryCtaLink}
              className="bg-brand-gold hover:bg-yellow-400 text-brand-dark px-7 py-3.5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-glow-gold hover:scale-[1.02] inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <Link
              href="/portafolio"
              className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs md:text-sm tracking-wide transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Ver Portafolio de Obras</span>
            </Link>
          </div>

          {/* Mobile-only Slide Caption */}
          <div className="lg:hidden mt-6 p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-xs text-gray-300">
            <div className="truncate">
              <span className="text-brand-gold font-bold mr-2">{activeSlide.tag}</span>
              <span>{activeSlide.title}</span>
            </div>
            {activeSlide.location && (
              <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                {activeSlide.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
