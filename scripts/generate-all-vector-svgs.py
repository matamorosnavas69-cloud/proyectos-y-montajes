import os
import subprocess

SVG_DIR = "packages/proyectos-y-montajes/public/brand/icons/svg"
os.makedirs(SVG_DIR, exist_ok=True)

# 1. FUTBOL LINEAR
futbol_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Icono Fútbol Proyectos y Montajes">
  <!-- Campo base -->
  <rect x="8" y="16" width="48" height="36" rx="3" fill="#0b120d" fill-opacity="0.5" stroke="#1b5e20" stroke-width="1.75"/>
  <!-- Línea central y círculo -->
  <line x1="32" y1="16" x2="32" y2="52" stroke="#1b5e20" stroke-width="1.5"/>
  <circle cx="32" cy="34" r="6" stroke="#1b5e20" stroke-width="1.5"/>
  <circle cx="32" cy="34" r="1.2" fill="#1b5e20"/>
  <!-- Áreas de portería -->
  <rect x="8" y="24" width="8" height="20" stroke="#1b5e20" stroke-width="1.25"/>
  <rect x="48" y="24" width="8" height="20" stroke="#1b5e20" stroke-width="1.25"/>
  <!-- Porterías exteriores metálicas -->
  <path d="M4 27h4v14H4z" fill="#0b120d" stroke="#d4af37" stroke-width="1.5"/>
  <path d="M56 27h4v14h-4z" fill="#0b120d" stroke="#d4af37" stroke-width="1.5"/>
  <!-- Balón dinámico en esquina superior flotante -->
  <circle cx="32" cy="10" r="4.5" fill="#0b120d" stroke="#a3e635" stroke-width="1.5"/>
  <!-- Pentágono central del balón -->
  <path d="M32 7.5l2 1.5l-0.8 2.4h-2.4l-0.8-2.4z" fill="#a3e635"/>
  <line x1="32" y1="7.5" x2="32" y2="5.5" stroke="#a3e635" stroke-width="0.8"/>
  <line x1="34" y1="9" x2="35.8" y2="8" stroke="#a3e635" stroke-width="0.8"/>
  <line x1="33.2" y1="11.4" x2="34.8" y2="13" stroke="#a3e635" stroke-width="0.8"/>
  <line x1="30.8" y1="11.4" x2="29.2" y2="13" stroke="#a3e635" stroke-width="0.8"/>
  <line x1="30" y1="9" x2="28.2" y2="8" stroke="#a3e635" stroke-width="0.8"/>
</svg>"""

# 2. TENIS LINEAR
tenis_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Icono Tenis Proyectos y Montajes">
  <!-- Pista de tenis -->
  <rect x="10" y="20" width="44" height="38" rx="2" fill="#0b120d" fill-opacity="0.5" stroke="#1b5e20" stroke-width="1.75"/>
  <!-- Red divisoria horizontal -->
  <line x1="8" y1="39" x2="56" y2="39" stroke="#fff" stroke-width="1.75"/>
  <line x1="8" y1="39" x2="8" y2="36" stroke="#d4af37" stroke-width="2"/>
  <line x1="56" y1="39" x2="56" y2="36" stroke="#d4af37" stroke-width="2"/>
  <!-- Pasillos dobles y líneas de saque -->
  <line x1="16" y1="20" x2="16" y2="58" stroke="#1b5e20" stroke-width="1.25"/>
  <line x1="48" y1="20" x2="48" y2="58" stroke="#1b5e20" stroke-width="1.25"/>
  <line x1="16" y1="29.5" x2="48" y2="29.5" stroke="#1b5e20" stroke-width="1.25"/>
  <line x1="16" y1="48.5" x2="48" y2="48.5" stroke="#1b5e20" stroke-width="1.25"/>
  <line x1="32" y1="29.5" x2="32" y2="48.5" stroke="#1b5e20" stroke-width="1.25"/>
  <!-- Raqueta de tenis superior -->
  <g transform="translate(32, 11) rotate(-35)">
    <!-- Cabeza oval -->
    <ellipse cx="0" cy="0" rx="6.5" ry="8" fill="#0b120d" stroke="#a3e635" stroke-width="1.75"/>
    <!-- Cordaje simétrico -->
    <line x1="-3" y1="-5.5" x2="-3" y2="5.5" stroke="#a3e635" stroke-width="0.8" opacity="0.7"/>
    <line x1="0" y1="-7.5" x2="0" y2="7.5" stroke="#a3e635" stroke-width="0.8" opacity="0.7"/>
    <line x1="3" y1="-5.5" x2="3" y2="5.5" stroke="#a3e635" stroke-width="0.8" opacity="0.7"/>
    <line x1="-4.5" y1="-3" x2="4.5" y2="-3" stroke="#a3e635" stroke-width="0.8" opacity="0.7"/>
    <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#a3e635" stroke-width="0.8" opacity="0.7"/>
    <line x1="-4.5" y1="3" x2="4.5" y2="3" stroke="#a3e635" stroke-width="0.8" opacity="0.7"/>
    <!-- Cuello y empuñadura -->
    <path d="M-2 8L-1.5 12H1.5L2 8" stroke="#a3e635" stroke-width="1.5"/>
    <rect x="-1.5" y="12" width="3" height="8" rx="0.5" fill="#0b120d" stroke="#fff" stroke-width="1.5"/>
  </g>
  <!-- Pelota de tenis con costuras -->
  <circle cx="48" cy="8" r="3.5" fill="#a3e635"/>
  <path d="M46 5.5c1.2 1 1.2 4 0 5M50 5.5c-1.2 1-1.2 4 0 5" stroke="#0b120d" stroke-width="0.75"/>
</svg>"""

# 3. GOLF LINEAR
golf_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Icono Golf Putting Green Proyectos y Montajes">
  <!-- Contorno orgánico del putting green -->
  <path d="M12 40c-4-8 2-18 14-20c10-2 22 2 28 8c8 8 4 22-8 26c-12 4-26 2-34-14z" fill="#0b120d" fill-opacity="0.5" stroke="#1b5e20" stroke-width="2"/>
  <!-- Textura de topografía / desniveles -->
  <path d="M18 36c4-6 12-10 22-8c8 2 14 8 16 14" stroke="#a3e635" stroke-width="1.25" opacity="0.5" stroke-dasharray="2 3"/>
  <!-- Hoyo de golf (Cup) -->
  <ellipse cx="40" cy="42" rx="4.5" ry="2.2" fill="#0b120d" stroke="#d4af37" stroke-width="1.5"/>
  <ellipse cx="40" cy="42" rx="2" ry="1" fill="#1b5e20"/>
  <!-- Asta / Mástil de la bandera -->
  <line x1="40" y1="42" x2="40" y2="12" stroke="#fff" stroke-width="1.75"/>
  <!-- Bandera triangular de campeonato (Oro) -->
  <path d="M40 12l-12 5l12 5z" fill="#d4af37" stroke="#d4af37" stroke-width="1.5"/>
  <circle cx="40" cy="11.5" r="1.2" fill="#fff"/>
  <!-- Pelota de golf con sombra y hoyuelos -->
  <circle cx="22" cy="38" r="3.2" fill="#fff" stroke="#0b120d" stroke-width="1"/>
  <circle cx="21" cy="37" r="0.4" fill="#0b120d"/>
  <circle cx="23" cy="37" r="0.4" fill="#0b120d"/>
  <circle cx="22" cy="39" r="0.4" fill="#0b120d"/>
  <!-- Línea de trayectoria sutil hacia el hoyo -->
  <path d="M25 39q7 2 11 2" stroke="#a3e635" stroke-width="1.25" stroke-dasharray="1.5 2" opacity="0.75"/>
</svg>"""

# 4. PARQUES & RECREACIONAL LINEAR
parques_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Icono Parques Infantiles Proyectos y Montajes">
  <!-- Plataforma de seguridad EPDM -->
  <rect x="8" y="52" width="48" height="6" rx="2" fill="#0b120d" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="8" y1="54" x2="56" y2="54" stroke="#a3e635" stroke-width="1" opacity="0.6"/>
  <!-- Torre principal del parque -->
  <rect x="14" y="24" width="16" height="28" fill="#0b120d" stroke="#a3e635" stroke-width="1.75"/>
  <!-- Techo a dos aguas de la torre -->
  <path d="M12 24L22 10L32 24z" fill="#1b5e20" stroke="#a3e635" stroke-width="2"/>
  <circle cx="22" cy="18" r="2" fill="#d4af37"/>
  <!-- Barandal protector de la torre -->
  <line x1="14" y1="36" x2="30" y2="36" stroke="#fff" stroke-width="1.25"/>
  <line x1="18" y1="36" x2="18" y2="52" stroke="#fff" stroke-width="1"/>
  <line x1="22" y1="36" x2="22" y2="52" stroke="#fff" stroke-width="1"/>
  <line x1="26" y1="36" x2="26" y2="52" stroke="#fff" stroke-width="1"/>
  <!-- Resbaladilla / Tobogán de olas -->
  <path d="M30 36c4 0 6 3 8 7c2 4 4 6 8 6h3" stroke="#d4af37" stroke-width="2.5"/>
  <path d="M30 39c3 0 5 3 7 7c2 4 4 5 7 5h4" stroke="#a3e635" stroke-width="1.5"/>
  <!-- Escalera o módulo trepador -->
  <line x1="10" y1="36" x2="10" y2="52" stroke="#a3e635" stroke-width="1.5"/>
  <line x1="10" y1="40" x2="14" y2="40" stroke="#a3e635" stroke-width="1.25"/>
  <line x1="10" y1="44" x2="14" y2="44" stroke="#a3e635" stroke-width="1.25"/>
  <line x1="10" y1="48" x2="14" y2="48" stroke="#a3e635" stroke-width="1.25"/>
  <!-- Sol o detalle lúdico superior -->
  <circle cx="48" cy="16" r="4" fill="#d4af37" opacity="0.9"/>
  <path d="M48 9v2M48 21v2M41 16h2M53 16h2" stroke="#d4af37" stroke-width="1.25"/>
</svg>"""

# 5. PAISAJISMO & ARQUITECTURA VERDE LINEAR
paisajismo_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Icono Paisajismo y Terrazas Proyectos y Montajes">
  <!-- Tarima / Deck arquitectónico inferior -->
  <path d="M8 50l48-8v6l-48 8z" fill="#0b120d" stroke="#d4af37" stroke-width="1.5"/>
  <line x1="20" y1="48" x2="20" y2="54" stroke="#d4af37" stroke-width="1.25"/>
  <line x1="32" y1="46" x2="32" y2="52" stroke="#d4af37" stroke-width="1.25"/>
  <line x1="44" y1="44" x2="44" y2="50" stroke="#d4af37" stroke-width="1.25"/>
  <!-- Estructura de Pérgola Moderna -->
  <line x1="14" y1="49" x2="14" y2="18" stroke="#fff" stroke-width="1.75"/>
  <line x1="50" y1="43" x2="50" y2="14" stroke="#fff" stroke-width="1.75"/>
  <!-- Vigas horizontales en perspectiva -->
  <line x1="10" y1="18" x2="54" y2="14" stroke="#fff" stroke-width="2"/>
  <line x1="14" y1="21" x2="50" y2="17" stroke="#a3e635" stroke-width="1.25" opacity="0.8"/>
  <line x1="14" y1="24" x2="50" y2="20" stroke="#a3e635" stroke-width="1.25" opacity="0.8"/>
  <!-- Hojas orgánicas botánicas en primer plano -->
  <path d="M32 44c-12-2-16-16-10-24c6 8 10 16 10 24z" fill="#1b5e20" stroke="#a3e635" stroke-width="1.75"/>
  <path d="M32 44c12-4 16-18 8-26c-4 8-8 16-8 26z" fill="#1b5e20" stroke="#a3e635" stroke-width="1.75"/>
  <path d="M32 44V22" stroke="#d4af37" stroke-width="1.25"/>
  <!-- Fibras de césped sintético decorativo -->
  <path d="M20 47l-3-6M22 47l2-7M42 43l-2-6M45 43l3-7" stroke="#a3e635" stroke-width="1.5"/>
</svg>"""

icons = {
    "futbol-linear.svg": futbol_svg,
    "tenis-linear.svg": tenis_svg,
    "golf-linear.svg": golf_svg,
    "parques-linear.svg": parques_svg,
    "paisajismo-linear.svg": paisajismo_svg
}

for name, content in icons.items():
    p = os.path.join(SVG_DIR, name)
    with open(p, "w") as f:
        f.write(content.strip())
    print(f"Generated {name} ({len(content)} bytes)")

# Run SVGO optimization on all SVGs
print("\nRunning SVGO optimization...")
try:
    subprocess.run(["npx", "-y", "svgo", "-f", SVG_DIR], check=True)
    print("SVGO optimization complete!")
except Exception as e:
    print(f"SVGO note: {e}")

