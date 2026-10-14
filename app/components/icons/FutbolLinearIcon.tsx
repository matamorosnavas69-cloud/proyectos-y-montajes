import React from "react";
import { IconProps } from "./types";

/**
 * FutbolLinearIcon — High-Impact Vector SVG Icon
 * Bold soccer goal and regulation football.
 * ViewBox: 0 0 64 64
 */
export default function FutbolLinearIcon({
  size = 48,
  className = "",
  title = "Fútbol Profesional",
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
      {/* Goal Post Frame (Bold Green) */}
      <path
        d="M8 52 L8 22 L40 22 L40 52"
        stroke="#16a34a"
        strokeWidth="3.5"
      />
      {/* Goal Net Depth */}
      <path
        d="M8 22 L18 12 L50 12 L40 22 M50 12 L50 42 L40 52"
        stroke="#16a34a"
        strokeWidth="2.5"
        strokeOpacity="0.7"
      />
      {/* Net Grid Lines */}
      <path d="M18 22 L24 12 M28 22 L34 12 M38 22 L44 12" stroke="#16a34a" strokeWidth="1.75" strokeOpacity="0.5" />
      <path d="M40 32 L50 22 M40 42 L50 32" stroke="#16a34a" strokeWidth="1.75" strokeOpacity="0.5" />

      {/* Regulation Soccer Ball (Bold Gold & Green) */}
      <circle cx="44" cy="42" r="14" fill="#ffffff" stroke="#ca8a04" strokeWidth="3.5" />
      {/* Center Pentagon */}
      <polygon
        points="44,36 49,40 47,46 41,46 39,40"
        fill="#ca8a04"
      />
      {/* Radiating seam lines */}
      <path d="M44 36 L44 30 M49 40 L55 42 M47 46 L51 52 M41 46 L37 52 M39 40 L33 42" stroke="#ca8a04" strokeWidth="2.5" />
    </svg>
  );
}
