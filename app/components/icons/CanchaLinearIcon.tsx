import React from "react";
import { IconProps } from "./types";

/**
 * CanchaLinearIcon — High-Impact Vector SVG Icon
 * Multi-layer engineering cutaway: Turf, Shockpad, Concrete/Drainage sub-base.
 * ViewBox: 0 0 64 64
 */
export default function CanchaLinearIcon({
  size = 48,
  className = "",
  title = "Ingeniería de Superficies Deportivas",
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
      {/* Top Layer: Synthetic Turf Surface (Isometric Slab) */}
      <polygon
        points="32,8 56,20 32,32 8,20"
        fill="#16a34a"
        fillOpacity="0.2"
        stroke="#16a34a"
        strokeWidth="3.2"
      />
      {/* Court Center Line */}
      <path d="M20 26 L44 14" stroke="#16a34a" strokeWidth="2.2" />
      <ellipse cx="32" cy="20" rx="4" ry="2" stroke="#16a34a" strokeWidth="2" />

      {/* Middle Layer: Elastic Shockpad */}
      <path
        d="M8 20 L8 28 L32 40 L56 28 L56 20"
        stroke="#ca8a04"
        strokeWidth="3"
        fill="#ca8a04"
        fillOpacity="0.15"
      />
      <path d="M32 32 L32 40" stroke="#ca8a04" strokeWidth="3" />

      {/* Bottom Layer: Stabilized Concrete / Drainage Sub-base */}
      <path
        d="M8 32 L8 44 L32 56 L56 44 L56 32"
        stroke="#15803d"
        strokeWidth="3.2"
        fill="#15803d"
        fillOpacity="0.1"
      />
      <path d="M32 44 L32 56" stroke="#15803d" strokeWidth="3.2" />

      {/* Foundation Depth Arrows / Drainage Tick Marks */}
      <path d="M16 46 L20 48 M40 50 L44 48" stroke="#ca8a04" strokeWidth="2.5" />
    </svg>
  );
}
