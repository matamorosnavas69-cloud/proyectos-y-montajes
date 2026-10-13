'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, HardHat, FileText, ArrowRight, Sparkles } from 'lucide-react';

export default function ClientPortalLandingPage() {
  const router = useRouter();
  const [projectCode, setProjectCode] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectCode.trim()) return;
    router.push(`/cliente/${encodeURIComponent(projectCode.trim().toLowerCase())}`);
  }

  return (
    <div className="min-h-screen bg-[#0d1610] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="p-6 md:px-12 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-green border border-brand-gold/40 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">
            P&M
          </div>
          <div>
            <span className="font-black text-white text-sm tracking-wider uppercase block">Proyectos & Montajes</span>
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">Portal del Cliente</span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-white font-semibold transition-colors flex items-center gap-1"
        >
          <span>Ir al Sitio Web</span> &rarr;
        </Link>
      </header>

      {/* Hero Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10 my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Seguimiento Oficial de Obra en Tiempo Real
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
          Supervise el Avance de su <br />
          <span className="text-brand-gold">Proyecto de Infraestructura</span>
        </h1>

        <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Ingrese el código de su obra o el identificador asignado por su director de proyecto para consultar el porcentaje de ejecución física, cronograma de hitos, registro fotográfico por fases y documentación oficial.
        </p>

        {/* Tracking Search Card */}
        <div className="bg-[#131d16] border border-brand-green/40 p-6 md:p-8 rounded-3xl shadow-2xl max-w-xl mx-auto backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                placeholder="Código de obra o slug (ej. padel-country-club)"
                className="w-full pl-12 pr-4 py-3.5 bg-brand-dark/70 border border-white/15 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-gold/15 flex items-center justify-center gap-2"
            >
              <span>Consultar Mi Proyecto</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-gray-500 mt-4">
            ¿No tiene su código a mano? Solicítelo a su asesor comercial o revise el correo de bienvenida.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-14 text-left">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
            <HardHat className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Avance Físico Certificado</h4>
              <p className="text-[11px] text-gray-400">Porcentaje de obra y cronograma de hitos actualizado por el director técnico.</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
            <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Bóveda Documental</h4>
              <p className="text-[11px] text-gray-400">Descargue en PDF su Ficha Técnica, Propuesta Aprobada y Acta de Entrega.</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white mb-1">Registro Fotográfico</h4>
              <p className="text-[11px] text-gray-400">Evidencia gráfica organizada por etapas: antes, preparación, instalación y final.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-gray-500 border-t border-white/5 relative z-10">
        <div>PROYECTOS & MONTAJES S.A.S. • Bucaramanga, Santander, Colombia • www.proyectosymontajes.com</div>
      </footer>
    </div>
  );
}
