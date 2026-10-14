import React from "react";
import { IconProps } from "./types";

/**
 * TenisLinearIcon — Vector SVG Icon for Proyectos y Montajes
 * Represents professional tennis court lines, net division, racket strings, and ball.
 * ViewBox: 0 0 64 64
 */
export default function TenisLinearIcon({
  size = 48,
  className = "",
  title = "Icono Tenis Proyectos y Montajes",
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
      <rect width="44" height="38" x="10" y="20" fill="#16a34a" fillOpacity=".08" stroke="#16a34a" strokeWidth="1.75" rx="2" />
      <path stroke="#15803d" strokeWidth="1.75" d="M8 39h48" />
      <path stroke="#ca8a04" strokeWidth="2" d="M8 39v-3M56 39v-3" />
      <path stroke="#16a34a" strokeWidth="1.25" d="M16 20v38M48 20v38M16 29.5h32M16 48.5h32M32 29.5v19" />
      <g transform="rotate(-35 33.444 -45.246)">
        <ellipse fill="none" stroke="#15803d" strokeWidth="1.75" rx="6.5" ry="8" />
        <path stroke="#15803d" strokeWidth=".8" d="M-3-5.5v11M0-7.5v15M3-5.5v11M-4.5-3h9M-5.5 0h11M-4.5 3h9" opacity=".7" />
        <path stroke="#15803d" strokeWidth="1.5" d="m-2 8 .5 4h3L2 8" />
        <rect width="3" height="8" x="-1.5" y="12" fill="none" stroke="#ca8a04" strokeWidth="1.5" rx=".5" />
      </g>
      <circle cx="48" cy="8" r="3.5" fill="#ca8a04" />
      <path stroke="#15803d" strokeWidth=".75" d="M46 5.5c1.2 1 1.2 4 0 5m4-5c-1.2 1-1.2 4 0 5" />
    </svg>
  );
}
