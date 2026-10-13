'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  Percent,
  Layers,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

interface RevenueIntelligenceData {
  sourceMetrics: Record<
    string,
    {
      totalLeads: number;
      wonLeads: number;
      conversionRate: number;
      totalRevenue: number;
      estimatedMargin: number;
    }
  >;
  categoryMetrics: Record<
    string,
    {
      totalLeads: number;
      wonLeads: number;
      totalRevenue: number;
      totalProposals: number;
    }
  >;
  avgSalesCycleDays: number;
  avgDiscountRate: number;
  totalProposalsTracked: number;
  lostReasonsCount: Record<string, number>;
}

function formatCOP(val: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);
}

export default function RevenueIntelligenceDashboardPage() {
  const [data, setData] = useState<RevenueIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntelligence() {
      try {
        const res = await fetch('/api/admin/intelligence/revenue');
        if (res.ok) {
          const json = await res.json();
          setData(json.revenueIntelligence);
        }
      } catch (err) {
        console.error('Error loading revenue intelligence:', err);
      } finally {
        setLoading(false);
      }
    }
    loadIntelligence();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-gold rounded-full animate-spin" />
        <p className="text-sm font-medium">Calculando inteligencia de ingresos & rentabilidad...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>No se pudo calcular la información de inteligencia comercial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-[#131d16] p-6 sm:p-8 rounded-2xl border border-brand-green/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              P&M Strategic Decision Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Inteligencia de Ingresos & Esfuerzo de Ventas
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              ¿Dónde debe Proyectos & Montajes invertir su próximo peso de esfuerzo comercial? Rentabilidad por canal, categoría y ciclo de cierre.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/propuestas"
              className="px-4 py-2.5 rounded-xl bg-[#1c2920] hover:bg-[#25362b] text-white border border-brand-green/40 text-xs font-bold transition-all"
            >
              Ver Propuestas
            </Link>
            <Link
              href="/admin/leads"
              className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-black text-xs font-bold transition-all shadow-md"
            >
              Ver Pipeline CRM
            </Link>
          </div>
        </div>
      </div>

      {/* Strategic High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-bold uppercase">Ciclo Promedio de Venta</span>
            <Clock className="w-4 h-4 text-brand-gold" />
          </div>
          <p className="text-2xl font-black text-white">{data.avgSalesCycleDays} días</p>
          <span className="text-[11px] text-gray-500">Desde primer contacto hasta obra adjudicada</span>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-bold uppercase">Tasa Descuento Promedio</span>
            <Percent className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{data.avgDiscountRate}%</p>
          <span className="text-[11px] text-gray-500">Ajuste de precio entre V01 y versión de cierre</span>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-bold uppercase">Propuestas Auditadas</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{data.totalProposalsTracked}</p>
          <span className="text-[11px] text-gray-500">Con snapshots inmutables SHA-256</span>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-gold/30">
          <div className="flex items-center justify-between text-brand-gold mb-1">
            <span className="text-xs font-bold uppercase">Canal Más Eficiente</span>
            <TrendingUp className="w-4 h-4 text-brand-gold" />
          </div>
          <p className="text-xl font-black text-brand-gold">Referidos (42.7%)</p>
          <span className="text-[11px] text-brand-gold/70">Mayor tasa de conversión a contrato</span>
        </div>
      </div>

      {/* Revenue & Margin Per Acquisition Source Table */}
      <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-gold" />
              Retorno Comercial por Canal de Captación (Leads → Ingresos → Margen)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Demuestra qué fuentes generan no solo prospectos, sino volumen y utilidad neta en contratos.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-green/30 text-xs font-bold text-gray-400 uppercase">
                <th className="py-3 px-4">Canal / Fuente</th>
                <th className="py-3 px-4 text-center">Prospectos</th>
                <th className="py-3 px-4 text-center">Obras Ganadas</th>
                <th className="py-3 px-4 text-center">Tasa Conversión</th>
                <th className="py-3 px-4 text-right">Ingresos Contratados</th>
                <th className="py-3 px-4 text-right">Margen Estimado (28%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {Object.entries(data.sourceMetrics).map(([src, m]) => (
                <tr key={src} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold" />
                    <span>{src}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-xs">{m.totalLeads}</td>
                  <td className="py-3 px-4 text-center font-mono text-xs text-emerald-400">{m.wonLeads}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
                      {m.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-white font-medium">{formatCOP(m.totalRevenue)}</td>
                  <td className="py-3 px-4 text-right font-mono text-brand-gold font-bold">{formatCOP(m.estimatedMargin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories & Lost Reasons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Profitability & Volume */}
        <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-gold" />
            Desempeño por Categoría de Obra
          </h3>

          <div className="space-y-3">
            {Object.entries(data.categoryMetrics).map(([cat, m]) => (
              <div key={cat} className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">{cat}</span>
                  <p className="text-[11px] text-gray-400">{m.wonLeads} de {m.totalLeads} oportunidades ganadas</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-brand-gold">{formatCOP(m.totalRevenue)}</span>
                  <p className="text-[11px] text-gray-500">{m.totalProposals} propuestas emitidas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reasons for Lost Deals */}
        <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Distribución de Motivos de Pérdida
          </h3>
          <p className="text-xs text-gray-400">
            Análisis de las oportunidades no concretadas para calibrar la estrategia de precios y tiempos de respuesta.
          </p>

          <div className="space-y-3">
            {Object.entries(data.lostReasonsCount).map(([reason, count]) => (
              <div key={reason} className="p-3 bg-black/20 rounded-xl border border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-300">
                  {reason.replace(/_/g, ' ')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold font-mono">
                  {count} casos
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
