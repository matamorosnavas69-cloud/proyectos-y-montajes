import React from "react";
import { IconProps } from "./types";

/**
 * PaisajismoLinearIcon — Vector SVG Icon for Proyectos y Montajes
 * Represents architectural terrace landscaping, modern pergola, synthetic turf fibers, and organic botany.
 * ViewBox: 0 0 64 64
 */
export default function PaisajismoLinearIcon({
  size = 48,
  className = "",
  title = "Icono Paisajismo y Terrazas Proyectos y Montajes",
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
      <path fill="#0b120d" stroke="#d4af37" strokeWidth="1.5" d="m8 50 48-8v6L8 56z" />
      <path stroke="#d4af37" strokeWidth="1.25" d="M20 48v6M32 46v6M44 44v6" />
      <path stroke="#fff" strokeWidth="1.75" d="M14 49V18M50 43V14" />
      <path stroke="#fff" strokeWidth="2" d="m10 18 44-4" />
      <path stroke="#a3e635" strokeWidth="1.25" d="m14 21 36-4M14 24l36-4" opacity=".8" />
      <path fill="#1b5e20" stroke="#a3e635" strokeWidth="1.75" d="M32 44c-12-2-16-16-10-24 6 8 10 16 10 24M32 44c12-4 16-18 8-26-4 8-8 16-8 26" />
      <path stroke="#d4af37" strokeWidth="1.25" d="M32 44V22" />
      <path stroke="#a3e635" strokeWidth="1.5" d="m20 47-3-6m5 6 2-7m18 3-2-6m5 6 3-7" />
    </svg>
  );
}
