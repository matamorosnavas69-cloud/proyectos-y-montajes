import React from "react";
import { IconProps } from "./types";

/**
 * ParquesLinearIcon — High-Impact Vector SVG Icon
 * Bold playground castle tower, wave slide, ladder, and safety surface.
 * ViewBox: 0 0 64 64
 */
export default function ParquesLinearIcon({
  size = 48,
  className = "",
  title = "Parques Infantiles",
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
      {/* Tower Roof (Triangular Canopy) */}
      <polygon
        points="22,6 8,22 36,22"
        fill="#ca8a04"
        fillOpacity="0.2"
        stroke="#ca8a04"
        strokeWidth="3.2"
      />
      <circle cx="22" cy="5" r="2.5" fill="#ca8a04" />

      {/* Main Play Tower Frame */}
      <rect
        x="12"
        y="22"
        width="20"
        height="34"
        fill="#16a34a"
        fillOpacity="0.1"
        stroke="#16a34a"
        strokeWidth="3.2"
        rx="2"
      />
      {/* Guard Rail / Window */}
      <rect x="16" y="28" width="12" height="12" stroke="#16a34a" strokeWidth="2.5" rx="1" />
      <path d="M22 28 L22 40" stroke="#16a34a" strokeWidth="2" />

      {/* Climbing Ladder on Left */}
      <path d="M6 34 L6 56 M12 34 L12 56" stroke="#15803d" strokeWidth="2.5" />
      <path d="M6 38 L12 38 M6 44 L12 44 M6 50 L12 50" stroke="#15803d" strokeWidth="2.5" />

      {/* Dynamic Wave Slide on Right */}
      <path
        d="M32 38 C38 38, 42 42, 45 46 C48 50, 52 54, 58 54"
        stroke="#ca8a04"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M32 43 C37 43, 40 46, 43 49 C46 52, 49 56, 56 56"
        stroke="#ca8a04"
        strokeWidth="2.5"
        strokeOpacity="0.5"
      />

      {/* Ground EPDM Safety Line */}
      <path d="M4 58 L60 58" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
