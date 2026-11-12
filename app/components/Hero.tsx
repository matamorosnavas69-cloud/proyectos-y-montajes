import LandingHeroCarousel from "@/app/components/LandingHeroCarousel";
import { getPublishedHeroSlides } from "@/lib/hero-management";
import { SERVICE_PATH_MAP, type ServiceKey } from "@/lib/hero-constants";
import { BANNERS } from "@/lib/hero-banners";
import { Award, BadgeCheck, MapPin } from "lucide-react";

export default async function Hero() {
  const slidesByService = await Promise.all(BANNERS.map((banner) => getPublishedHeroSlides(banner.key as ServiceKey)));

  return (
    <section className="bg-brand-dark text-white">
      {BANNERS.map((banner, index) => <LandingHeroCarousel key={banner.id} id={banner.id} number={String(index + 1).padStart(2, "0")} align={index % 2 === 0 ? "left" : "right"} eyebrow={banner.eyebrow} title={banner.title} highlight={banner.highlight} benefit={banner.benefit} items={banner.items} warranty={banner.warranty} href={SERVICE_PATH_MAP[banner.key as ServiceKey]} cta={banner.cta} stats={banner.stats} slides={slidesByService[index]} />)}
      <div className="border-t border-white/10 bg-brand-dark px-6 py-6 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8 text-xs leading-snug">
            <span className="flex items-center gap-2"><BadgeCheck className="h-6 w-6 text-brand-gold" /><span className="font-semibold">Garantía<br /><span className="font-normal text-white/70">en cada proyecto</span></span></span>
            <span className="flex items-center gap-2"><Award className="h-6 w-6 text-brand-gold" /><span className="font-semibold">Materiales<br /><span className="font-normal text-white/70">certificados</span></span></span>
            <span className="flex items-center gap-2"><MapPin className="h-6 w-6 text-brand-gold" /><span className="font-semibold">Cobertura<br /><span className="font-normal text-white/70">nacional</span></span></span>
          </div>
          <a href="#simulador" className="inline-flex min-h-11 items-center rounded-full bg-brand-gold px-6 text-sm font-bold text-brand-dark transition hover:bg-white">Cotizar mi proyecto</a>
        </div>
      </div>
    </section>
  );
}
