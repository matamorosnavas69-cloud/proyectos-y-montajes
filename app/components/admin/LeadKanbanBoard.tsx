'use client';

import { Building2, CalendarClock, GripVertical, MapPin, MessageSquare, Phone, Sparkles } from 'lucide-react';
import { useState } from 'react';

export type KanbanStage = {
  key: string;
  label: string;
  stageNumber: number;
  bg: string;
  text: string;
  border: string;
};

type KanbanLead = {
  id: string;
  name: string;
  company?: string | null;
  phone?: string | null;
  projectType: string;
  city?: string | null;
  location?: string | null;
  estimatedValue?: number | null;
  estimatedBudget?: number | null;
  quotedAmount?: number | null;
  closeProbability: number;
  nextAction?: string | null;
  nextActionDate?: string | null;
  priority: string;
  status: string;
  source: string;
  activities?: { id: string }[];
};

type LeadKanbanBoardProps = {
  leads: KanbanLead[];
  stages: KanbanStage[];
  movingLeadId?: string | null;
  onMoveLead: (leadId: string, stage: string) => void;
  onOpenLead: (leadId: string) => void;
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  ALTA: { label: 'Prioridad alta', className: 'border-red-400/25 bg-red-400/10 text-red-200' },
  MEDIA: { label: 'Prioridad media', className: 'border-brand-gold/25 bg-brand-gold/10 text-brand-gold' },
  BAJA: { label: 'Prioridad baja', className: 'border-white/10 bg-white/5 text-gray-400' },
};

function formatCOP(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

function formatActionDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(date);
}

function getLeadValue(lead: KanbanLead) {
  return lead.estimatedValue || lead.estimatedBudget || lead.quotedAmount || 0;
}

export default function LeadKanbanBoard({ leads, stages, movingLeadId, onMoveLead, onOpenLead }: LeadKanbanBoardProps) {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dropStage, setDropStage] = useState<string | null>(null);

  function clearDragState() {
    setDraggedLeadId(null);
    setDropStage(null);
  }

  function handleDrop(stage: string) {
    if (draggedLeadId) onMoveLead(draggedLeadId, stage);
    clearDragState();
  }

  return (
    <section aria-labelledby="kanban-title" className="overflow-hidden rounded-[24px] border border-brand-green/30 bg-[#101811] shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 border-b border-white/10 bg-[#131d16] px-6 py-[20px] md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold"><Sparkles className="h-[14px] w-[14px]" /> Vista operativa</div>
          <h2 id="kanban-title" className="mt-1 text-xl font-black text-white">Tablero comercial por etapa</h2>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-gray-400">Arrastre una oportunidad entre etapas o utilice el selector de cada tarjeta. Cada cambio queda registrado en la bitácora comercial.</p>
      </div>

      <div className="overflow-x-auto p-[16px] md:p-[20px]">
        <div className="flex min-w-max items-start gap-[16px]">
          {stages.map((stage) => {
            const stageLeads = leads.filter((lead) => lead.status === stage.key);
            const stageValue = stageLeads.reduce((total, lead) => total + getLeadValue(lead), 0);
            const isDropTarget = dropStage === stage.key && Boolean(draggedLeadId);

            return (
              <div
                key={stage.key}
                className={`w-[310px] shrink-0 rounded-[20px] border bg-[#0b120d]/70 p-[12px] transition-colors ${isDropTarget ? 'border-brand-gold bg-brand-gold/10' : 'border-white/10'}`}
                onDragOver={(event) => { event.preventDefault(); setDropStage(stage.key); }}
                onDragLeave={() => setDropStage(null)}
                onDrop={() => handleDrop(stage.key)}
              >
                <div className="mb-[12px] flex items-start justify-between gap-3 px-1 pt-1">
                  <div>
                    <div className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${stage.bg} ${stage.text} ${stage.border}`}>
                      <span>{stage.stageNumber > 0 ? String(stage.stageNumber).padStart(2, '0') : '—'}</span>{stage.label}
                    </div>
                    <p className="mt-2 text-[11px] font-semibold text-gray-500">{stageLeads.length} {stageLeads.length === 1 ? 'oportunidad' : 'oportunidades'}</p>
                  </div>
                  <p className="pt-1 text-right text-xs font-black text-white">{stageValue ? formatCOP(stageValue) : '—'}</p>
                </div>

                <div className="min-h-[168px] space-y-[10px]">
                  {stageLeads.map((lead) => {
                    const leadValue = getLeadValue(lead);
                    const priority = priorityConfig[lead.priority] || priorityConfig.MEDIA;
                    const actionDate = formatActionDate(lead.nextActionDate);
                    const isMoving = movingLeadId === lead.id;

                    return (
                      <article
                        key={lead.id}
                        draggable={!isMoving}
                        onDragStart={() => setDraggedLeadId(lead.id)}
                        onDragEnd={clearDragState}
                        className={`group rounded-[16px] border border-white/10 bg-[#172019] p-[16px] shadow-lg shadow-black/10 transition ${isMoving ? 'cursor-wait opacity-60' : 'cursor-grab hover:border-brand-gold/50 hover:bg-[#1b281d] active:cursor-grabbing'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button type="button" onClick={() => onOpenLead(lead.id)} className="min-w-0 text-left focus:outline-none">
                            <h3 className="truncate text-sm font-black text-white transition-colors group-hover:text-brand-gold">{lead.name}</h3>
                            {lead.company && <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-400"><Building2 className="h-[13px] w-[13px] shrink-0" />{lead.company}</p>}
                          </button>
                          <GripVertical className="h-[16px] w-[16px] shrink-0 text-gray-600" aria-hidden="true" />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${priority.className}`}>{priority.label}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{lead.source}</span>
                        </div>

                        <div className="mt-3 rounded-[12px] border border-white/5 bg-black/15 p-[12px]">
                          <p className="truncate text-xs font-bold text-emerald-200">{lead.projectType}</p>
                          {(lead.city || lead.location) && <p className="mt-2 flex items-center gap-1.5 truncate text-[11px] text-gray-400"><MapPin className="h-[13px] w-[13px] shrink-0 text-gray-500" />{lead.city || lead.location}</p>}
                          <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/5 pt-3">
                            <div><p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Valor</p><p className="mt-1 text-xs font-black text-brand-gold">{leadValue ? formatCOP(leadValue) : 'Por estimar'}</p></div>
                            <div className="text-right"><p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Cierre</p><p className="mt-1 text-xs font-black text-white">{lead.closeProbability ?? 50}%</p></div>
                          </div>
                        </div>

                        {(lead.nextAction || actionDate || lead.phone) && <div className="mt-3 space-y-2 border-t border-white/5 pt-3 text-[11px] text-gray-400">
                          {lead.nextAction && <p className="flex gap-1.5 leading-relaxed"><CalendarClock className="mt-0.5 h-[13px] w-[13px] shrink-0 text-brand-gold" /><span className="line-clamp-2">{lead.nextAction}{actionDate ? ` · ${actionDate}` : ''}</span></p>}
                          {lead.phone && <p className="flex items-center gap-1.5 truncate"><Phone className="h-[13px] w-[13px] shrink-0 text-gray-500" />{lead.phone}</p>}
                        </div>}

                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-3">
                          <button type="button" onClick={() => onOpenLead(lead.id)} className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-300 transition hover:text-white"><MessageSquare className="h-[13px] w-[13px] text-brand-gold" />{lead.activities?.length || 0} notas</button>
                          <select value={lead.status} disabled={isMoving} onChange={(event) => onMoveLead(lead.id, event.target.value)} className="max-w-[158px] rounded-lg border border-white/10 bg-[#0b120d] px-2 py-1 text-[10px] font-bold text-gray-300 outline-none focus:border-brand-gold disabled:opacity-50">
                            {stages.map((option) => <option key={option.key} value={option.key}>{option.stageNumber > 0 ? `${option.stageNumber}. ` : ''}{option.label}</option>)}
                          </select>
                        </div>
                      </article>
                    );
                  })}
                  {!stageLeads.length && <div className={`grid min-h-[156px] place-items-center rounded-[16px] border border-dashed p-6 text-center text-xs ${isDropTarget ? 'border-brand-gold text-brand-gold' : 'border-white/10 text-gray-600'}`}><span>{isDropTarget ? 'Suelte la oportunidad aquí' : 'Sin oportunidades en esta etapa'}</span></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
