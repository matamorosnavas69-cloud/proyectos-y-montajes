import React from "react";
import { IconProps } from "./types";

/**
 * ShieldSafetyIcon — High-Impact Vector SVG Icon for Structural Safety & Certifications
 * ViewBox: 0 0 64 64
 */
export function ShieldSafetyIcon({
  size = 48,
  className = "",
  title = "Seguridad Certificada",
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
      <path
        d="M32 6 L52 14 C52 36, 42 50, 32 58 C22 50, 12 36, 12 14 Z"
        fill="#16a34a"
        fillOpacity="0.12"
        stroke="#16a34a"
        strokeWidth="3.5"
      />
      {/* Checkmark inside */}
      <path d="M22 32 L29 39 L43 23" stroke="#ca8a04" strokeWidth="4" />
    </svg>
  );
}

/**
 * FloorShockpadIcon — High-Impact Vector SVG Icon for Continuous EPDM & Fall Protection
 * ViewBox: 0 0 64 64
 */
export function FloorShockpadIcon({
  size = 48,
  className = "",
  title = "Piso Amortiguante Continuo",
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
      {/* Isometric Floor Slab */}
      <polygon
        points="32,10 56,22 32,34 8,22"
        fill="#ca8a04"
        fillOpacity="0.2"
        stroke="#ca8a04"
        strokeWidth="3.2"
      />
      {/* Impact Wave Rings on Top */}
      <ellipse cx="32" cy="22" rx="8" ry="4" stroke="#16a34a" strokeWidth="2.5" />
      <circle cx="32" cy="22" r="2" fill="#16a34a" />
      
      {/* Sub-base Cushion Thickness */}
      <path d="M8 22 L8 34 L32 46 L56 34 L56 22" stroke="#ca8a04" strokeWidth="3" />
      <path d="M8 34 L8 44 L32 56 L56 44 L56 34" stroke="#15803d" strokeWidth="3.2" />
      <path d="M32 34 L32 56" stroke="#ca8a04" strokeWidth="3" />
    </svg>
  );
}

/**
 * ModularCastleIcon — High-Impact Vector SVG Icon for Modular Configurable Play Systems
 * ViewBox: 0 0 64 64
 */
export function ModularCastleIcon({
  size = 48,
  className = "",
  title = "Sistemas Modulares",
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
      {/* 4 Interconnected Modular Cubes */}
      <rect x="10" y="10" width="18" height="18" rx="3" fill="#16a34a" fillOpacity="0.15" stroke="#16a34a" strokeWidth="3.2" />
      <rect x="36" y="10" width="18" height="18" rx="3" fill="#ca8a04" fillOpacity="0.15" stroke="#ca8a04" strokeWidth="3.2" />
      <rect x="10" y="36" width="18" height="18" rx="3" fill="#ca8a04" fillOpacity="0.15" stroke="#ca8a04" strokeWidth="3.2" />
      <rect x="36" y="36" width="18" height="18" rx="3" fill="#16a34a" fillOpacity="0.15" stroke="#16a34a" strokeWidth="3.2" />
      
      {/* Connecting nodes */}
      <path d="M28 19 L36 19 M19 28 L19 36 M45 28 L45 36 M28 45 L36 45" stroke="#15803d" strokeWidth="3" />
    </svg>
  );
}

/**
 * EcoWaterDropIcon — Zero Irrigation and Water Efficiency
 * ViewBox: 0 0 64 64
 */
export function EcoWaterDropIcon({
  size = 48,
  className = "",
  title = "Cero Riego & Ahorro Hídrico",
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
      {/* Water Drop with Green Eco Leaf Accent */}
      <path
        d="M32 8 C32 8, 14 28, 14 42 C14 52, 22 58, 32 58 C42 58, 50 52, 50 42 C50 28, 32 8, 32 8 Z"
        fill="#16a34a"
        fillOpacity="0.12"
        stroke="#16a34a"
        strokeWidth="3.5"
      />
      {/* Inner Eco Leaf Cutout */}
      <path
        d="M32 24 C26 32, 26 42, 34 46 C40 44, 40 34, 32 24 Z"
        fill="#ca8a04"
        fillOpacity="0.25"
        stroke="#ca8a04"
        strokeWidth="2.5"
      />
      <path d="M30 46 L34 26" stroke="#ca8a04" strokeWidth="2.2" />
    </svg>
  );
}

/**
 * SunShieldIcon — UV Protection & Color Longevity
 * ViewBox: 0 0 64 64
 */
export function SunShieldIcon({
  size = 48,
  className = "",
  title = "Protección UV Certificada",
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
      {/* Central Sun Shield */}
      <circle cx="32" cy="32" r="14" fill="#ca8a04" fillOpacity="0.2" stroke="#ca8a04" strokeWidth="3.5" />
      {/* UV Text / Emblem in Center */}
      <path d="M26 26 L26 34 C26 37, 28 38, 30 38 C32 38, 34 37, 34 34 L34 26" stroke="#16a34a" strokeWidth="3" />
      <path d="M38 26 L42 38 L46 26" stroke="#16a34a" strokeWidth="3" />

      {/* Sun Rays */}
      <path d="M32 6 L32 12 M32 52 L32 58 M6 32 L12 32 M52 32 L58 32" stroke="#ca8a04" strokeWidth="3.5" />
      <path d="M14 14 L18 18 M46 46 L50 50 M14 50 L18 46 M46 18 L50 14" stroke="#ca8a04" strokeWidth="3" />
    </svg>
  );
}

/**
 * PetFriendlyIcon — Safe for Kids and 100% Pet-Friendly
 * ViewBox: 0 0 64 64
 */
export function PetFriendlyIcon({
  size = 48,
  className = "",
  title = "Pet-Friendly & Seguro para Niños",
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
      {/* Main Paw Pad (Heart-rounded shape) */}
      <path
        d="M24 38 C20 38, 16 44, 20 50 C24 56, 40 56, 44 50 C48 44, 44 38, 40 38 C36 38, 34 42, 32 42 C30 42, 28 38, 24 38 Z"
        fill="#ca8a04"
        fillOpacity="0.2"
        stroke="#ca8a04"
        strokeWidth="3.2"
      />
      {/* 4 Toe Pads */}
      <circle cx="16" cy="30" r="5" fill="#16a34a" fillOpacity="0.2" stroke="#16a34a" strokeWidth="3" />
      <circle cx="26" cy="20" r="5.5" fill="#16a34a" fillOpacity="0.2" stroke="#16a34a" strokeWidth="3" />
      <circle cx="38" cy="20" r="5.5" fill="#16a34a" fillOpacity="0.2" stroke="#16a34a" strokeWidth="3" />
      <circle cx="48" cy="30" r="5" fill="#16a34a" fillOpacity="0.2" stroke="#16a34a" strokeWidth="3" />
    </svg>
  );
}

/**
 * DrainageFlowIcon — High Speed Pluvial Drainage (60L/min)
 * ViewBox: 0 0 64 64
 */
export function DrainageFlowIcon({
  size = 48,
  className = "",
  title = "Drenaje Pluvial Continuo",
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
      {/* Surface Drainage Grate */}
      <rect x="8" y="10" width="48" height="12" rx="3" fill="#16a34a" fillOpacity="0.15" stroke="#16a34a" strokeWidth="3.2" />
      <path d="M18 10 L18 22 M28 10 L28 22 M38 10 L38 22 M48 10 L48 22" stroke="#16a34a" strokeWidth="2.5" />

      {/* Downward Flow Hydro Streams */}
      <path d="M20 28 C20 34, 16 38, 20 44 C24 50, 20 54, 20 58" stroke="#ca8a04" strokeWidth="3.2" />
      <path d="M32 28 C32 34, 28 38, 32 44 C36 50, 32 54, 32 58" stroke="#ca8a04" strokeWidth="3.5" />
      <path d="M44 28 C44 34, 40 38, 44 44 C48 50, 44 54, 44 58" stroke="#ca8a04" strokeWidth="3.2" />
    </svg>
  );
}

/**
 * PadelSportsIcon — High-Impact Vector SVG Icon for Competition Padel Courts
 * ViewBox: 0 0 64 64
 */
export function PadelSportsIcon({
  size = 48,
  className = "",
  title = "Pistas de Pádel Panorámicas",
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
      {/* Tempered Glass Perimeter Structure */}
      <rect
        x="6"
        y="8"
        width="52"
        height="48"
        rx="4"
        fill="#16a34a"
        fillOpacity="0.12"
        stroke="#16a34a"
        strokeWidth="3.5"
      />
      {/* Panoramic Glass Net Division */}
      <path d="M6 32 L58 32" stroke="#ca8a04" strokeWidth="3.5" />
      <path d="M32 8 L32 56" stroke="#16a34a" strokeWidth="2.5" />

      {/* Racket Silhouette */}
      <circle cx="21" cy="21" r="7" fill="#15803d" fillOpacity="0.25" stroke="#15803d" strokeWidth="2.5" />
      <path d="M26 26 L31 31" stroke="#15803d" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="21" cy="21" r="1.5" fill="#15803d" />

      {/* Golden Padel Ball with Curves */}
      <circle cx="43" cy="43" r="8" fill="#ca8a04" fillOpacity="0.25" stroke="#ca8a04" strokeWidth="3.2" />
      <path d="M38 38 C41 40, 41 46, 38 48 M48 38 C45 40, 45 46, 48 48" stroke="#ca8a04" strokeWidth="2" />
    </svg>
  );
}

/**
 * FutbolSportsIcon — High-Impact Vector SVG Icon for FIFA Soccer Pitches & Continuous Drainage
 * ViewBox: 0 0 64 64
 */
export function FutbolSportsIcon({
  size = 48,
  className = "",
  title = "Canchas de Fútbol Sintético FIFA",
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
      {/* Full Pitch Boundary */}
      <rect
        x="6"
        y="8"
        width="52"
        height="48"
        rx="4"
        fill="#16a34a"
        fillOpacity="0.12"
        stroke="#16a34a"
        strokeWidth="3.5"
      />
      {/* Goal Area Box & Penalty Arc */}
      <path d="M6 18 L20 18 L20 46 L6 46" stroke="#16a34a" strokeWidth="2.5" />
      <path d="M20 26 C25 28, 25 36, 20 38" stroke="#16a34a" strokeWidth="2.5" />

      {/* Center Line */}
      <path d="M58 8 L58 56" stroke="#16a34a" strokeWidth="2.5" />

      {/* Regulation Soccer Ball (Bold Gold & White) */}
      <circle cx="39" cy="32" r="13" fill="#ffffff" stroke="#ca8a04" strokeWidth="3.5" />
      <polygon points="39,25 45,29 43,36 35,36 33,29" fill="#ca8a04" />
      <path d="M39 25 L39 19 M45 29 L51 31 M43 36 L47 43 M35 36 L31 43 M33 29 L27 31" stroke="#ca8a04" strokeWidth="2.2" />
    </svg>
  );
}

/**
 * GolfSportsIcon — High-Impact Vector SVG Icon for Precision Putting Greens
 * ViewBox: 0 0 64 64
 */
export function GolfSportsIcon({
  size = 48,
  className = "",
  title = "Putting Greens de Golf",
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
      {/* Green Turf Organic Contour */}
      <path
        d="M6 38 C6 22, 20 12, 38 14 C54 16, 58 30, 56 46 C54 56, 24 58, 10 52 C6 50, 6 44, 6 38 Z"
        fill="#16a34a"
        fillOpacity="0.14"
        stroke="#16a34a"
        strokeWidth="3.5"
      />

      {/* Flagstick & Gold Triangle Flag */}
      <path d="M42 46 L42 8" stroke="#ca8a04" strokeWidth="3.5" />
      <polygon points="42,10 22,18 42,26" fill="#ca8a04" stroke="#ca8a04" strokeWidth="2.5" />

      {/* Hole / Cup */}
      <ellipse cx="42" cy="46" rx="7" ry="3.5" fill="#15803d" stroke="#16a34a" strokeWidth="2.5" />

      {/* Golf Ball with Dimples */}
      <circle cx="18" cy="40" r="7" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
      <circle cx="17" cy="39" r="1" fill="#16a34a" />
      <circle cx="19" cy="41" r="1" fill="#16a34a" />

      {/* Putting Trajectory Path */}
      <path d="M25 41 C30 43, 34 45, 38 46" stroke="#ca8a04" strokeWidth="2.5" strokeDasharray="3 3" />
    </svg>
  );
}

/**
 * CanchaEngineeringIcon — High-Impact Vector SVG Icon for Sub-base & Shockpad Engineering
 * ViewBox: 0 0 64 64
 */
export function CanchaEngineeringIcon({
  size = 48,
  className = "",
  title = "Ingeniería de Sub-base y Shockpad",
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
      {/* Top Layer: Synthetic Turf Surface (Isometric Slab) */}
      <polygon
        points="32,8 56,20 32,32 8,20"
        fill="#16a34a"
        fillOpacity="0.25"
        stroke="#16a34a"
        strokeWidth="3.5"
      />
      <path d="M20 26 L44 14" stroke="#16a34a" strokeWidth="2.2" />
      <ellipse cx="32" cy="20" rx="4" ry="2" stroke="#16a34a" strokeWidth="2" />

      {/* Middle Layer: Elastic Shockpad */}
      <path
        d="M8 20 L8 30 L32 42 L56 30 L56 20"
        fill="#ca8a04"
        fillOpacity="0.2"
        stroke="#ca8a04"
        strokeWidth="3.2"
      />
      <path d="M32 32 L32 42" stroke="#ca8a04" strokeWidth="3.2" />

      {/* Bottom Layer: Concrete / Drainage Sub-base */}
      <path
        d="M8 30 L8 44 L32 56 L56 44 L56 30"
        fill="#15803d"
        fillOpacity="0.15"
        stroke="#15803d"
        strokeWidth="3.5"
      />
      <path d="M32 42 L32 56" stroke="#15803d" strokeWidth="3.5" />
    </svg>
  );
}

