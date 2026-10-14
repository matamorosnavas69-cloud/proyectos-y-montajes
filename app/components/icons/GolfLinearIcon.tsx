import React from "react";
import { IconProps } from "./types";

/**
 * GolfLinearIcon — High-Impact Vector SVG Icon
 * Bold putting green contour, cup, flagstick, and golf ball.
 * ViewBox: 0 0 64 64
 */
export default function GolfLinearIcon({
  size = 48,
  className = "",
  title = "Putting Green & Golf",
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
      {/* Green Turf Contour */}
      <path
        d="M8 44 C8 32, 22 28, 36 30 C50 32, 58 40, 56 50 C54 58, 20 60, 10 52 C8 50, 8 47, 8 44 Z"
        stroke="#16a34a"
        strokeWidth="3.2"
        fill="#16a34a"
        fillOpacity="0.12"
      />

      {/* Flagstick & Triangular Banner */}
      <path d="M42 46 L42 10" stroke="#ca8a04" strokeWidth="3.5" />
      <polygon
        points="42,12 24,19 42,26"
        fill="#ca8a04"
        stroke="#ca8a04"
        strokeWidth="2.5"
      />
      
      {/* Hole / Cup */}
      <ellipse cx="42" cy="46" rx="6" ry="3" fill="#15803d" stroke="#16a34a" strokeWidth="2.5" />

      {/* Golf Ball (Bold with dimple marks) */}
      <circle cx="18" cy="42" r="6" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
      <circle cx="17" cy="41" r="1" fill="#16a34a" />
      <circle cx="19" cy="43" r="1" fill="#16a34a" />
      
      {/* Putting path dashed line */}
      <path d="M25 43 C29 44, 33 45, 36 46" stroke="#ca8a04" strokeWidth="2.5" strokeDasharray="3 3" />
    </svg>
  );
}
