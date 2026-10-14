'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  FolderGit2,
  PlusCircle,
  Globe,
  Shield,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  FileCheck,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Image as ImageIcon,
  Images,
  UserCog,
  Users,
} from 'lucide-react';
import { useRBAC } from '@/lib/auth/useRBAC';
import CreateProjectModal from '@/app/components/admin/CreateProjectModal';

import BrandLogo from '@/app/components/brand/BrandLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: 'Dashboard General',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'CRM & Pipeline',
    href: '/admin/leads',
    icon: Users,
  },
  {
    name: 'Propuestas Comerciales',
    href: '/admin/propuestas',
    icon: FileSpreadsheet,
  },
  {
    name: 'Inteligencia de Ingresos',
    href: '/admin/inteligencia-comercial',
    icon: TrendingUp,
  },
  {
    name: 'Gestión de Proyectos',
    href: '/admin/proyectos',
    icon: FolderGit2,
  },
  {
    name: 'Fichas Técnicas',
    href: '/admin/fichas-tecnicas',
    icon: FileText,
  },
  {
    name: 'Control de Portafolio',
    href: '/admin/portafolio',
    icon: ImageIcon,
  },
  {
    name: 'Biblioteca de Medios',
    href: '/admin/biblioteca-media',
    icon: Images,
  },
  {
    name: 'Gestión de Usuarios',
    href: '/admin/usuarios',
    icon: UserCog,
  },
  {
    name: 'Configuración',
    href: '/admin/configuracion',
    icon: Shield,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pathname = usePathname();
  const { isLoaded, isSignedIn, isAdmin, role, email, user, isPresentationMode } = useRBAC();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-brand-green/30 border-t-brand-gold rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm font-medium tracking-wide">
          Verificando credenciales de acceso...
        </p>
      </div>
    );
  }

  // Not signed in or unauthorized
  if (!isSignedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-md w-full bg-[#131d16] border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Se requieren permisos de Administrador para acceder al panel de control de Proyectos y Montajes.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-brand-green hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/sign-in"
              className="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-lg text-sm transition-colors border border-white/10"
            >
              Iniciar con otra cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white flex flex-col md:flex-row antialiased">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#131d16] border-b border-brand-green/30 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <BrandLogo variant="horizontal" theme="dark" height={28} href="/admin" />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-72 bg-[#131d16] border-r border-brand-green/20 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-5 border-b border-brand-green/20">
            <BrandLogo
              variant="horizontal"
              theme="dark"
              height={32}
              href="/admin"
              className="hover:opacity-95 transition-opacity"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                {isPresentationMode ? 'Modo presentación' : 'Sistema RBAC'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark">
                {role}
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="p-4">
            <button
              onClick={() => {
                setIsCreateModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-gold hover:bg-yellow-400 text-brand-dark font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-gold/10 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Nuevo Proyecto</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-3 py-2">
              Gestión Principal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-green text-white shadow-md border border-brand-gold/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-gray-400'}`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-gold" />}
                </Link>
              );
            })}

            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-3 pt-6 pb-2">
              Accesos Directos
            </div>

            <Link
              href="/portafolio"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="flex-1">Ver Portafolio Público</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            </Link>

            <Link
              href="/Ficha_Tecnica_Proyectos_y_Montajes.pdf"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <FileCheck className="w-4 h-4 text-brand-gold" />
              <span className="flex-1">Ficha Técnica Oficial</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            </Link>
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-brand-green/20 bg-brand-dark/40 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-9 h-9 border border-brand-gold/40',
                  },
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.fullName || user?.firstName || 'Administrador'}
                </p>
                <p className="text-[11px] text-gray-400 truncate">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="hidden md:flex h-16 border-b border-brand-green/20 bg-[#131d16]/80 backdrop-blur-md px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-white font-semibold capitalize">
              {pathname.replace('/admin', '') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-[11px] text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Storage Conectado
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-dark px-3.5 py-1.5 rounded-lg font-black text-xs transition-all shadow cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Subir Obra
            </button>
          </div>
        </header>

        {/* Page children */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
