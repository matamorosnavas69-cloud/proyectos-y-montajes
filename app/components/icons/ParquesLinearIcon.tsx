import React from "react";
import { IconProps } from "./types";

/**
 * ParquesLinearIcon — Vector SVG Icon for Proyectos y Montajes
 * Represents recreational playground infrastructure: tower, wave slide, climbing ladder, and safety surface.
 * ViewBox: 0 0 64 64
 */
export default function ParquesLinearIcon({
  size = 48,
  className = "",
  title = "Icono Parques Infantiles Proyectos y Montajes",
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
      <rect width="48" height="6" x="8" y="52" fill="#0b120d" stroke="#d4af37" strokeWidth="1.5" rx="2" />
      <path stroke="#a3e635" d="M8 54h48" opacity=".6" />
      <path fill="#0b120d" stroke="#a3e635" strokeWidth="1.75" d="M14 24h16v28H14z" />
      <path fill="#1b5e20" stroke="#a3e635" strokeWidth="2" d="m12 24 10-14 10 14z" />
      <circle cx="22" cy="18" r="2" fill="#d4af37" />
      <path stroke="#fff" strokeWidth="1.25" d="M14 36h16" />
      <path stroke="#fff" d="M18 36v16M22 36v16M26 36v16" />
      <path stroke="#d4af37" strokeWidth="2.5" d="M30 36c4 0 6 3 8 7s4 6 8 6h3" />
      <path stroke="#a3e635" strokeWidth="1.5" d="M30 39c3 0 5 3 7 7s4 5 7 5h4M10 36v16" />
      <path stroke="#a3e635" strokeWidth="1.25" d="M10 40h4M10 44h4M10 48h4" />
      <circle cx="48" cy="16" r="4" fill="#d4af37" opacity=".9" />
      <path stroke="#d4af37" strokeWidth="1.25" d="M48 9v2m0 10v2m-7-7h2m10 0h2" />
    </svg>
  );
}
