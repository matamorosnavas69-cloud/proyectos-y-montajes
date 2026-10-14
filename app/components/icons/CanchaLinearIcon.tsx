import React from "react";
import { IconProps } from "./types";

/**
 * CanchaLinearIcon — Vector SVG Icon for Proyectos y Montajes
 * Represents multi-layer sports court engineering, isometric pitch geometry, and turf drainage.
 * ViewBox: 0 0 64 64
 */
export default function CanchaLinearIcon({
  size = 48,
  className = "",
  title = "Ingeniería de Canchas Deportivas",
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label={title}
      role={title ? "img" : undefined}
      aria-hidden={!title}
      {...props}
    >
      {/* Dynamic foundation aura */}
      <ellipse
        cx="32"
        cy="32"
        rx="22"
        ry="14"
        stroke="#84cc16"
        strokeWidth="1.75"
        strokeDasharray="3 3"
        opacity=".5"
      />

      {/* Layer 3 - Base compactada & drenaje profundo (Gold accent) */}
      <path
        stroke="#d4af37"
        strokeWidth="1.5"
        d="m11 39 21 10.5L53 39M11 39v3M32 49.5v3M53 39v3"
        opacity=".6"
      />
      <path stroke="#d4af37" strokeWidth="1.5" d="m11 42 21 10.5L53 42" opacity=".6" />

      {/* Layer 2 - Geotextil y sub-base técnica */}
      <path
        stroke="#ca8a04"
        strokeWidth="1.5"
        d="M11 34.5 32 45l21-10.5M11 34.5v3M32 45v3M53 34.5v3"
        opacity=".8"
      />

      {/* Layer 1 - Shockpad elástico (Lime green) */}
      <path stroke="#16a34a" strokeWidth="1.75" d="m11 30 21 10.5L53 30M11 30v3M32 40.5v3M53 30v3" />

      {/* Surface - Grama sintética monofilamento con relleno de arena */}
      <path
        fill="#15803d"
        fillOpacity=".85"
        stroke="#166534"
        strokeWidth="2"
        d="m32 15 21 10.5L32 36 11 25.5z"
      />

      {/* Pitch markings */}
      <path stroke="#ffffff" strokeWidth="1.25" d="m21.5 20.25 21 10.5" />
      <ellipse cx="32" cy="25.5" rx="5" ry="2.6" stroke="#ffffff" strokeWidth="1.25" />
      <path stroke="#ffffff" strokeWidth="1.2" d="m16 23 6-3 3 1.5-6 3M45 32.5l-6 3 3 1.5 6-3" />
      <path stroke="#ffffff" strokeWidth="1.5" d="M14 24v-2M50 33.5v-2" />
    </svg>
  );
}
