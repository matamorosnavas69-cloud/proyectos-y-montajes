import React from "react";
import { IconProps } from "./types";

/**
 * FutbolLinearIcon — Vector SVG Icon for Proyectos y Montajes
 * Represents soccer pitch geometry, goal areas, center circle, and technical ball.
 * ViewBox: 0 0 64 64
 */
export default function FutbolLinearIcon({
  size = 48,
  className = "",
  title = "Icono Fútbol Proyectos y Montajes",
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
      <rect width="48" height="36" x="8" y="16" fill="#0b120d" fillOpacity=".5" stroke="#1b5e20" strokeWidth="1.75" rx="3" />
      <path stroke="#1b5e20" strokeWidth="1.5" d="M32 16v36" />
      <circle cx="32" cy="34" r="6" stroke="#1b5e20" strokeWidth="1.5" />
      <circle cx="32" cy="34" r="1.2" fill="#1b5e20" />
      <path stroke="#1b5e20" strokeWidth="1.25" d="M8 24h8v20H8zM48 24h8v20h-8z" />
      <path fill="#0b120d" stroke="#d4af37" strokeWidth="1.5" d="M4 27h4v14H4zM56 27h4v14h-4z" />
      <circle cx="32" cy="10" r="4.5" fill="#0b120d" stroke="#a3e635" strokeWidth="1.5" />
      <path fill="#a3e635" d="M32 7.5 34 9l-.8 2.4h-2.4L30 9z" />
      <path stroke="#a3e635" strokeWidth=".8" d="M32 7.5v-2M34 9l1.8-1M33.2 11.4l1.6 1.6M30.8 11.4 29.2 13M30 9l-1.8-1" />
    </svg>
  );
}
