import React from "react";
import Image from "next/image";
import CanchaLinearIcon from "./CanchaLinearIcon";
import FutbolLinearIcon from "./FutbolLinearIcon";
import TenisLinearIcon from "./TenisLinearIcon";
import GolfLinearIcon from "./GolfLinearIcon";
import ParquesLinearIcon from "./ParquesLinearIcon";
import PaisajismoLinearIcon from "./PaisajismoLinearIcon";
import { BRAND_ASSET_REGISTRY, BrandAssetId } from "./icon-registry";

export interface BrandIconProps {
  name: BrandAssetId;
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}

/**
 * BrandIcon — Unified Hybrid Brand Asset Component
 *
 * Automatically routes between:
 * - Native scalable React SVG components for technical line icons (24-64px).
 * - Next.js optimized Image (WebP) for architectural isometric artwork (96-240px).
 */
export default function BrandIcon({
  name,
  size,
  className = "",
  alt,
  priority = false,
}: BrandIconProps) {
  const asset = BRAND_ASSET_REGISTRY[name];

  if (!asset) {
    console.warn(`[BrandIcon] Unknown icon asset name: "${name}"`);
    return null;
  }

  const effectiveSize = size || asset.recommendedSize.default;
  const accessibleAlt = alt || asset.altText;

  // 1. Vector SVG Dispatch
  if (asset.format === "svg-vector") {
    switch (name) {
      case "cancha-isometric-linear":
        return <CanchaLinearIcon size={effectiveSize} className={className} title={accessibleAlt} />;
      case "futbol-linear":
        return <FutbolLinearIcon size={effectiveSize} className={className} title={accessibleAlt} />;
      case "tenis-linear":
        return <TenisLinearIcon size={effectiveSize} className={className} title={accessibleAlt} />;
      case "golf-linear":
        return <GolfLinearIcon size={effectiveSize} className={className} title={accessibleAlt} />;
      case "parques-linear":
        return <ParquesLinearIcon size={effectiveSize} className={className} title={accessibleAlt} />;
      case "paisajismo-linear":
        return <PaisajismoLinearIcon size={effectiveSize} className={className} title={accessibleAlt} />;
      default:
        if (asset.paths.svg) {
          return (
            <img
              src={asset.paths.svg}
              alt={accessibleAlt}
              width={effectiveSize}
              height={effectiveSize}
              className={`inline-block select-none ${className}`}
              loading="lazy"
            />
          );
        }
        return null;
    }
  }

  // 2. High-Performance WebP Illustration Dispatch
  const src = asset.paths.webp || asset.paths.masterPng;
  if (!src) return null;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: effectiveSize, height: effectiveSize }}
    >
      <Image
        src={src}
        alt={accessibleAlt}
        width={effectiveSize}
        height={effectiveSize}
        priority={priority}
        className="w-full h-full object-contain select-none transition-transform duration-300 hover:scale-105"
        sizes={`${effectiveSize}px`}
      />
    </div>
  );
}
