"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/app/components/brand/BrandLogo";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const navRoutes = [
  { href: "/", label: "Inicio", subtitle: "Portada principal y visión" },
  {
    href: "/servicios/canchas-deportivas",
    label: "Canchas Deportivas",
    subtitle: "Pistas de Pádel y Fútbol Sintético",
  },
  {
    href: "/servicios/parques-infantiles",
    label: "Parques Infantiles",
    subtitle: "Áreas recreativas y pisos de seguridad",
  },
  {
    href: "/servicios/paisajismo",
    label: "Jardín & Terraza",
    subtitle: "Paisajismo residencial y comercial",
  },
  {
    href: "/portafolio",
    label: "Portafolio de Obras",
    subtitle: "Proyectos construidos y especificaciones",
  },
  {
    href: "/nosotros",
    label: "Nosotros",
    subtitle: "Trayectoria, equipo y metodología",
  },
];

export default function MobileNavDrawer({
  isOpen,
  onClose,
  triggerRef,
}: MobileNavDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Prevent layout shift
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      if (top) {
        window.scrollTo(0, parseInt(top || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
    };
  }, [isOpen]);

  // Focus trap and management
  useEffect(() => {
    if (isOpen) {
      // Focus close button on open
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
          triggerRef.current?.focus();
          return;
        }

        if (e.key === "Tab" && drawerRef.current) {
          const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    } else {
      // Return focus to trigger upon closing
      triggerRef.current?.focus();
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal de navegación"
      id="mobile-navigation-drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-[340px] h-full bg-brand-dark border-l border-brand-green/30 text-white flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-slide-in-right"
      >
        {/* Drawer Header */}
        <div className="p-16 border-b border-brand-green/20 flex items-center justify-between bg-brand-dark/95">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded"
            aria-label="Proyectos y Montajes — Inicio"
          >
            <BrandLogo
              variant="mark"
              theme="dark"
              height={32}
              showLink={false}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-black tracking-tight text-white font-sans">
                PROYECTOS
              </span>
              <span className="text-[9px] font-bold tracking-widest text-brand-gold font-sans">
                & MONTAJES
              </span>
            </div>
          </Link>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="w-40 h-40 flex items-center justify-center rounded-md border border-white/10 hover:border-brand-gold hover:text-brand-gold text-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            aria-label="Cerrar menú de navegación"
          >
            <svg
              className="w-20 h-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-16 py-20 space-y-8 font-sans">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 px-8 mb-8">
            Navegación
          </p>
          {navRoutes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={onClose}
                className={`group flex flex-col px-12 py-10 rounded-md transition-all ${
                  isActive
                    ? "bg-brand-green/25 text-brand-gold border-l-4 border-brand-gold font-semibold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-[15px] font-medium leading-snug">
                  {route.label}
                </span>
                <span className="text-[11px] text-gray-400 group-hover:text-gray-300">
                  {route.subtitle}
                </span>
              </Link>
            );
          })}

          <div className="pt-16 border-t border-brand-green/20">
            <Link
              href="/#simulador"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-8 py-12 px-16 rounded-md bg-brand-gold text-brand-dark font-bold text-[14px] hover:bg-yellow-400 transition-colors shadow-flat focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Cotizar Proyecto</span>
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </nav>

        {/* Drawer Footer */}
        <div className="p-16 border-t border-brand-green/20 bg-brand-dark/95 space-y-12">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Experiencia Comprobada</span>
            <span className="text-brand-gold font-bold">20+ Años</span>
          </div>
          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <Link
              href="/cliente"
              onClick={onClose}
              className="text-[12px] text-brand-light/80 hover:text-brand-gold transition-colors inline-flex items-center gap-4"
            >
              <span>Portal de Clientes &rarr;</span>
            </Link>
            <span className="text-[10px] text-gray-500">Bucaramanga, COL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
