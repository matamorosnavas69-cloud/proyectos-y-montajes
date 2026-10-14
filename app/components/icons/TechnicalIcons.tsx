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
