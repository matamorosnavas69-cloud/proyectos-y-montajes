import React from "react";
import { IconProps } from "./types";

/**
 * TenisLinearIcon — High-Impact Vector SVG Icon
 * Bold professional tennis court lines, tensioned net, competition racket, and tennis ball.
 * ViewBox: 0 0 64 64
 */
export default function TenisLinearIcon({
  size = 48,
  className = "",
  title = "Tenis Profesional",
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
      {/* Tennis Court Base & Boundary Lines */}
      <rect
        x="6"
        y="16"
        width="52"
        height="40"
        rx="3"
        fill="#16a34a"
        fillOpacity="0.12"
        stroke="#16a34a"
        strokeWidth="3.2"
      />
      {/* Center Service Court Division */}
      <path d="M6 36 L58 36" stroke="#ca8a04" strokeWidth="3.5" />
      <path d="M32 24 L32 48" stroke="#16a34a" strokeWidth="2.5" />
      <path d="M16 24 L48 24 M16 48 L48 48" stroke="#16a34a" strokeWidth="2.2" />

      {/* Regulation Tennis Ball (Bold Gold & Curved Seams) */}
      <circle cx="48" cy="14" r="10" fill="#ffffff" stroke="#ca8a04" strokeWidth="3" />
      <path d="M42 8 C45 10, 45 18, 42 20 M54 8 C51 10, 51 18, 54 20" stroke="#ca8a04" strokeWidth="2.2" />
    </svg>
  );
}
