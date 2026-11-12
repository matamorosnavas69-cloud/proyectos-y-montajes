"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Baby, CloudSun, DropletOff, Feather, Clock, Goal, Layers, ShieldCheck, Sparkles, Sprout, Target } from "lucide-react";
import type { HeroSlide } from "@/app/components/ServiceHeroSlider";

const ICONS = { goal: Goal, drop: DropletOff, target: Target, weather: CloudSun, baby: Baby, sparkles: Sparkles, sprout: Sprout, layers: Layers, feather: Feather, clock: Clock } as const;

type LandingHeroCarouselProps = {
  id: string;
  number: string;
  align: "left" | "right";
  eyebrow: string;
  title: string;
  highlight: string;
  benefit: string;
  items: readonly (readonly [keyof typeof ICONS, string, string])[];
  warranty: string;
  href: string;
  cta: string;
  stats: readonly (readonly [string, string])[];
  slides: HeroSlide[];
};

function animatedValue(value: string, progress: number) {
  const match = value.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return value;
  const target = Number(match[1].replace(",", "."));
  const current = target * progress;
  const display = Number.isInteger(target) ? Math.round(current).toString() : current.toFixed(1);
  return `${display}${match[2]}`;
}

export default function LandingHeroCarousel({ id, number, align, eyebrow, title, highlight, benefit, items, warranty, href, cta, stats, slides }: LandingHeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counterProgress, setCounterProgress] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeSlide = slides[current] || slides[0];
  const right = align === "right";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.28 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 1300);
      setCounterProgress(progress);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [isVisible]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!activeSlide) return null;

  const allItems = [...items.map(([icon, t, s]) => ({ Icon: ICONS[icon], t, s, gold: true })), { Icon: ShieldCheck, t: "Garantía", s: warranty, gold: false }];

  return (
    <article ref={sectionRef} id={id} className="relative isolate min-h-screen scroll-mt-28 overflow-hidden border-b border-white/10 bg-brand-dark text-white">
      <div className="absolute inset-0">
        {slides.map((slide, index) => <Image key={`${slide.src}-${index}`} src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw" style={{ objectPosition: slide.focalPoint || "50% 50%" }} className={`object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`} />)}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col justify-between px-6 pb-7 pt-24 sm:px-8 lg:px-16 lg:pb-9">
        <div className={`flex items-center gap-4 ${right ? "justify-start" : "justify-end"}`}>
          {slides.length > 1 && <span className="font-mono text-xs font-bold text-white/80"><span className="text-brand-gold">{String(current + 1).padStart(2, "0")}</span> / {String(slides.length).padStart(2, "0")}</span>}
        </div>

        <div className={`flex flex-1 items-center py-10 ${right ? "justify-end" : ""}`}>
          <div className={`max-w-xl rounded-2xl border border-white/25 bg-brand-dark/30 p-5 shadow-2xl backdrop-blur-[3px] transition-all duration-1000 sm:p-7 lg:p-8 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">{eyebrow}</p>
            <h2 className="mt-3 text-4xl font-medium leading-[1.06] tracking-[-0.02em] sm:text-5xl">{title}<br /><span className="text-brand-gold">{highlight}</span></h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">{benefit}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">{allItems.map(({ Icon, t, s, gold }) => <div key={t} className="flex items-start gap-2 text-xs leading-snug"><Icon className={`h-5 w-5 shrink-0 ${gold ? "text-brand-gold" : "text-white"}`} /><span className="font-semibold">{t}<br /><span className="font-normal text-white/70">{s}</span></span></div>)}</div>
            <div className="mt-6"><Link href={href} className="text-sm font-semibold text-white underline underline-offset-4 hover:text-brand-gold">{cta}</Link></div>
          </div>
        </div>

        <div>
          <div className={`grid grid-cols-2 gap-y-3 border-t border-white/35 pt-3 transition-all delay-300 duration-1000 sm:grid-cols-4 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>{stats.map(([value, label]) => <div key={label}><p className="text-lg font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,.6)] sm:text-xl">{animatedValue(value, counterProgress)}</p><p className="mt-0.5 text-[11px] uppercase tracking-[0.06em] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,.6)]">{label}</p></div>)}</div>
          {slides.length > 1 && <div className="mt-3 flex gap-1.5" aria-label="Imágenes">{slides.map((slide, index) => <button key={`${slide.src}-dot`} type="button" onClick={() => setCurrent(index)} aria-label={`Ver imagen ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === current ? "w-7 bg-brand-gold" : "w-1.5 bg-white/70"}`} />)}</div>}
        </div>
      </div>
    </article>
  );
}
