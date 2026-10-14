import os
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PREVIEW_DIR = os.path.join(BASE_DIR, "public/brand/icons/previews")
HTML_PATH = os.path.join(PREVIEW_DIR, "catalog-preview.html")
PNG_OUT = os.path.join(PREVIEW_DIR, "full-collection-catalog.png")
WEBP_OUT = os.path.join(PREVIEW_DIR, "full-collection-catalog.webp")

html_content = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Proyectos y Montajes — Catálogo Maestro de Iconografía e Ilustraciones</title>
<style>
  body {
    margin: 0;
    padding: 40px;
    background: #060907;
    color: #f7f9f7;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  h1 {
    font-size: 28px;
    font-weight: 800;
    color: #d4af37;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
  }
  p.subtitle {
    font-size: 14px;
    color: #9ca3af;
    margin: 0 0 32px 0;
  }
  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: #a3e635;
    border-bottom: 1px solid rgba(163, 230, 53, 0.2);
    padding-bottom: 8px;
    margin: 32px 0 16px 0;
    display: flex;
    justify-content: space-between;
  }
  .grid-illustrations {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .card-illust {
    background: #0b120d;
    border: 1px solid rgba(27, 94, 32, 0.4);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .card-illust img {
    max-width: 140px;
    max-height: 120px;
    object-fit: contain;
    margin-bottom: 12px;
  }
  .card-illust .name {
    font-size: 13px;
    font-weight: 600;
    color: #f7f9f7;
    margin-bottom: 4px;
  }
  .card-illust .meta {
    font-size: 11px;
    color: #84cc16;
  }
  .grid-icons {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 12px;
  }
  .card-icon {
    background: #0b120d;
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 8px;
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .card-icon img {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }
  .card-icon .name {
    font-size: 11px;
    font-weight: 600;
    color: #d4af37;
  }
  .card-icon .sub {
    font-size: 10px;
    color: #9ca3af;
  }
</style>
</head>
<body>
  <h1>PROYECTOS Y MONTAJES — SISTEMA DE MARCA HÍBRIDO</h1>
  <p class="subtitle">Colección completa de 7 Iconos Vectoriales SVG Puros (24-64px) y 15 Ilustraciones Isométricas WebP (96-240px)</p>

  <div class="section-title">
    <span>1. Iconografía Lineal Vectorial SVG (viewBox 0 0 64 64)</span>
    <span>Formato: SVG Puro · SVGO Optimizado · Tokens de Marca</span>
  </div>
  <div class="grid-icons">
    <div class="card-icon">
      <img src="../../icons/svg/padel-linear.svg" />
      <span class="name">Pádel Pro</span>
      <span class="sub">3.2 KB SVG</span>
    </div>
    <div class="card-icon">
      <img src="../../icons/svg/futbol-linear.svg" />
      <span class="name">Fútbol Cancha</span>
      <span class="sub">0.8 KB SVG</span>
    </div>
    <div class="card-icon">
      <img src="../../icons/svg/tenis-linear.svg" />
      <span class="name">Tenis Oficial</span>
      <span class="sub">1.0 KB SVG</span>
    </div>
    <div class="card-icon">
      <img src="../../icons/svg/golf-linear.svg" />
      <span class="name">Golf Green</span>
      <span class="sub">1.0 KB SVG</span>
    </div>
    <div class="card-icon">
      <img src="../../icons/svg/parques-linear.svg" />
      <span class="name">Parques Lúdicos</span>
      <span class="sub">0.9 KB SVG</span>
    </div>
    <div class="card-icon">
      <img src="../../icons/svg/paisajismo-linear.svg" />
      <span class="name">Paisajismo Zen</span>
      <span class="sub">0.8 KB SVG</span>
    </div>
    <div class="card-icon">
      <img src="../../icons/svg/cancha-isometric-linear.svg" />
      <span class="name">Ingeniería Capas</span>
      <span class="sub">1.0 KB SVG</span>
    </div>
  </div>

  <div class="section-title">
    <span>2. Ilustraciones Isométricas de Arquitectura y Cortes Técnicos</span>
    <span>Formato: WebP Transparente · Compresión ~85-88%</span>
  </div>
  <div class="grid-illustrations">
    <div class="card-illust">
      <img src="../../illustrations/padel-court-isometric.webp" />
      <span class="name">Pádel Panorámico</span>
      <span class="meta">WebP 48 KB (Pilar 1)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/playground-castle-isometric.webp" />
      <span class="name">Parque Temático</span>
      <span class="meta">WebP 31 KB (Pilar 2)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/landscaping-pergola-terrace.webp" />
      <span class="name">Pérgola Residencial</span>
      <span class="meta">WebP 35 KB (Pilar 3)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/landscaping-drainage.webp" />
      <span class="name">Corte Drenaje</span>
      <span class="meta">WebP 54 KB (Técnico)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/landscaping-fibers.webp" />
      <span class="name">Fibras y Relleno</span>
      <span class="meta">WebP 37 KB (Técnico)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/landscaping-vertical-garden.webp" />
      <span class="name">Jardín Vertical</span>
      <span class="meta">WebP 26 KB (Técnico)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/landscaping-terrace-lawn.webp" />
      <span class="name">Césped en Terraza</span>
      <span class="meta">WebP 45 KB (Técnico)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/playground-modular-castle.webp" />
      <span class="name">Módulo Recreativo</span>
      <span class="meta">WebP 31 KB (Recreativo)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/playground-safety-floor.webp" />
      <span class="name">Piso EPDM Multicapa</span>
      <span class="meta">WebP 18 KB (Técnico)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/outdoor-fitness-gym.webp" />
      <span class="name">Gimnasio Biosaludable</span>
      <span class="meta">WebP 14 KB (Recreativo)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/calisthenics-frame.webp" />
      <span class="name">Estación Calistenia</span>
      <span class="meta">WebP 19 KB (Recreativo)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/court-futbol-isometric.webp" />
      <span class="name">Cancha Fútbol</span>
      <span class="meta">WebP 13 KB (Deportivo)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/court-padel-badge-isometric.webp" />
      <span class="name">Cancha Pádel</span>
      <span class="meta">WebP 15 KB (Deportivo)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/court-tenis-isometric.webp" />
      <span class="name">Cancha Tenis</span>
      <span class="meta">WebP 14 KB (Deportivo)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/court-golf-isometric.webp" />
      <span class="name">Putting Green</span>
      <span class="meta">WebP 10 KB (Deportivo)</span>
    </div>
    <div class="card-illust">
      <img src="../../illustrations/court-multideporte-isometric.webp" />
      <span class="name">Pista Polideportiva</span>
      <span class="meta">WebP 14 KB (Deportivo)</span>
    </div>
  </div>
</body>
</html>
"""

with open(HTML_PATH, "w") as f:
    f.write(html_content)

print(f"Generated HTML catalog at {HTML_PATH}")

# Render to high-resolution PNG using headless Chrome
cmd = [
    "/usr/bin/google-chrome",
    "--headless",
    "--disable-gpu",
    "--window-size=1440,1100",
    f"--screenshot={PNG_OUT}",
    f"file://{HTML_PATH}"
]
subprocess.run(cmd, check=True)
print(f"Rendered PNG catalog to {PNG_OUT}")

# Also convert to WebP
subprocess.run(["cwebp", "-q", "90", PNG_OUT, "-o", WEBP_OUT], check=True)
print(f"Generated WebP catalog to {WEBP_OUT}")
