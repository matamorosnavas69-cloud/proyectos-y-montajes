import React from "react";
import { IconProps } from "./types";

/**
 * PaisajismoLinearIcon — High-Impact Vector SVG Icon
 * Bold modern architectural pergola and organic botanical leaves.
 * ViewBox: 0 0 64 64
 */
export default function PaisajismoLinearIcon({
  size = 48,
  className = "",
  title = "Paisajismo & Terrazas",
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
      {/* Modern Pergola Beam & Posts */}
      <path d="M6 16 L58 16" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 16 L12 56 M52 16 L52 56" stroke="#ca8a04" strokeWidth="3.5" />
      <path d="M22 16 L22 22 M32 16 L32 22 M42 16 L42 22" stroke="#ca8a04" strokeWidth="2.5" />

      {/* Prominent Botanical Monstera Leaf (Vibrant Green) */}
      <path
        d="M32 24 C22 24, 16 34, 18 48 C28 50, 42 46, 44 32 C44 26, 38 24, 32 24 Z"
        fill="#16a34a"
        fillOpacity="0.18"
        stroke="#16a34a"
        strokeWidth="3.2"
      />
      {/* Leaf Central Vein and Leaflets */}
      <path d="M22 46 C28 38, 32 30, 36 26" stroke="#15803d" strokeWidth="2.5" />
      <path d="M26 38 C32 36, 38 38, 40 40" stroke="#15803d" strokeWidth="2" />
      <path d="M28 32 C34 30, 38 32, 42 32" stroke="#15803d" strokeWidth="2" />

      {/* Deck / Ground Foundation Line */}
      <path d="M4 56 L60 56" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
