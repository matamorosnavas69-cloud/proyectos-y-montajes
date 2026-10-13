'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import LeadKanbanBoard, { type KanbanStage } from '@/app/components/admin/LeadKanbanBoard';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  Building,
  DollarSign,
  Sparkles,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FileSpreadsheet,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface LeadActivity {
  id: string;
  type: string;
  description: string;
  author?: string | null;
  createdAt: string;
}

interface ConvertedProject {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface LeadProposal {
  id: string;
  code: string;
  version: string;
  totalPrice: number;
  status: string;
}

interface LeadItem {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  projectType: string;
  location?: string | null;
  city?: string | null;
  estimatedBudget?: number | null;
  quotedAmount?: number | null;
  desiredStart?: string | null;
  source: string;
  status: string;
  priority: string;
  assignedTo?: string | null;
  notes?: string | null;
  estimatedValue?: number | null;
  closeProbability: number;
  estimatedCloseDate?: string | null;
  nextAction?: string | null;
  nextActionDate?: string | null;
  competitor?: string | null;
  lostReason?: string | null;
  estimatedMargin?: number | null;
  createdAt: string;
  activities?: LeadActivity[];
  projects?: ConvertedProject[];
  proposals?: LeadProposal[];
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; stageNumber: number }> = {
  NUEVO: { label: 'Nuevo', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', stageNumber: 1 },
  CONTACTADO: { label: 'Contactado', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', stageNumber: 2 },
  CALIFICADO: { label: 'Calificado', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', stageNumber: 3 },
  VISITA_DIAGNOSTICO: { label: 'Visita / Diagnóstico', bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30', stageNumber: 4 },
  OPORTUNIDAD: { label: 'Oportunidad', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', stageNumber: 5 },
  PROPUESTA_EN_PREPARACION: { label: 'Propuesta en Preparación', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', stageNumber: 6 },
  PROPUESTA_ENVIADA: { label: 'Propuesta Enviada', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', stageNumber: 7 },
  NEGOCIACION: { label: 'En Negociación', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', stageNumber: 8 },
  GANADO: { label: 'Ganado (Obra)', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', stageNumber: 9 },
  PERDIDO: { label: 'Perdido', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', stageNumber: 0 },
};

const KANBAN_STAGES: KanbanStage[] = Object.entries(STATUS_CONFIG)
  .sort(([leftKey, left], [rightKey, right]) => {
    if (leftKey === 'PERDIDO') return 1;
    if (rightKey === 'PERDIDO') return -1;
    return left.stageNumber - right.stageNumber;
  })
  .map(([key, config]) => ({ key, ...config }));

const SOURCE_CONFIG: Record<string, { label: string; icon: string }> = {
  WEBSITE: { label: 'Portal Web', icon: '🌐' },
  WHATSAPP: { label: 'WhatsApp', icon: '💬' },
  INSTAGRAM: { label: 'Instagram', icon: '📸' },
  REFERRAL: { label: 'Referido', icon: '🤝' },
  GOOGLE: { label: 'Google Search', icon: '🔍' },
  DIRECTO: { label: 'Comercial Directo', icon: '🏢' },
  OTRO: { label: 'Otro', icon: '📌' },
};

function formatCOP(val: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);
}

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'KANBAN' | 'CARDS'>('KANBAN');
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  // Creation modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'Pistas de Pádel',
    city: 'Bucaramanga',
    estimatedValue: '',
    closeProbability: 50,
    source: 'DIRECTO',
    priority: 'MEDIA',
    nextAction: '',
    notes: '',
  });

  // Selected lead for detail/activity modal
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNote, setNewNote] = useState('');
  const [converting, setConverting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (sourceFilter !== 'ALL') params.append('source', sourceFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, sourceFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchLeads();
  }

  async function handleCreateLead(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedValue: formData.estimatedValue ? Number(formData.estimatedValue) : undefined,
          closeProbability: Number(formData.closeProbability) || 50,
        }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          projectType: 'Pistas de Pádel',
          city: 'Bucaramanga',
          estimatedValue: '',
          closeProbability: 50,
          source: 'DIRECTO',
          priority: 'MEDIA',
          nextAction: '',
          notes: '',
        });
        fetchLeads();
      } else {
        const err = await res.json();
        alert(err.message || 'Error al guardar el prospecto.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(leadId: string, newStatus: string) {
    const originalLead = leads.find((lead) => lead.id === leadId);
    if (!originalLead || originalLead.status === newStatus) return;

    setMovingLeadId(leadId);
    setPipelineError(null);
    setLeads((current) => current.map((lead) => lead.id === leadId ? { ...lead, status: newStatus } : lead));
    if (selectedLead?.id === leadId) setSelectedLead({ ...selectedLead, status: newStatus });

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.lead) throw new Error(data.message || 'No fue posible actualizar la etapa.');

      setLeads((current) => current.map((lead) => lead.id === leadId ? data.lead : lead));
      if (selectedLead?.id === leadId) setSelectedLead(data.lead);
    } catch (error) {
      console.error(error);
      setLeads((current) => current.map((lead) => lead.id === leadId ? originalLead : lead));
      if (selectedLead?.id === leadId) setSelectedLead(originalLead);
      setPipelineError('No pudimos mover esta oportunidad. La etapa anterior fue restaurada.');
    } finally {
      setMovingLeadId(null);
    }
  }

  async function handleAddActivityNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newActivityNote: newNote }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedLead(data.lead);
        setNewNote('');
        setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? data.lead : l)));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleConvertToProject(lead: LeadItem) {
    if (
      !confirm(
        `¿Desea convertir al prospecto "${lead.name}" en un Proyecto oficial de Proyectos & Montajes? Se inicializará su ficha técnica automáticamente.`
      )
    ) {
      return;
    }

    setConverting(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/convert`, {
        method: 'POST',
      });

      const data = await res.json();
      if (res.ok) {
        alert(`¡Proyecto creado con éxito! "${data.project.title}". Redirigiendo a la ficha técnica...`);
        window.location.href = `/admin/proyectos/${data.project.id}/ficha-tecnica`;
      } else {
        alert(data.message || 'Error al convertir prospecto.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión durante la conversión.');
    } finally {
      setConverting(false);
    }
  }

  // Revenue Intelligence Metrics (P&M OS v2 Pipeline Engine)
  const totalLeads = leads.length;
  const activeOpportunities = leads.filter((l) => l.status !== 'PERDIDO');
  
  // Pipeline Total ($)
  const totalPipeline = activeOpportunities.reduce(
    (acc, l) => acc + (l.estimatedValue || l.estimatedBudget || l.quotedAmount || 0),
    0
  );

  // Weighted Pipeline ($) = sum(value * probability / 100)
  const weightedPipeline = activeOpportunities.reduce((acc, l) => {
    const val = l.estimatedValue || l.estimatedBudget || l.quotedAmount || 0;
    const prob = l.closeProbability !== undefined ? l.closeProbability : 50;
    return acc + (val * (prob / 100));
  }, 0);

  // Won Leads
  const wonLeads = leads.filter((l) => l.status === 'GANADO');
  const wonTotalValue = wonLeads.reduce(
    (acc, l) => acc + (l.estimatedValue || l.estimatedBudget || l.quotedAmount || 0),
    0
  );

  const winRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : '0';
  const avgTicket = wonLeads.length > 0 ? wonTotalValue / wonLeads.length : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            P&M OS v2 — Commercial Intelligence & Pipeline
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Gestión Comercial & Pipeline de Ingresos
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Control de 9 etapas comerciales, pronóstico ponderado de ingresos, seguimiento a cotizaciones y conversión a obra.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/propuestas"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#1c2920] hover:bg-[#25362b] text-white border border-brand-green/40 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-gold" />
            <span>Motor de Propuestas</span>
          </Link>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Prospecto</span>
          </button>
        </div>
      </div>

      {/* Revenue Intelligence KPI Cards (P&M OS v2) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pipeline Total */}
        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pipeline Total</span>
            <DollarSign className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-xl font-black text-white truncate">{formatCOP(totalPipeline)}</div>
          <p className="text-[11px] text-gray-500 mt-1">{activeOpportunities.length} oportunidades activas</p>
        </div>

        {/* Pipeline Ponderado */}
        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-gold/30 shadow-md">
          <div className="flex items-center justify-between text-brand-gold mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pipeline Ponderado</span>
            <TrendingUp className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-xl font-black text-brand-gold truncate">{formatCOP(weightedPipeline)}</div>
          <p className="text-[11px] text-brand-gold/70 mt-1">Ajustado por probabilidad %</p>
        </div>

        {/* Ganado en Contratos */}
        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30 shadow-md">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ganado (Obras)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 truncate">{formatCOP(wonTotalValue)}</div>
          <p className="text-[11px] text-gray-500 mt-1">{wonLeads.length} proyectos cerrados</p>
        </div>

        {/* Win Rate */}
        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30 shadow-md">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Win Rate</span>
            <Percent className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">{winRate}%</div>
          <p className="text-[11px] text-gray-500 mt-1">Conversión histórica</p>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30 shadow-md col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ticket Promedio</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white truncate">{formatCOP(avgTicket)}</div>
          <p className="text-[11px] text-gray-500 mt-1">Por obra ganada</p>
        </div>
      </div>

      {/* 9-Stage Commercial Flow Visual Ribbon */}
      <div className="bg-[#131d16] p-4 rounded-2xl border border-brand-green/30 shadow-md overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max text-[11px] font-semibold text-gray-400">
          <span className="text-xs font-bold text-white uppercase pr-2">Ciclo Comercial:</span>
          {Object.entries(STATUS_CONFIG)
            .filter(([k]) => k !== 'PERDIDO')
            .sort((a, b) => a[1].stageNumber - b[1].stageNumber)
            .map(([key, cfg], idx, arr) => (
              <div key={key} className="flex items-center gap-2">
                <button
                  onClick={() => setStatusFilter(statusFilter === key ? 'ALL' : key)}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    statusFilter === key
                      ? `${cfg.bg} ${cfg.text} ${cfg.border} font-bold`
                      : 'bg-black/20 text-gray-400 border-white/5 hover:text-white'
                  }`}
                >
                  <span className="opacity-60 mr-1.5">{cfg.stageNumber}.</span>
                  <span>{cfg.label}</span>
                </button>
                {idx < arr.length - 1 && <span className="text-gray-600 font-mono">→</span>}
              </div>
            ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#131d16] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por contacto, empresa, ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-gray-300 px-3 py-2 focus:outline-none focus:border-brand-gold"
            >
              <option value="ALL">Todas las Etapas Comerciales</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.stageNumber > 0 ? `${v.stageNumber}. ` : ''}{v.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-gray-300 px-3 py-2 focus:outline-none focus:border-brand-gold"
          >
            <option value="ALL">Todos los Orígenes</option>
            <option value="WEBSITE">Portal Web</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="REFERRAL">Referidos</option>
            <option value="GOOGLE">Google</option>
            <option value="DIRECTO">Comercial Directo</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#101811] p-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-white">Vista del pipeline</p>
          <p className="mt-1 text-xs text-gray-500">Kanban para gestionar movimiento; tarjetas para una lectura compacta.</p>
        </div>
        <div className="inline-flex rounded-xl border border-white/10 bg-brand-dark/70 p-1">
          <button type="button" onClick={() => setViewMode('KANBAN')} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${viewMode === 'KANBAN' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}>Kanban</button>
          <button type="button" onClick={() => setViewMode('CARDS')} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${viewMode === 'CARDS' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}>Tarjetas</button>
        </div>
      </div>

      {pipelineError && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{pipelineError}</div>}

      {/* Leads List / Table */}

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Cargando pipeline comercial...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-[#131d16] border border-white/5 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No se encontraron prospectos</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">
            No hay clientes potenciales con los filtros seleccionados o aún no ha creado el primero.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-xl font-bold text-xs"
          >
            <Plus className="w-4 h-4" /> Crear Prospecto
          </button>
        </div>
      ) : viewMode === 'KANBAN' ? (
        <LeadKanbanBoard
          leads={leads}
          stages={KANBAN_STAGES}
          movingLeadId={movingLeadId}
          onMoveLead={handleStatusChange}
          onOpenLead={(leadId) => { const lead = leads.find((item) => item.id === leadId); if (lead) setSelectedLead(lead); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map((lead) => {
            const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NUEVO;
            const sourceInfo = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG.DIRECTO;
            const hasProject = lead.projects && lead.projects.length > 0;
            const leadVal = lead.estimatedValue || lead.estimatedBudget || lead.quotedAmount || 0;

            return (
              <div
                key={lead.id}
                className="bg-[#131d16] border border-white/10 hover:border-brand-gold/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      {statusStyle.stageNumber > 0 ? `${statusStyle.stageNumber}. ` : ''}
                      {statusStyle.label}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <span>{sourceInfo.icon}</span>
                      <span className="text-[11px]">{sourceInfo.label}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-brand-gold transition-colors">
                    {lead.name}
                  </h3>
                  {lead.company && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-gray-500" />
                      <span>{lead.company}</span>
                    </div>
                  )}

                  {/* Financial & Project Specifics Box */}
                  <div className="mt-3 p-3 bg-brand-dark/50 rounded-xl border border-white/5 space-y-1.5 text-xs">
                    <div className="text-brand-green font-bold text-xs uppercase tracking-wider">
                      {lead.projectType}
                    </div>

                    {(lead.city || lead.location) && (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span>{lead.city || lead.location}</span>
                      </div>
                    )}

                    {leadVal > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-gray-400">Valor Estimado:</span>
                        <span className="font-mono font-bold text-brand-gold">{formatCOP(leadVal)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>Prob. Cierre:</span>
                      <span className="font-bold text-white">{lead.closeProbability ?? 50}%</span>
                    </div>

                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-gray-400 pt-1">
                        <Phone className="w-3.5 h-3.5 text-gray-500" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="text-xs text-gray-300 hover:text-white font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{lead.activities?.length || 0} Notas</span>
                    </button>

                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="bg-brand-dark/80 border border-white/10 rounded-lg text-[11px] text-gray-200 px-2 py-1 focus:outline-none"
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions: Proposals, Conversion, Obra */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={`/admin/propuestas?leadId=${lead.id}&clientName=${encodeURIComponent(lead.name)}&projectType=${encodeURIComponent(lead.projectType)}`}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#1c2920] hover:bg-[#25362b] text-white font-semibold text-[11px] border border-brand-green/30 transition-colors"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Cotizar</span>
                    </Link>

                    {hasProject ? (
                      <Link
                        href={`/admin/proyectos/${lead.projects![0].id}/ficha-tecnica`}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 transition-colors"
                      >
                        <span>Ver Obra</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleConvertToProject(lead)}
                        disabled={converting}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold font-bold text-[11px] border border-brand-gold/30 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>A Obra</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#131d16] border border-brand-green/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Nuevo Prospecto Comercial</h3>
                <p className="text-xs text-gray-400">Registre un contacto y defina su potencial de ingresos.</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Nombre Contacto *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Andrés Ramírez"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Empresa / Club</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ej. Club Campestre"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ej. +57 315 1234567"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Tipo de Proyecto *</label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Pistas de Pádel">Pistas de Pádel</option>
                    <option value="Canchas Sintéticas">Canchas Sintéticas</option>
                    <option value="Parques Infantiles">Parques Infantiles</option>
                    <option value="Grama Sintética & Paisajismo">Grama Sintética & Paisajismo</option>
                    <option value="Polideportivos">Polideportivos</option>
                    <option value="Mantenimiento & Adecuación">Mantenimiento & Adecuación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej. Bucaramanga"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Valor Estimado ($ COP)</label>
                  <input
                    type="number"
                    value={formData.estimatedValue}
                    onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                    placeholder="Ej. 180000000"
                    className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Probabilidad Cierre ({formData.closeProbability}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.closeProbability}
                    onChange={(e) => setFormData({ ...formData, closeProbability: Number(e.target.value) })}
                    className="w-full accent-brand-gold cursor-pointer mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Próxima Acción Comercial</label>
                <input
                  type="text"
                  value={formData.nextAction}
                  onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  placeholder="Ej. Enviar propuesta técnica detallada con visita topográfica..."
                  className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Notas Iniciales</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detalles sobre especificaciones deseadas, terreno, plazos..."
                  className="w-full px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Crear Prospecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity / Notes Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#131d16] border border-brand-green/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">{selectedLead.name}</h3>
                <p className="text-xs text-gray-400">{selectedLead.projectType} • {selectedLead.city || 'Sin ciudad'}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddActivityNote} className="space-y-2">
                <label className="block text-xs font-bold text-gray-300">Añadir Nota o Bitácora Comercial</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ej. Llamada realizada, solicita ajuste en iluminación..."
                    className="flex-1 px-3 py-2 bg-brand-dark/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-gold text-brand-dark font-bold text-xs rounded-xl hover:bg-yellow-400"
                  >
                    Registrar
                  </button>
                </div>
              </form>

              {/* Activity Timeline */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Historial de Actividades</div>
                {selectedLead.activities?.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No hay registros aún.</p>
                ) : (
                  selectedLead.activities?.map((act) => (
                    <div key={act.id} className="p-3 bg-brand-dark/60 rounded-xl border border-white/5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-bold text-brand-green">{act.type}</span>
                        <span>{new Date(act.createdAt).toLocaleString('es-CO')}</span>
                      </div>
                      <p className="text-gray-200">{act.description}</p>
                      {act.author && <p className="text-[10px] text-gray-500 mt-1">Por: {act.author}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-brand-dark/50 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
