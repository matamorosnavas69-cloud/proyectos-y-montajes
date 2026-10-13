'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function SiteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrAuth =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/sign-in') ||
    pathname?.startsWith('/sign-up');

  if (isAdminOrAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
