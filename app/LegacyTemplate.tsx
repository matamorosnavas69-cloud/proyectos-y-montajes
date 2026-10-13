'use client';

import { usePathname } from 'next/navigation';
import ProjectGallery from '@/app/components/ProjectGallery';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {children}
      {pathname === '/' && <ProjectGallery />}
    </>
  );
}
