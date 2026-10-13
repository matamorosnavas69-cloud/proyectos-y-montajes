'use client';

import { Shield, Database, Cloud, FileText, CheckCircle2, Lock } from 'lucide-react';
import { useRBAC } from '@/lib/auth/useRBAC';

export default function AdminConfiguracionPage() {
  const { user, role, email } = useRBAC();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-brand-green/20">
        <h1 className="text-2xl md:text-3xl font-black text-white">Configuración del Sistema & Seguridad</h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Parámetros operacionales, estado de persistencia de datos, políticas RBAC y motor de generación documental.
        </p>
      </div>

      {/* Grid of config sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & RBAC */}
        <div className="bg-[#131d16] border border-brand-green/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-green/20 pb-4">
            <div className="p-2.5 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Control de Acceso & RBAC</h2>
              <p className="text-xs text-gray-400">Autenticación administrada por Clerk Provider</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Usuario Activo:</span>
              <span className="font-semibold text-white">{user?.fullName || 'Administrador'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Email Verificado:</span>
              <span className="font-mono text-emerald-400">{email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Nivel de Privilegios:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-dark font-black text-[10px] tracking-wider uppercase">
                {role}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Políticas Server-side:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> requireAdmin() en todas las mutaciones
              </span>
            </div>
          </div>
        </div>

        {/* Database & Prisma */}
        <div className="bg-[#131d16] border border-brand-green/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-green/20 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Base de Datos & ORM</h2>
              <p className="text-xs text-gray-400">Esquema aislado en PostgreSQL Supabase</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Motor de Base de Datos:</span>
              <span className="font-semibold text-white">PostgreSQL 15 (Supabase AWS Pooler)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Esquema Dedicado:</span>
              <span className="font-mono px-2 py-0.5 rounded bg-brand-green/20 text-emerald-300 border border-brand-green/30">
                proyectos_y_montajes
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Modelos Relacionales:</span>
              <span className="text-gray-300">Project, TechnicalSheet, Material, Milestone, QualityCheck</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Integridad Transaccional:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Prisma $transaction activa
              </span>
            </div>
          </div>
        </div>

        {/* Storage & Assets */}
        <div className="bg-[#131d16] border border-brand-green/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-green/20 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Almacenamiento de Medios</h2>
              <p className="text-xs text-gray-400">CDN de alta velocidad y buckets públicos</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Proveedor de Storage:</span>
              <span className="font-semibold text-white">Supabase Storage</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Bucket de Imágenes:</span>
              <span className="font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                projects
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Formatos Permitidos:</span>
              <span className="text-gray-300">WebP, JPEG, PNG (Compresión automática)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Entrega Pública:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> CDN Global HTTP/2 Activo
              </span>
            </div>
          </div>
        </div>

        {/* PDF Engine */}
        <div className="bg-[#131d16] border border-brand-green/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-brand-green/20 pb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Motor de Documentos & PDF</h2>
              <p className="text-xs text-gray-400">Generador vectorial de alta resolución para ingeniería</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Motor de Renderizado:</span>
              <span className="font-semibold text-white">Headless Chromium Vector Print</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Formato Estándar:</span>
              <span className="text-gray-300">A4 ISO 216 con márgenes técnicos</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-brand-green/10">
              <span className="text-gray-400">Nomenclatura Oficial:</span>
              <span className="font-mono text-brand-gold text-[11px]">PM_FichaTecnica_[slug]_R01.pdf</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Identidad Visual:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Colores Institucionales & Acentos Dorados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Architecture Summary Card */}
      <div className="bg-brand-dark/90 border border-brand-gold/30 rounded-2xl p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-2 text-brand-gold font-black text-sm uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Aislamiento de Información Pública vs Privada</span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          El sistema implementa un Data Transfer Object (DTO) estricto (<code className="text-brand-gold">toPublicProject()</code>) que garantiza que los presupuestos, observaciones internas, listas de chequeo de calidad y datos sensibles de clientes nunca se transmitan a los clientes del portafolio público (<code className="text-emerald-400">/portafolio</code>). Solo los campos visuales expresamente aprobados con <code className="text-brand-gold">published === true</code> son expuestos.
        </p>
      </div>
    </div>
  );
}
