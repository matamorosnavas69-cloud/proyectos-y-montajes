import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import Link from 'next/link';

export const metadata = {
  title: 'Iniciar Sesión | Proyectos y Montajes',
  description: 'Portal de acceso administrativo de Proyectos y Montajes.',
};

export default function SignInPage() {
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
            Portal Administrativo
          </span>
          <span className="h-[1px] w-6 bg-brand-green"></span>
        </div>
      </div>

      {/* Clerk Card Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center">
        {/* Intuitive Switcher Tabs */}
        <div className="flex w-full mb-4 p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md">
          <div className="flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider text-brand-dark bg-brand-gold rounded-lg shadow-sm">
            Iniciar Sesión
          </div>
          <Link
            href="/sign-up"
            className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            Crear Cuenta
          </Link>
        </div>

        <ClerkLoading>
          <div className="w-full bg-[#131d16] border border-brand-green/30 shadow-2xl rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-brand-green/30 border-t-brand-gold rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-300 font-medium">Iniciando pasarela segura...</p>
            <p className="text-xs text-gray-500 mt-1">Conectando con autenticación corporativa</p>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <SignIn
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
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/admin"
          />
        </ClerkLoaded>

        {/* Clear Prompt for Users Without Account */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-[#131d16]/90 border border-brand-gold/25 text-center shadow-lg">
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            ¿Es su primera vez y aún no tiene usuario registrado?
          </p>
          <Link
            href="/sign-up"
            className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold border border-brand-gold/30 text-xs font-black uppercase tracking-wider transition-all"
          >
            Registrar nueva cuenta &rarr;
          </Link>
        </div>
      </div>

      {/* Team Preview / Return link */}
      <div className="mt-8 text-center relative z-10 flex flex-col items-center gap-3">
        <Link
          href="/admin?preview=pm2026"
          className="text-xs px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/25 font-semibold transition-all"
        >
          Presentación de equipo (Vista previa directa) &rarr;
        </Link>
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
