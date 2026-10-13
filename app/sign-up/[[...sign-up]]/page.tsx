import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export const metadata = {
  title: 'Registro | Proyectos y Montajes',
  description: 'Registro de colaboradores de Proyectos y Montajes.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      {/* Background glow decorations */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <Link href="/" className="inline-flex flex-col items-center group">
          <span className="text-28 font-black tracking-tight text-brand-gold">
            PROYECTOS
          </span>
          <span className="text-12 font-semibold tracking-widest text-brand-light">
            & MONTAJES
          </span>
        </Link>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="h-[1px] w-6 bg-brand-green"></span>
          <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            Registro de Equipo
          </span>
          <span className="h-[1px] w-6 bg-brand-green"></span>
        </div>
      </div>

      {/* Clerk Card Container */}
      <div className="relative z-10 w-full max-w-md flex justify-center">
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-[#131d16] border border-brand-green/30 shadow-2xl rounded-2xl p-6 text-white',
              headerTitle: 'text-white font-bold text-xl',
              headerSubtitle: 'text-gray-400 text-sm',
              formButtonPrimary:
                'bg-brand-gold hover:bg-yellow-400 text-brand-dark font-bold text-sm shadow-md transition-all',
              formFieldInput:
                'bg-brand-dark/80 border border-brand-green/40 text-white rounded-lg focus:border-brand-gold focus:ring-1 focus:ring-brand-gold',
              formFieldLabel: 'text-gray-300 font-medium text-xs',
              footerActionLink: 'text-brand-gold hover:text-yellow-300 font-semibold',
              identityPreviewText: 'text-gray-200',
              userButtonPopoverCard: 'bg-[#131d16] border border-brand-green/30 text-white',
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/admin"
        />
      </div>

      {/* Return link */}
      <div className="mt-8 text-center relative z-10">
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-brand-gold transition-colors"
        >
          &larr; Volver al sitio web principal
        </Link>
      </div>
    </div>
  );
}
