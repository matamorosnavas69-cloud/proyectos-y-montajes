'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { ShieldCheck, Plus, LayoutDashboard, Sparkles } from 'lucide-react';
import { useRBAC } from '@/lib/auth/useRBAC';
import CreateProjectModal from './CreateProjectModal';
import { useRouter } from 'next/navigation';

export default function PortfolioAdminBar() {
  const { isLoaded, isSignedIn, isAdmin, role } = useRBAC();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // If loading or not admin, don't show the bar
  if (!isLoaded || !isSignedIn || !isAdmin) {
    return null;
  }

  const handleProjectCreated = () => {
    router.refresh();
  };

  return (
    <>
      {/* Floating or sticky enterprise admin control bar */}
      <div className="sticky top-20 z-40 w-full bg-gradient-to-r from-[#0b120d]/95 via-[#131d16]/95 to-[#0b120d]/95 border-b border-brand-gold/30 backdrop-blur-md shadow-2xl py-3 px-6 transition-all animate-fade-in">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Admin badge & status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-green/30 border border-brand-green flex items-center justify-center text-brand-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  Panel de Portafolio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-gold text-brand-dark">
                  {role}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Permisos habilitados para crear, editar y gestionar obras.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-dark px-4 py-2 rounded-lg font-black text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Subir Proyecto</span>
            </button>

            <Link
              href="/admin/proyectos"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm border border-white/15 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-gold" />
              <span className="hidden sm:inline">Administrar CMS</span>
            </Link>

            <div className="pl-2 border-l border-white/15 flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-8 h-8 border border-brand-gold/40',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}
