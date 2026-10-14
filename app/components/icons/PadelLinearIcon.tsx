import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  title?: string;
}

/**
 * PadelLinearIcon — High-Impact Vector SVG Icon
 * Bold, professional silhouette of a competition padel racket and ball.
 * ViewBox: 0 0 64 64
 */
export default function PadelLinearIcon({
  size = 48,
  className = "",
  title = "Pádel Profesional",
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
      {/* Racket Head (Ovoid teardrop) */}
      <path
        d="M24 6 C35 6, 46 14, 46 27 C46 38, 38 45, 30 46 L26 58 C25.5 59.5, 23.5 60.5, 21.5 60 C19.5 59.5, 18.5 57.5, 19 55.5 L22 44 C15 41, 10 34, 10 25 C10 14, 16 6, 24 6 Z"
        stroke="#16a34a"
        strokeWidth="3.2"
        fill="#16a34a"
        fillOpacity="0.12"
      />
      
      {/* Handle Grip Details */}
      <path d="M21 48 L27 50 M20 53 L26 55" stroke="#15803d" strokeWidth="2.5" />
      
      {/* Perforations (Bold, highly legible grid) */}
      <circle cx="24" cy="20" r="2.2" fill="#15803d" />
      <circle cx="32" cy="22" r="2.2" fill="#15803d" />
      <circle cx="22" cy="28" r="2.2" fill="#15803d" />
      <circle cx="30" cy="30" r="2.2" fill="#15803d" />
      <circle cx="38" cy="28" r="2.2" fill="#15803d" />
      <circle cx="28" cy="37" r="2.2" fill="#15803d" />

      {/* Golden Padel Ball */}
      <circle cx="50" cy="16" r="8" fill="#ca8a04" fillOpacity="0.2" stroke="#ca8a04" strokeWidth="3" />
      <path d="M45 11 C48 13, 48 19, 45 21 M55 11 C52 13, 52 19, 55 21" stroke="#ca8a04" strokeWidth="2" />
    </svg>
  );
}
