'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  DollarSign,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Calculator,
  Percent,
} from 'lucide-react';
import type { EstimatorCategoryParams } from '@/lib/estimator/calculations';

interface ProposalItem {
  id: string;
  code: string;
  version: string;
  title: string;
  category: string;
  clientName: string;
  clientCompany?: string | null;
  city?: string | null;
  status: string;
  totalPrice: number;
  expectedMargin?: number | null;
  estimatedDays?: number | null;
  createdAt: string;
  lead?: { id: string; name: string } | null;
  project?: { id: string; title: string; slug: string } | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  DRAFT: { label: 'Borrador', bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' },
  INTERNAL_REVIEW: { label: 'Revisión Interna', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  SENT: { label: 'Enviada al Cliente', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  VIEWED: { label: 'Vista por Cliente', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  NEGOTIATION: { label: 'En Negociación', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  ACCEPTED: { label: 'Aceptada (Ganada)', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  REJECTED: { label: 'Rechazada', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  EXPIRED: { label: 'Vencida', bg: 'bg-gray-700/10', text: 'text-gray-500', border: 'border-gray-700/30' },
};

export default function ProposalsAdminPage() {
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Generator modal state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Estimator Form State
  const [genForm, setGenForm] = useState({
    title: '',
    category: 'Pistas de Pádel' as 'Pistas de Pádel' | 'Canchas Sintéticas' | 'Parques Infantiles' | 'Grama Sintética & Paisajismo' | 'Jardines & Terrazas',
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    city: 'Bucaramanga',
    location: '',
    // Category specific
    padelCourtsCount: 1,
    padelCourtType: 'PANORAMICA' as 'PANORAMICA' | 'ESTANDAR' | 'CUBIERTA',
    padelGlass: '12mm' as '10mm' | '12mm',
    padelTurf: 'MONDO_TEXTURIZADO' as 'MONDO_TEXTURIZADO' | 'MONOFILAMENTO_12MM',
    padelSlab: 'LOSA_H25' as 'LOSA_H25' | 'EXISTENTE',
    soccerFormat: 'FUTBOL_5' as 'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_8' | 'FUTBOL_11',
    playgroundArea: 150,
    landscapingArea: 100,
    terraceArea: 60,
    marginPercentage: 28,
  });

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/admin/proposals?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  async function handleCreateProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!genForm.title.trim() || !genForm.clientName.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: genForm.title,
        category: genForm.category,
        clientName: genForm.clientName,
        clientCompany: genForm.clientCompany,
        clientEmail: genForm.clientEmail,
        clientPhone: genForm.clientPhone,
        city: genForm.city,
        location: genForm.location,
        estimatorParams: {
          category: genForm.category,
          padelCourtsCount: Number(genForm.padelCourtsCount),
          padelCourtType: genForm.padelCourtType,
          padelGlass: genForm.padelGlass,
          padelTurf: genForm.padelTurf,
          padelSlab: genForm.padelSlab,
          soccerFormat: genForm.soccerFormat,
          playgroundArea: Number(genForm.playgroundArea),
          landscapingArea: Number(genForm.landscapingArea),
          terraceArea: Number(genForm.terraceArea),
          marginPercentage: Number(genForm.marginPercentage),
        },
      };

      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setIsGeneratorOpen(false);
        fetchProposals();
        window.location.href = `/admin/propuestas/${data.proposal.id}`;
      } else {
        const err = await res.json();
        alert(err.message || 'Error al generar la propuesta.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setSubmitting(false);
    }
  }

  // Financial aggregates
  const totalPipeline = proposals
    .filter((p) => !['REJECTED', 'EXPIRED'].includes(p.status))
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const totalAccepted = proposals
    .filter((p) => p.status === 'ACCEPTED')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const acceptedCount = proposals.filter((p) => p.status === 'ACCEPTED').length;
  const closedCount = proposals.filter((p) => ['ACCEPTED', 'REJECTED'].includes(p.status)).length;
  const winRate = closedCount > 0 ? Math.round((acceptedCount / closedCount) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Motor de Cotizaciones & Propuestas Comerciales
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Gestor de Propuestas Oficiales (P&M-2026)
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Genere cotizaciones paramétricas con separación de costos internos y emita propuestas comerciales con versiones inmutables (V01, V02).
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generar Propuesta con Estimador</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Propuestas Activas</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{proposals.length}</div>
          <p className="text-[11px] text-gray-500 mt-1">Documentos emitidos</p>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pipeline Cotizado</span>
            <DollarSign className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-black text-brand-gold">${Math.round(totalPipeline / 1000000)}M COP</div>
          <p className="text-[11px] text-gray-500 mt-1">Valor en negociación</p>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Propuestas Ganadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">${Math.round(totalAccepted / 1000000)}M COP</div>
          <p className="text-[11px] text-gray-500 mt-1">{acceptedCount} obras cerradas</p>
        </div>

        <div className="bg-[#131d16] p-5 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Win Rate de Propuestas</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{winRate}%</div>
          <p className="text-[11px] text-gray-500 mt-1">Efectividad de cotización</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#131d16] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por código PM-, cliente, título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-gray-300 px-3 py-2 focus:outline-none focus:border-brand-gold"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="DRAFT">Borrador</option>
              <option value="SENT">Enviadas</option>
              <option value="NEGOTIATION">En Negociación</option>
              <option value="ACCEPTED">Aceptadas</option>
              <option value="REJECTED">Rechazadas</option>
            </select>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-gray-300 px-3 py-2 focus:outline-none focus:border-brand-gold"
          >
            <option value="ALL">Todas las Categorías</option>
            <option value="Pistas de Pádel">Pistas de Pádel</option>
            <option value="Canchas Sintéticas">Canchas Sintéticas</option>
            <option value="Parques Infantiles">Parques Infantiles</option>
            <option value="Grama Sintética & Paisajismo">Grama Sintética & Paisajismo</option>
            <option value="Jardines & Terrazas">Jardines & Terrazas</option>
          </select>
        </div>
      </div>

      {/* Proposals List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Cargando propuestas comerciales...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-[#131d16] border border-white/5 rounded-2xl p-12 text-center">
          <FileSpreadsheet className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No hay propuestas registradas</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">
            Utilice el estimador inteligente para calcular costos de materiales y generar la primera propuesta comercial oficial.
          </p>
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-xl font-bold text-xs"
          >
            <Plus className="w-4 h-4" /> Generar Primera Propuesta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((p) => {
            const st = STATUS_CONFIG[p.status] || STATUS_CONFIG.DRAFT;

            return (
              <Link
                key={p.id}
                href={`/admin/propuestas/${p.id}`}
                className="bg-[#131d16] border border-white/10 hover:border-brand-gold/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-black text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">
                      {p.code} • {p.version}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                      {st.label}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                    {p.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                    <Building className="w-3.5 h-3.5 text-gray-500" />
                    <span>{p.clientCompany || p.clientName}</span>
                    {p.city && <span>• {p.city}</span>}
                  </div>

                  <div className="mt-4 p-3 bg-brand-dark/50 rounded-xl border border-white/5 space-y-1 text-xs">
                    <div className="text-brand-green font-bold text-[11px] uppercase tracking-wider">
                      {p.category}
                    </div>
                    <div className="text-base font-black text-white">
                      ${Number(p.totalPrice).toLocaleString()} <span className="text-[10px] text-gray-400">COP</span>
                    </div>
                    {p.estimatedDays && (
                      <div className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>Plazo: ~{p.estimatedDays} días hábiles</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>{new Date(p.createdAt).toLocaleDateString('es-CO')}</span>
                  <span className="text-brand-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Ver Propuesta &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131d16] border border-brand-green/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-brand-gold" />
                  Generador Paramétrico de Propuestas
                </h3>
                <p className="text-xs text-gray-400">Configure los requerimientos de la obra para calcular costos y generar la cotización oficial.</p>
              </div>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Título de la Propuesta *</label>
                  <input
                    type="text"
                    required
                    value={genForm.title}
                    onChange={(e) => setGenForm({ ...genForm, title: e.target.value })}
                    placeholder="Ej. Construcción 2 Canchas de Pádel Panorámicas"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Categoría de Infraestructura *</label>
                  <select
                    value={genForm.category}
                    onChange={(e) => setGenForm({ ...genForm, category: e.target.value as 'Pistas de Pádel' | 'Canchas Sintéticas' | 'Parques Infantiles' | 'Grama Sintética & Paisajismo' | 'Jardines & Terrazas' })}
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Pistas de Pádel">Pistas de Pádel</option>
                    <option value="Canchas Sintéticas">Canchas Sintéticas</option>
                    <option value="Parques Infantiles">Parques Infantiles</option>
                    <option value="Grama Sintética & Paisajismo">Grama Sintética & Paisajismo</option>
                    <option value="Jardines & Terrazas">Jardines & Terrazas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Cliente / Contacto *</label>
                  <input
                    type="text"
                    required
                    value={genForm.clientName}
                    onChange={(e) => setGenForm({ ...genForm, clientName: e.target.value })}
                    placeholder="Ej. Dr. Mauricio Gómez"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Empresa / Club / Conjunto</label>
                  <input
                    type="text"
                    value={genForm.clientCompany}
                    onChange={(e) => setGenForm({ ...genForm, clientCompany: e.target.value })}
                    placeholder="Ej. Club Deportivo San Mateo"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={genForm.city}
                    onChange={(e) => setGenForm({ ...genForm, city: e.target.value })}
                    placeholder="Bucaramanga, Floridablanca..."
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Margen Comercial Objetivo (%)</label>
                  <input
                    type="number"
                    value={genForm.marginPercentage}
                    onChange={(e) => setGenForm({ ...genForm, marginPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Dynamic Parametric Controls by Category */}
              <div className="p-4 bg-brand-dark/60 rounded-xl border border-white/10 space-y-4">
                <div className="text-xs font-black uppercase text-brand-gold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parámetros de Ingeniería: {genForm.category}</span>
                </div>

                {genForm.category === 'Pistas de Pádel' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Número de Pistas</label>
                      <input
                        type="number"
                        min={1}
                        value={genForm.padelCourtsCount}
                        onChange={(e) => setGenForm({ ...genForm, padelCourtsCount: Number(e.target.value) })}
                        className="w-full p-2 bg-[#131d16] border border-white/10 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Modelo de Pista</label>
                      <select
                        value={genForm.padelCourtType}
                        onChange={(e) => setGenForm({ ...genForm, padelCourtType: e.target.value as 'PANORAMICA' | 'ESTANDAR' | 'CUBIERTA' })}
                        className="w-full p-2 bg-[#131d16] border border-white/10 rounded-lg text-white"
                      >
                        <option value="PANORAMICA">Panorámica</option>
                        <option value="ESTANDAR">Estándar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Cristal Templado</label>
                      <select
                        value={genForm.padelGlass}
                        onChange={(e) => setGenForm({ ...genForm, padelGlass: e.target.value as '10mm' | '12mm' })}
                        className="w-full p-2 bg-[#131d16] border border-white/10 rounded-lg text-white"
                      >
                        <option value="12mm">12 mm (Competición)</option>
                        <option value="10mm">10 mm (Estándar)</option>
                      </select>
                    </div>
                  </div>
                )}

                {genForm.category === 'Canchas Sintéticas' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Formato de Cancha</label>
                      <select
                        value={genForm.soccerFormat}
                        onChange={(e) => setGenForm({ ...genForm, soccerFormat: e.target.value as 'FUTBOL_5' | 'FUTBOL_7' | 'FUTBOL_8' | 'FUTBOL_11' })}
                        className="w-full p-2 bg-[#131d16] border border-white/10 rounded-lg text-white"
                      >
                        <option value="FUTBOL_5">Fútbol 5 (~800 m²)</option>
                        <option value="FUTBOL_7">Fútbol 7 (~1.800 m²)</option>
                        <option value="FUTBOL_8">Fútbol 8 (~2.400 m²)</option>
                        <option value="FUTBOL_11">Fútbol 11 (~6.000 m²)</option>
                      </select>
                    </div>
                  </div>
                )}

                {genForm.category === 'Parques Infantiles' && (
                  <div className="text-xs">
                    <label className="block text-[11px] text-gray-400 mb-1">Área Recreativa Total (m²)</label>
                    <input
                      type="number"
                      value={genForm.playgroundArea}
                      onChange={(e) => setGenForm({ ...genForm, playgroundArea: Number(e.target.value) })}
                      className="w-full p-2 bg-[#131d16] border border-white/10 rounded-lg text-white max-w-xs"
                    />
                  </div>
                )}

                {genForm.category === 'Grama Sintética & Paisajismo' && (
                  <div className="text-xs">
                    <label className="block text-[11px] text-gray-400 mb-1">Área Paisajística Total (m²)</label>
                    <input
                      type="number"
                      value={genForm.landscapingArea}
                      onChange={(e) => setGenForm({ ...genForm, landscapingArea: Number(e.target.value) })}
                      className="w-full p-2 bg-[#131d16] border border-white/10 rounded-lg text-white max-w-xs"
                    />
                  </div>
                )}

                {genForm.category === 'Jardines & Terrazas' && (
                  <div className="text-xs">
                    <label className="block text-[11px] text-gray-400 mb-1">Área de Terraza / Jardín (m²)</label>
                    <input
                      type="number"
                      value={genForm.terraceArea}
                      onChange={(e) => setGenForm({ ...genForm, terraceArea: Number(e.target.value) })}
                      className="w-full p-2 bg-[#131d16] border border-white/10 rounded-lg text-white max-w-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsGeneratorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {submitting ? 'Calculando...' : 'Generar Propuesta Oficial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
