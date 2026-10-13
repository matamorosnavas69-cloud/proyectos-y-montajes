import Hero from "@/app/components/Hero";
import SocialProof from "@/app/components/SocialProof";
import Services from "@/app/components/Services";
import FeaturedProjects from "@/app/components/FeaturedProjects";
import AuthorityShowcase from "@/app/components/AuthorityShowcase";
import BeforeAfter from "@/app/components/BeforeAfter";
import ManagedProjectGallery from "@/app/components/ManagedProjectGallery";
import QuoteSimulator from "@/app/components/QuoteSimulator";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <SocialProof />
      <Services />
      <FeaturedProjects />
      <AuthorityShowcase />
      <BeforeAfter />
      <ManagedProjectGallery />
      
      <section id="simulador" className="py-24 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-black text-brand-dark mb-4">Calcula tu Inversión en Segundos</h2>
          <p className="text-gray-600 text-lg">Descubre cuánto costaría transformar tu espacio con nuestra calculadora inteligente.</p>
        </div>
        <QuoteSimulator />
      </section>
    </div>
  );
}
