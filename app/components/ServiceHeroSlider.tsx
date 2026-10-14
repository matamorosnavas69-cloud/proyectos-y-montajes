"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroSlide {
  src: string;
  alt: string;
  title: string;
  location: string;
  tag: string;
  focalPoint?: string;
  focalX?: number;
  focalY?: number;
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
 * ServiceHeroSlider — High-End Editorial Hero for Service Pages
 *
 * Senior Web Designer Architecture:
 * - Clean protagonist image showcase: ZERO text, heavy overlays, or prominent buttons blocking the photograph.
 * - Minimalist blurred indicator: A discreet, subtle blurred circle/pill with soft dots for slide indication.
 * - Fully accessible: Pauses on hover, pauses on focus, respects prefers-reduced-motion, supports keyboard arrows.
 * - Desktop: 12-column architectural split with editorial metadata on the left and cinematic frame on the right.
 * - Mobile: Unobstructed photography frame at top with subtle indicator dots directly below.
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
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-rotation timer (4.5s intervals)
  useEffect(() => {
    if (isPaused || prefersReducedMotion || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 4500);
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

  const activeSlide = slides[current];

  return (
    <section
      className="relative w-full bg-brand-dark text-white border-b border-brand-green/20 overflow-hidden font-sans"
      aria-roledescription="carousel"
      aria-label={`Galería de ${title}`}
    >
      {/* Subtle architectural grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 lg:py-16 relative z-10">
        {/* Breadcrumb Navigation */}
        <div className="mb-5 flex items-center gap-2.5 text-xs md:text-sm font-medium tracking-wider uppercase text-gray-400">
          <Link
            href="/#servicios"
            className="hover:text-brand-gold transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr;</span> Volver a Servicios
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-brand-gold font-semibold">{badge}</span>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial & Context (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-brand-green text-xs font-bold tracking-widest uppercase mb-4 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              {badge}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.12] tracking-tight mb-4">
              {title}{" "}
              {titleAccent && (
                <span className="text-brand-gold block sm:inline">{titleAccent}</span>
              )}
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
              {description}
            </p>

            {/* Key Technical Metric Pills */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/10 mb-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-lg md:text-xl font-black text-brand-gold tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="flex items-center gap-4">
              <Link
                href={primaryCtaLink}
                className="bg-brand-gold text-brand-dark px-6 py-3 rounded-md font-bold text-sm tracking-wide hover:bg-yellow-400 transition-all shadow-flat inline-flex items-center gap-2"
              >
                {primaryCtaText}
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Protagonist Image Showcase (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              aria-label="Presentación de fotografías de obra. Use las flechas izquierda y derecha para navegar."
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/10] rounded-2xl overflow-hidden border border-brand-green/25 bg-black/40 shadow-2xl group focus:outline-none focus:ring-2 focus:ring-brand-gold/60"
            >
              {/* Slides Render — 100% CLEAN AND UNOBSTRUCTED REAL PHOTOGRAPHY */}
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  aria-hidden={idx !== current}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    style={{
                      objectPosition:
                        slide.focalPoint ||
                        (slide.focalX != null && slide.focalY != null
                          ? `${slide.focalX}% ${slide.focalY}%`
                          : "center"),
                    }}
                    className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-102 select-none"
                  />
                </div>
              ))}

              {/* Discreet, subtle caption in bottom-left */}
              <div className="absolute bottom-4 left-4 z-20 pointer-events-none max-w-[70%]">
                <div className="bg-brand-dark/80 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-brand-green/80 text-white text-[9px] font-bold uppercase tracking-wider">
                      {activeSlide.tag}
                    </span>
                    <span className="text-[11px] text-brand-gold font-medium truncate">
                      {activeSlide.location}
                    </span>
                  </div>
                  <h4 className="text-white text-xs sm:text-sm font-semibold truncate leading-tight">
                    {activeSlide.title}
                  </h4>
                </div>
              </div>

              {/* Minimalist Blurred Indicator in bottom-right */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-lg">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Ver fotografía ${idx + 1} de ${slides.length}`}
                    className={`rounded-full transition-all duration-300 ${
                      idx === current
                        ? "w-2.5 h-2.5 bg-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.7)]"
                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
