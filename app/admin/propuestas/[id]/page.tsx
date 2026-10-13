'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  MapPin,
  Shield,
  CheckCircle2,
  Send,
  Sparkles,
  ExternalLink,
  Layers,
  Copy,
  Lock,
  DollarSign,
  Briefcase,
  FileText,
} from 'lucide-react';

interface ProposalDetail {
  id: string;
  code: string;
  version: string;
  title: string;
  category: string;
  clientName: string;
  clientCompany?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  location?: string | null;
  city?: string | null;
  status: string;
  scopeText: string;
  deliverables: string[];
  estimatedDays?: number | null;
  warrantyMonths?: number | null;
  directCost?: number | null;
  laborCost?: number | null;
  materialsCost?: number | null;
  transportCost?: number | null;
  overheadCost?: number | null;
  contingencyCost?: number | null;
  expectedMargin?: number | null;
  totalPrice: number;
  currency: string;
  paymentTerms?: string | null;
  estimatorData?: Record<string, unknown> | null;
  sentAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  projectId?: string | null;
  leadId?: string | null;
  lead?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
  } | null;
  project?: {
    id: string;
    title: string;
    slug: string;
    status: string;
    mainImage?: string | null;
  } | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  DRAFT: { label: 'Borrador Interno', bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' },
  INTERNAL_REVIEW: { label: 'Revisión Técnica', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  SENT: { label: 'Enviada al Cliente', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  VIEWED: { label: 'Vista por Cliente', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  NEGOTIATION: { label: 'En Negociación', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  ACCEPTED: { label: 'Aceptada (Ganada)', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  REJECTED: { label: 'Rechazada', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  EXPIRED: { label: 'Vencida', bg: 'bg-gray-700/10', text: 'text-gray-500', border: 'border-gray-700/30' },
};

function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [proposal, setProposal] = useState<ProposalDetail | null>(null);
  const [sisterVersions, setSisterVersions] = useState<ProposalDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'CLIENT' | 'INTERNAL'>('CLIENT');
  const [actionLoading, setActionLoading] = useState(false);

  // Versioning modal
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionPrice, setVersionPrice] = useState<string>('');
  const [versionNotes, setVersionNotes] = useState<string>('');

  const fetchProposal = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/proposals/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
        setVersionPrice(String(data.proposal.totalPrice || ''));

        // Fetch sibling versions with the same code
        const allRes = await fetch(`/api/admin/proposals?search=${data.proposal.code}`);
        if (allRes.ok) {
          const allData = await allRes.json();
          const siblings = (allData.proposals || []).filter(
            (p: ProposalDetail) => p.code === data.proposal.code
          );
          setSisterVersions(siblings);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  async function handleStatusChange(newStatus: string) {
    if (!proposal) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/proposals/${proposal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCreateNewVersion() {
    if (!proposal) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/proposals/${proposal.id}/version`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPrice: versionPrice ? Number(versionPrice) : undefined,
          scopeText: versionNotes ? `${proposal.scopeText}\n\n[Revisión ${proposal.version}]: ${versionNotes}` : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`¡Nueva versión ${data.proposal.version} creada con trazabilidad inmutable!`);
        setIsVersionModalOpen(false);
        router.push(`/admin/propuestas/${data.proposal.id}`);
      } else {
        alert(data.message || 'Error al generar nueva versión');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAcceptAndPromote() {
    if (!proposal) return;
    if (
      !confirm(
        `¿Desea marcar como ACEPTADA la propuesta ${proposal.code} (${proposal.version}) y promoverla a Proyecto Oficial de Obra? Se creará el expediente y la ficha técnica en el sistema.`
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/proposals/${proposal.id}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        alert(`¡Propuesta Aceptada! Proyecto "${data.project.title}" creado con éxito.`);
        router.push(`/admin/proyectos/${data.project.id}/ficha-tecnica`);
      } else {
        alert(data.message || 'Error al aceptar propuesta');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-gold rounded-full animate-spin" />
        <p className="text-sm font-medium">Cargando expediente comercial...</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Propuesta no encontrada.</p>
        <Link href="/admin/propuestas" className="mt-4 inline-block text-brand-gold hover:underline text-sm">
          Volver a Propuestas
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_CONFIG[proposal.status] || STATUS_CONFIG.DRAFT;
  const directCost = proposal.directCost || 0;
  const overheadCost = proposal.overheadCost || 0;
  const contingencyCost = proposal.contingencyCost || 0;
  const totalInternalCost = directCost + overheadCost + contingencyCost;
  const marginAmount = proposal.totalPrice - totalInternalCost;
  const actualMarginPct = proposal.totalPrice > 0 ? ((marginAmount / proposal.totalPrice) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/propuestas"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Lista de Propuestas
        </Link>

        {/* Version Switcher Bar */}
        {sisterVersions.length > 1 && (
          <div className="flex items-center gap-2 bg-[#131d16] p-1.5 rounded-xl border border-brand-green/30">
            <span className="text-xs font-semibold text-gray-400 px-2">Versiones:</span>
            {sisterVersions.map((sv) => (
              <Link
                key={sv.id}
                href={`/admin/propuestas/${sv.id}`}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  sv.id === proposal.id
                    ? 'bg-brand-gold text-brand-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sv.version}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Header Banner */}
      <div className="bg-[#131d16] p-6 sm:p-8 rounded-2xl border border-brand-green/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 text-xs font-mono font-bold tracking-wider">
                {proposal.code}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold font-mono">
                {proposal.version} (Inmutable)
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {statusStyle.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-gray-400 text-xs font-medium border border-white/10">
                {proposal.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{proposal.title}</h1>
            <p className="text-gray-400 text-sm mt-1 flex flex-wrap items-center gap-4">
              <span>Cliente: <strong className="text-gray-200">{proposal.clientName}</strong></span>
              {proposal.clientCompany && (
                <span>• Empresa: <strong className="text-gray-200">{proposal.clientCompany}</strong></span>
              )}
              {proposal.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {proposal.city}
                </span>
              )}
            </p>
          </div>

          {/* Quick Actions & State Change */}
          <div className="flex flex-wrap items-center gap-3">
            {proposal.status !== 'ACCEPTED' && (
              <button
                onClick={() => setIsVersionModalOpen(true)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-[#1c2920] hover:bg-[#25362b] text-white border border-brand-green/40 text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
              >
                <Copy className="w-4 h-4 text-brand-gold" />
                Nueva Versión (V{(parseInt(proposal.version.replace(/\D/g, ''), 10) + 1).toString().padStart(2, '0')})
              </button>
            )}

            {proposal.status === 'DRAFT' && (
              <button
                onClick={() => handleStatusChange('SENT')}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
                Marcar como Enviada
              </button>
            )}

            {proposal.status !== 'ACCEPTED' && !proposal.projectId && (
              <button
                onClick={handleAcceptAndPromote}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/25"
              >
                <CheckCircle2 className="w-4 h-4" />
                Aceptar & Promover a Obra
              </button>
            )}

            {proposal.project && (
              <Link
                href={`/admin/proyectos/${proposal.project.id}/ficha-tecnica`}
                className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-black text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
              >
                <Briefcase className="w-4 h-4" />
                Ver Obra en Ejecución
              </Link>
            )}
          </div>
        </div>

        {/* Tab Selector: Client Proposal vs Internal Economics */}
        <div className="flex border-b border-brand-green/30 mt-8 pt-2">
          <button
            onClick={() => setActiveTab('CLIENT')}
            className={`pb-3 px-5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'CLIENT'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Propuesta Comercial Cliente
          </button>
          <button
            onClick={() => setActiveTab('INTERNAL')}
            className={`pb-3 px-5 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'INTERNAL'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 text-brand-gold" />
            Estructura de Costos & Margen (Confidencial P&M)
          </button>
        </div>
      </div>

      {/* TAB 1: CLIENT PROPOSAL VIEW */}
      {activeTab === 'CLIENT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Proposal Body */}
          <div className="lg:col-span-2 space-y-6">
            {/* Concept & Scope */}
            <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                Concepto & Solución Técnica Propuesta
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-xl border border-white/5">
                {proposal.scopeText}
              </p>
            </div>

            {/* Deliverables / Entregables */}
            <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-green" />
                Alcance y Entregables Formales
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proposal.deliverables.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-black/20 border border-white/5 text-sm text-gray-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Commercial Terms & Guarantee */}
            <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-gold" />
                Condiciones Comerciales y Pólizas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Forma de Pago</span>
                  <p className="text-sm font-medium text-white">{proposal.paymentTerms || '50% anticipo, 30% avance, 20% entrega'}</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Garantía Certificada P&M</span>
                  <p className="text-sm font-medium text-white">{proposal.warrantyMonths || 24} meses de cobertura directa</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Tiempo Estimado de Ejecución</span>
                  <p className="text-sm font-medium text-white">{proposal.estimatedDays || 45} días calendario</p>
                </div>
                <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-xs text-gray-400 uppercase font-semibold">Validez de la Oferta</span>
                  <p className="text-sm font-medium text-white">15 días calendario a partir de su emisión</p>
                </div>
              </div>
            </div>
          </div>

          {/* Investment & Credentials Sidebar */}
          <div className="space-y-6">
            {/* Total Investment Card */}
            <div className="bg-gradient-to-br from-[#18261d] to-[#101912] p-6 rounded-2xl border border-brand-gold/40 shadow-2xl space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">Inversión Total Proyecto</span>
                <DollarSign className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white tracking-tight">
                  {formatCOP(proposal.totalPrice)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Valores antes de IVA (o con IVA aplicable según régimen)</p>
              </div>

              <div className="border-t border-brand-green/30 pt-4 space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Código de Expediente:</span>
                  <span className="font-mono font-bold text-white">{proposal.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Versión Vigente:</span>
                  <span className="font-mono font-bold text-brand-gold">{proposal.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha de Emisión:</span>
                  <span className="text-white">{new Date(proposal.createdAt).toLocaleDateString('es-CO')}</span>
                </div>
              </div>
            </div>

            {/* P&M Corporate Credentials */}
            <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-gold" />
                Respaldo Proyectos & Montajes
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Más de 20 años de trayectoria en construcción de alta especificación en Colombia. Cumplimiento de normativas FIP / FIFA y control de calidad auditado mediante fichas técnicas digitales.
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                <span>Certificaciones:</span>
                <span className="text-brand-green font-semibold">ISO 9001 / FIP Compliant</span>
              </div>
            </div>

            {/* Associated Project / Lead Link */}
            {(proposal.lead || proposal.project) && (
              <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enlaces del Ecosistema</h3>
                {proposal.lead && (
                  <Link
                    href={`/admin/leads?search=${encodeURIComponent(proposal.lead.name)}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-white/5 border border-white/5 text-xs text-gray-300 transition-all"
                  >
                    <span>Prospecto CRM: <strong>{proposal.lead.name}</strong></span>
                    <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
                  </Link>
                )}
                {proposal.project && (
                  <Link
                    href={`/admin/proyectos/${proposal.project.id}/ficha-tecnica`}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/20 hover:bg-white/5 border border-white/5 text-xs text-gray-300 transition-all"
                  >
                    <span>Ficha Técnica Obra: <strong>{proposal.project.title}</strong></span>
                    <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CONFIDENTIAL INTERNAL ECONOMICS */}
      {activeTab === 'INTERNAL' && (
        <div className="space-y-8">
          {/* Security Alert Banner */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
            <Lock className="w-5 h-5 shrink-0 text-amber-400" />
            <p>
              <strong>INFORMACIÓN CONFIDENCIAL DE P&M:</strong> Esta estructura económica, márgenes y costos directos nunca son expuestos en cotizaciones de cliente, portales públicos o fichas técnicas de entrega.
            </p>
          </div>

          {/* Financial Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30">
              <span className="text-xs font-semibold text-gray-400 uppercase">Costo Directo</span>
              <p className="text-xl font-bold text-white mt-1">{formatCOP(directCost)}</p>
              <span className="text-[11px] text-gray-500">Materiales + M.O + Transporte</span>
            </div>
            <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30">
              <span className="text-xs font-semibold text-gray-400 uppercase">Overhead + Contingencia</span>
              <p className="text-xl font-bold text-white mt-1">{formatCOP(overheadCost + contingencyCost)}</p>
              <span className="text-[11px] text-gray-500">8% Admin + 5% Imprevistos</span>
            </div>
            <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-gold/30">
              <span className="text-xs font-semibold text-brand-gold uppercase">Margen Esperado</span>
              <p className="text-xl font-bold text-brand-gold mt-1">{formatCOP(marginAmount)}</p>
              <span className="text-[11px] text-brand-gold/70">{actualMarginPct}% sobre el precio de venta</span>
            </div>
            <div className="bg-[#131d16] p-5 rounded-2xl border border-brand-green/30">
              <span className="text-xs font-semibold text-gray-400 uppercase">Precio Total Venta</span>
              <p className="text-xl font-bold text-white mt-1">{formatCOP(proposal.totalPrice)}</p>
              <span className="text-[11px] text-emerald-400">Puntaje financiero óptimo</span>
            </div>
          </div>

          {/* Granular Cost Breakdown Table */}
          <div className="bg-[#131d16] p-6 rounded-2xl border border-brand-green/30 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-gold" />
              Desglose Paramétrico de Costos
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-brand-green/30 text-xs font-bold text-gray-400 uppercase">
                    <th className="py-3 px-4">Rubro de Costo</th>
                    <th className="py-3 px-4">Naturaleza</th>
                    <th className="py-3 px-4 text-right">Valor Estimado</th>
                    <th className="py-3 px-4 text-right">% del Costo Directo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Suministro de Materiales</td>
                    <td className="py-3 px-4 text-xs text-gray-400">Estructura, cristal, césped sintético, luminarias</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCOP(proposal.materialsCost || 0)}</td>
                    <td className="py-3 px-4 text-right text-xs">
                      {directCost > 0 ? (((proposal.materialsCost || 0) / directCost) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Mano de Obra Especializada</td>
                    <td className="py-3 px-4 text-xs text-gray-400">Técnicos certificados P&M, topografía e instalación</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCOP(proposal.laborCost || 0)}</td>
                    <td className="py-3 px-4 text-right text-xs">
                      {directCost > 0 ? (((proposal.laborCost || 0) / directCost) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Transporte & Logística Nacional</td>
                    <td className="py-3 px-4 text-xs text-gray-400">Fletes especializados, descargue y manipulación</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCOP(proposal.transportCost || 0)}</td>
                    <td className="py-3 px-4 text-right text-xs">
                      {directCost > 0 ? (((proposal.transportCost || 0) / directCost) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                  <tr className="bg-white/5 font-semibold text-white">
                    <td className="py-3 px-4">Subtotal Costo Directo</td>
                    <td className="py-3 px-4 text-xs text-gray-400">Base directa de producción</td>
                    <td className="py-3 px-4 text-right font-mono text-brand-gold">{formatCOP(directCost)}</td>
                    <td className="py-3 px-4 text-right text-xs">100.0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Gastos Administrativos (Overhead 8%)</td>
                    <td className="py-3 px-4 text-xs text-gray-400">Supervisión técnica, seguridad SST, pólizas</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCOP(overheadCost)}</td>
                    <td className="py-3 px-4 text-right text-xs">8.0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-white">Contingencia de Obra (5%)</td>
                    <td className="py-3 px-4 text-xs text-gray-400">Margen de seguridad por variaciones de terreno</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCOP(contingencyCost)}</td>
                    <td className="py-3 px-4 text-right text-xs">5.0%</td>
                  </tr>
                  <tr className="bg-emerald-500/10 font-bold text-emerald-400">
                    <td className="py-3 px-4">Margen Comercial Neto P&M</td>
                    <td className="py-3 px-4 text-xs">Utilidad antes de impuestos</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCOP(marginAmount)}</td>
                    <td className="py-3 px-4 text-right text-xs">{actualMarginPct}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VERSION MODAL */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#131d16] border border-brand-green/40 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold font-mono">
                Trazabilidad Comercial Inmutable
              </span>
              <h3 className="text-lg font-bold text-white mt-2">
                Crear Nueva Versión de {proposal.code}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                La versión actual ({proposal.version}) quedará archivada sin cambios. Se generará una nueva versión editable.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Precio Total Ajustado (COP)
                </label>
                <input
                  type="number"
                  value={versionPrice}
                  onChange={(e) => setVersionPrice(e.target.value)}
                  className="w-full bg-[#1c2920] border border-brand-green/30 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                  Notas de Modificación Comercial
                </label>
                <textarea
                  rows={3}
                  value={versionNotes}
                  onChange={(e) => setVersionNotes(e.target.value)}
                  placeholder="Ej: Se ajustó el alcance para incluir 4 luminarias LED adicionales solicitadas por el cliente en negociación..."
                  className="w-full bg-[#1c2920] border border-brand-green/30 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateNewVersion}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-black text-xs font-bold shadow-lg transition-all"
              >
                {actionLoading ? 'Generando...' : 'Generar Versión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
