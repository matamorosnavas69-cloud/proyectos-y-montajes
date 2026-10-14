import React from "react";
import { IconProps } from "./types";

/**
 * GolfLinearIcon — Vector SVG Icon for Proyectos y Montajes
 * Represents synthetic putting green contours, cup, flagstick, and dimpled golf ball.
 * ViewBox: 0 0 64 64
 */
export default function GolfLinearIcon({
  size = 48,
  className = "",
  title = "Icono Golf Putting Green Proyectos y Montajes",
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
      <path fill="#16a34a" fillOpacity=".08" stroke="#16a34a" strokeWidth="2" d="M12 40c-4-8 2-18 14-20 10-2 22 2 28 8 8 8 4 22-8 26s-26 2-34-14" />
      <path stroke="#15803d" strokeDasharray="2 3" strokeWidth="1.25" d="M18 36c4-6 12-10 22-8 8 2 14 8 16 14" opacity=".5" />
      <ellipse cx="40" cy="42" fill="none" stroke="#ca8a04" strokeWidth="1.5" rx="4.5" ry="2.2" />
      <ellipse cx="40" cy="42" fill="#15803d" rx="2" ry="1" />
      <path stroke="#0b120d" strokeWidth="1.75" d="M40 42V12" />
      <path fill="#ca8a04" stroke="#ca8a04" strokeWidth="1.5" d="m40 12-12 5 12 5z" />
      <circle cx="40" cy="11.5" r="1.2" fill="#ca8a04" />
      <circle cx="22" cy="38" r="3.2" fill="#fff" stroke="#15803d" strokeWidth="1.2" />
      <circle cx="21" cy="37" r=".4" fill="#15803d" />
      <circle cx="23" cy="37" r=".4" fill="#15803d" />
      <circle cx="22" cy="39" r=".4" fill="#15803d" />
      <path stroke="#16a34a" strokeDasharray="1.5 2" strokeWidth="1.25" d="M25 39q7 2 11 2" opacity=".75" />
    </svg>
  );
}
