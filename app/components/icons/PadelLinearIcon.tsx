import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  title?: string;
}

/**
 * PadelLinearIcon — Vector SVG Icon for Proyectos y Montajes
 * Optimized, pure geometric paths representing crossed padel rackets, ball, and court geometry.
 * ViewBox: 0 0 64 64
 */
export default function PadelLinearIcon({
  size = 48,
  className = "",
  title = "Icono Pádel Proyectos y Montajes",
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
      {/* Court foundation boundary */}
      <rect
        width="44"
        height="34"
        x="10"
        y="24"
        fill="#0b120d"
        fillOpacity=".5"
        stroke="#1b5e20"
        strokeWidth="1.75"
        rx="3"
      />
      <path stroke="#1b5e20" strokeWidth="1.5" d="M32 24v34M10 44c6 0 10 4 10 14M54 44c-6 0-10 4-10 14" />

      {/* Padel ball with optic curves */}
      <circle cx="32" cy="7" r="3.75" fill="#a3e635" />
      <path stroke="#0b120d" strokeWidth=".85" d="M30 4.2c1.2 1 1.2 4.6 0 5.6M34 4.2c-1.2 1-1.2 4.6 0 5.6" />

      {/* Racket 1 (Left tilted, White Accent) */}
      <path fill="#0b120d" stroke="#fff" strokeWidth="2" d="M32.26 34.26 35 33.04l6.51 14.62-2.75 1.22z" />
      <circle cx="40.74" cy="49.64" r="1.75" fill="#fff" />
      <path stroke="#fff" strokeWidth="1.2" d="m33.88 37.92 3.15-.31M35.31 41.12l3.14-.31M36.73 44.31l3.15-.3M37.95 47.05l3.15-.3" opacity=".6" />
      <path fill="#0b120d" fillOpacity=".85" stroke="#fff" strokeWidth="2.25" d="M23.26 10.36c9.18-.26 13.4 5.52 11.58 16.19L32 30l-4.47-.2c-9.14-5.78-10.62-12.79-4.27-19.44" />
      <path fill="#0b120d" stroke="#fff" strokeWidth="1.5" d="m28.85 30.31 5.48-2.44-.7 5.78z" />
      <circle cx="20.52" cy="16.5" r=".9" fill="#fff" />
      <circle cx="25.09" cy="14.47" r=".9" fill="#fff" />
      <circle cx="29.65" cy="12.44" r=".9" fill="#fff" />
      <circle cx="20.11" cy="20.51" r=".9" fill="#fff" />
      <circle cx="23.31" cy="19.09" r=".9" fill="#fff" />
      <circle cx="26.51" cy="17.67" r=".9" fill="#fff" />
      <circle cx="29.71" cy="16.24" r=".9" fill="#fff" />
      <circle cx="32.9" cy="14.82" r=".9" fill="#fff" />
      <circle cx="21.54" cy="23.71" r=".9" fill="#fff" />
      <circle cx="24.74" cy="22.29" r=".9" fill="#fff" />
      <circle cx="27.93" cy="20.86" r=".9" fill="#fff" />
      <circle cx="31.13" cy="19.44" r=".9" fill="#fff" />
      <circle cx="34.33" cy="18.02" r=".9" fill="#fff" />
      <circle cx="24.79" cy="26.1" r=".9" fill="#fff" />
      <circle cx="29.36" cy="24.06" r=".9" fill="#fff" />
      <circle cx="33.92" cy="22.03" r=".9" fill="#fff" />

      {/* Racket 2 (Right tilted, Lime Green Accent) */}
      <path fill="#0b120d" stroke="#a3e635" strokeWidth="2" d="m29 33.04 2.74 1.22-6.5 14.62-2.75-1.22z" />
      <circle cx="23.26" cy="49.64" r="1.75" fill="#a3e635" />
      <path stroke="#a3e635" strokeWidth="1.2" d="m27.38 36.7 2.33 2.13M25.95 39.9l2.34 2.13M24.53 43.09l2.33 2.14M23.31 45.83l2.33 2.14" opacity=".6" />
      <path fill="#0b120d" fillOpacity=".85" stroke="#a3e635" strokeWidth="2.25" d="M40.74 10.36c6.35 6.65 4.87 13.66-4.27 19.44L32 30l-2.84-3.45c-1.82-10.67 2.4-16.45 11.58-16.19" />
      <path fill="#0b120d" stroke="#a3e635" strokeWidth="1.5" d="m29.67 27.87 5.48 2.44-4.78 3.34z" />
      <circle cx="34.35" cy="12.44" r=".9" fill="#a3e635" />
      <circle cx="38.91" cy="14.47" r=".9" fill="#a3e635" />
      <circle cx="43.48" cy="16.5" r=".9" fill="#a3e635" />
      <circle cx="31.1" cy="14.82" r=".9" fill="#a3e635" />
      <circle cx="34.29" cy="16.24" r=".9" fill="#a3e635" />
      <circle cx="37.49" cy="17.67" r=".9" fill="#a3e635" />
      <circle cx="40.69" cy="19.09" r=".9" fill="#a3e635" />
      <circle cx="43.89" cy="20.51" r=".9" fill="#a3e635" />
      <circle cx="29.67" cy="18.02" r=".9" fill="#a3e635" />
      <circle cx="32.87" cy="19.44" r=".9" fill="#a3e635" />
      <circle cx="36.07" cy="20.86" r=".9" fill="#a3e635" />
      <circle cx="39.26" cy="22.29" r=".9" fill="#a3e635" />
      <circle cx="42.46" cy="23.71" r=".9" fill="#a3e635" />
      <circle cx="30.08" cy="22.03" r=".9" fill="#a3e635" />
      <circle cx="34.64" cy="24.06" r=".9" fill="#a3e635" />
      <circle cx="39.21" cy="26.1" r=".9" fill="#a3e635" />
    </svg>
  );
}
