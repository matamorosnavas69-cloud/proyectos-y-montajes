import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const openSans = Open_Sans({ subsets: ["latin"] });

import JsonLd from "@/app/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.proyectosymontajes.com"),
  title: "Proyectos y Montajes | Construcción de Canchas y Parques",
  description: "Más de 20 años de experiencia instalando canchas sintéticas, pistas de Pádel, parques infantiles y soluciones premium de paisajismo residencial y comercial a nivel nacional.",
  keywords: "canchas sinteticas, pistas de padel, parques infantiles, grama sintetica, paisajismo, construccion deportiva, bucaramanga, colombia",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.proyectosymontajes.com",
    siteName: "Proyectos y Montajes",
    title: "Proyectos y Montajes | Ingeniería Deportiva, Recreativa y Paisajismo",
    description: "Más de 20 años transformando espacios de alto rendimiento, pistas de pádel, canchas sintéticas y paisajismo en Colombia.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Proyectos y Montajes — Ingeniería Deportiva y Paisajismo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proyectos y Montajes | Ingeniería Deportiva y Paisajismo",
    description: "Más de 20 años transformando espacios deportivos y recreativos en Colombia.",
    images: ["/images/og-image.jpg"],
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import SiteLayoutWrapper from "@/app/components/SiteLayoutWrapper";
import { getCleanClerkPublishableKey } from "@/lib/auth/clerk-config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={getCleanClerkPublishableKey()}>
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
