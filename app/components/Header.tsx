"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import BrandLogo from "@/app/components/brand/BrandLogo";
import MobileNavDrawer from "@/app/components/MobileNavDrawer";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-brand-dark border-b border-brand-green/20 text-white shadow-flat backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-12 sm:px-16 h-[76px] sm:h-[80px] flex items-center justify-between">
          {/* Logo area */}
          <div className="flex items-center">
            {/* Desktop & Tablet: Standard horizontal lockup */}
            <div className="hidden sm:block">
              <BrandLogo
                variant="horizontal"
                theme="dark"
                height={42}
                priority={true}
                className="hover:opacity-95 transition-opacity"
              />
            </div>
            {/* Mobile Viewports (< 640px): Isotipo + Compact Typography (total ~135px width) */}
            <div className="block sm:hidden">
              <Link
                href="/"
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm"
                aria-label="Proyectos y Montajes — Inicio"
              >
                <BrandLogo
                  variant="mark"
                  theme="dark"
                  height={36}
                  priority={true}
                  showLink={false}
                  className="group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[14px] font-black tracking-tight text-white group-hover:text-brand-gold transition-colors font-sans">
                    PROYECTOS
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-brand-gold font-sans">
                    & MONTAJES
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Segments (>= 768px) */}
          <nav className="hidden md:flex items-center gap-24 lg:gap-32 font-medium font-sans">
            <Link
              href="/servicios/canchas-deportivas"
              className="text-gray-300 hover:text-brand-gold transition-colors text-15 lg:text-16"
            >
              Canchas Deportivas
            </Link>
            <Link
              href="/servicios/parques-infantiles"
              className="text-gray-300 hover:text-brand-gold transition-colors text-15 lg:text-16"
            >
              Parques Infantiles
            </Link>
            <Link
              href="/servicios/paisajismo"
              className="text-gray-300 hover:text-brand-gold transition-colors text-15 lg:text-16"
            >
              Jardín & Terraza
            </Link>
            <Link
              href="/portafolio"
              className="text-white hover:text-brand-green transition-colors text-15 lg:text-16 font-bold"
            >
              Portafolio
            </Link>
            <Link
              href="/nosotros"
              className="text-gray-300 hover:text-brand-gold transition-colors text-15 lg:text-16"
            >
              Nosotros
            </Link>
          </nav>

          {/* Actions: CTA & Mobile Hamburger Trigger */}
          <div className="flex items-center gap-8 sm:gap-12 shrink-0">
            {/* Quotation CTA */}
            <Link
              href="/#simulador"
              className="hidden min-[360px]:inline-flex items-center justify-center bg-brand-gold text-brand-dark px-12 sm:px-16 py-8 rounded-md font-bold hover:bg-yellow-400 transition-all shadow-flat font-sans text-12 sm:text-14 whitespace-nowrap shrink-0"
            >
              <span className="hidden sm:inline">Cotizar Proyecto</span>
              <span className="inline sm:hidden">Cotizar</span>
            </Link>

            {/* Mobile Hamburger Button (< 768px) */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="md:hidden w-[42px] h-[42px] shrink-0 flex items-center justify-center rounded-md border border-white/15 bg-white/5 hover:bg-white/10 hover:border-brand-gold/60 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-colors"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={
                isDrawerOpen
                  ? "Cerrar menú de navegación"
                  : "Abrir menú de navegación"
              }
            >
              <svg
                className="w-22 h-22"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isDrawerOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Slide-over Drawer */}
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        triggerRef={hamburgerRef}
      />
    </>
  );
}
