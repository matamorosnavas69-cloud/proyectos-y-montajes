import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export type BrandLogoVariant = 'institutional' | 'horizontal' | 'mark';
export type BrandLogoTheme = 'light' | 'dark';

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  theme?: BrandLogoTheme;
  height?: number;
  width?: number;
  className?: string;
  priority?: boolean;
  showLink?: boolean;
  href?: string;
  alt?: string;
}

const BRAND_ASSET_MAP = {
  horizontal: {
    dark: '/brand/logo/logo-horizontal-dark.webp',
    light: '/brand/logo/logo-horizontal-light.webp',
    aspectRatio: 1564 / 180,
    defaultHeight: 44,
  },
  institutional: {
    dark: '/brand/logo/logo-institutional-dark.webp',
    light: '/brand/logo/logo-institutional-light.webp',
    aspectRatio: 1696 / 875,
    defaultHeight: 72,
  },
  mark: {
    dark: '/brand/logo/brand-symbol.webp',
    light: '/brand/logo/brand-symbol.webp',
    aspectRatio: 1,
    defaultHeight: 40,
  },
} as const;

export default function BrandLogo({
  variant = 'horizontal',
  theme = 'dark',
  height,
  width,
  className = '',
  priority = false,
  showLink = true,
  href = '/',
  alt = 'Proyectos y Montajes — Ingeniería Deportiva y Paisajismo',
}: BrandLogoProps) {
  const config = BRAND_ASSET_MAP[variant];
  const src = config[theme];
  
  const effectiveHeight = height ?? config.defaultHeight;
  const effectiveWidth = width ?? Math.round(effectiveHeight * config.aspectRatio);

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={effectiveWidth}
      height={effectiveHeight}
      priority={priority}
      className={`inline-block object-contain select-none transition-opacity duration-200 ${className}`}
      style={{
        width: effectiveWidth,
        height: effectiveHeight,
      }}
    />
  );

  if (showLink) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm group"
        aria-label="Proyectos y Montajes — Volver al Inicio"
      >
        {imageElement}
      </Link>
    );
  }

  return imageElement;
}
