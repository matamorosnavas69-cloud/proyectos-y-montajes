import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const openSans = Open_Sans({ subsets: ["latin"] });

import JsonLd from "@/app/components/JsonLd";

export const metadata: Metadata = {
  title: "Proyectos y Montajes | Construcción de Canchas y Parques",
  description: "Más de 20 años de experiencia instalando canchas sintéticas, pistas de Pádel, parques infantiles y soluciones premium de paisajismo residencial y comercial a nivel nacional.",
  keywords: "canchas sinteticas, pistas de padel, parques infantiles, grama sintetica, paisajismo, construccion deportiva, bucaramanga, colombia",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.proyectosymontajes.com",
    title: "Proyectos y Montajes | Ingeniería Deportiva y Paisajismo",
    description: "Líderes en construcción de infraestructura deportiva, recreativa y paisajismo premium con materiales de calidad europea.",
    images: [
      {
        url: "/images/padel/IMG_3346.PNG",
        width: 1200,
        height: 630,
        alt: "Cancha Deportiva",
      },
    ],
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import SiteLayoutWrapper from "@/app/components/SiteLayoutWrapper";

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZGVlcC1jb2QtNDkuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="es">
        <body className={`${openSans.className} bg-brand-dark text-white antialiased`}>
          <JsonLd />
          <SiteLayoutWrapper>
            {children}
          </SiteLayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
