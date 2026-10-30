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
      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center">
        {/* Intuitive Switcher Tabs */}
        <div className="flex w-full mb-4 p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
          <Link
            href="/sign-in"
            className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            Iniciar Sesión
          </Link>
          <div className="flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider text-brand-dark bg-brand-gold rounded-lg shadow-sm">
            Crear Cuenta
          </div>
        </div>

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

        {/* Clear Prompt for Users Who Already Have an Account */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-[#131d16]/90 border border-brand-gold/25 text-center shadow-lg">
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            ¿Ya tiene una cuenta de usuario creada?
          </p>
          <Link
            href="/sign-in"
            className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold border border-brand-gold/30 text-xs font-black uppercase tracking-wider transition-all"
          >
            Iniciar sesión aquí &rarr;
          </Link>
        </div>
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
