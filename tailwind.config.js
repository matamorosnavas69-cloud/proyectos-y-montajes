/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0b120d", // Dark background
          green: "#1b5e20", // Primary green identity
          gold: "#d4af37", // Accent gold identity
          light: "#f7f9f7", // Off-white clean background
          accent: "#86a9af", // From cms-design
          danger: "#ec6602", // From cms-design
          success: "#80bd9a", // From cms-design
        },
        surface: "#000000",
        background: "#313131",
        border: "#4d4d4d",
      },
      spacing: {
        4: "4px",
        6: "6px",
        8: "8px",
        10: "10px",
        12: "12px",
        16: "16px",
        18: "18px",
        22: "22px",
        24: "24px",
        32: "32px",
        36: "36px",
        40: "40px",
        44: "44px",
        48: "48px",
        // Semantic responsive spacing tokens
        "section-gap": "clamp(3rem, 6vw, 6rem)",
        "section-gap-sm": "clamp(2rem, 4vw, 3.5rem)",
        "container-px": "clamp(1rem, 3vw, 2.5rem)",
        "card-p": "clamp(1.25rem, 2.5vw, 2rem)",
      },
      fontSize: {
        // Pixel-named backward compatibility classes
        10: ["10px", { lineHeight: "14px" }],
        11: ["11px", { lineHeight: "15px" }],
        12: ["12px", { lineHeight: "16px" }],
        13: ["13px", { lineHeight: "18px" }],
        14: ["14px", { lineHeight: "20px" }],
        15: ["15px", { lineHeight: "22px" }],
        16: ["16px", { lineHeight: "24px" }],
        18: ["18px", { lineHeight: "26px" }],
        20: ["20px", { lineHeight: "28px" }],
        22: ["22px", { lineHeight: "30px" }],
        24: ["24px", { lineHeight: "32px" }],
        28: ["28px", { lineHeight: "36px" }],
        32: ["32px", { lineHeight: "40px" }],
        36: ["36px", { lineHeight: "44px" }],
        40: ["40px", { lineHeight: "48px" }],
        48: ["48px", { lineHeight: "1.15" }],
        56: ["56px", { lineHeight: "1.1" }],
        64: ["64px", { lineHeight: "1.05" }],
        72: ["72px", { lineHeight: "1.05" }],
        // Semantic design scale
        display: ["clamp(2.5rem, 5vw + 1rem, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "heading-1": ["clamp(2rem, 4vw + 0.5rem, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "heading-2": ["clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-3": ["clamp(1.25rem, 1.5vw + 0.5rem, 1.625rem)", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body-base": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        xl: "16px",
        "3xl": "60px",
        full: "100px",
      },
      boxShadow: {
        flat: "rgba(0, 0, 0, 0.2) 0px 1px 2px 0px",
        "glow-gold": "0 0 40px rgba(212, 175, 55, 0.15)",
        "glow-green": "0 0 40px rgba(27, 94, 32, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.7s ease-out forwards",
        "fade-in-down": "fadeInDown 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
