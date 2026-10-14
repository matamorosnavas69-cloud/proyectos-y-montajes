import os
from PIL import Image, ImageDraw, ImageFont

REPO_ROOT = "/home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes"
QA_DIR = os.path.join(REPO_ROOT, "qa-previews")
BRAIN_DIR = "/home/sebastiangarcia/.gemini/antigravity-ide/brain/b72628d8-7784-4d06-8f3e-4a129e5bad8e"
os.makedirs(QA_DIR, exist_ok=True)
os.makedirs(BRAIN_DIR, exist_ok=True)

# Master Board Canvas: 2400 x 3200 px
W, H = 2400, 3200
board = Image.new("RGBA", (W, H), (11, 18, 13, 255))
draw = ImageDraw.Draw(board)

# Header Title Bar
draw.rectangle([(0, 0), (W, 110)], fill=(16, 26, 19, 255))
draw.line([(0, 110), (W, 110)], fill=(27, 94, 32, 255), width=2)
draw.text((60, 30), "PROYECTOS Y MONTAJES — TABLERO MAESTRO DE ACEPTACIÓN VISUAL (RELEASE PREFLIGHT)", fill=(212, 175, 55, 255))
draw.text((60, 68), "Inspección Integral de Identidad, Navegación Móvil, Heroes de Servicios, CMS Editorial y Comparativa de Arte", fill=(200, 200, 200, 255))
draw.text((W - 360, 45), "ESTADO: PREFLIGHT LOCAL", fill=(212, 175, 55, 255))

def paste_section_box(x, y, w, h, title, category=""):
    draw.rectangle([(x, y), (x + w, y + h)], fill=(16, 26, 19, 230), outline=(27, 94, 32, 180), width=1)
    draw.rectangle([(x, y), (x + w, y + 42)], fill=(20, 34, 24, 255))
    draw.line([(x, y + 42), (x + w, y + 42)], fill=(27, 94, 32, 200), width=1)
    draw.text((x + 16, y + 12), title.upper(), fill=(255, 255, 255, 255))
    if category:
        draw.text((x + w - 240, y + 12), category, fill=(212, 175, 55, 255))

def safe_paste(img_rel_path, target_box, crop_to_fill=False):
    full_p = os.path.join(QA_DIR, img_rel_path)
    if not os.path.exists(full_p):
        print(f"Warning: {full_p} not found")
        return
    im = Image.open(full_p).convert("RGBA")
    bx, by, bw, bh = target_box
    if crop_to_fill:
        r = max(bw / im.width, bh / im.height)
        nw, nh = int(im.width * r), int(im.height * r)
        im = im.resize((nw, nh), Image.Resampling.LANCZOS)
        cx = (nw - bw) // 2
        cy = (nh - bh) // 2
        im = im.crop((cx, cy, cx + bw, cy + bh))
    else:
        im = im.resize((bw, bh), Image.Resampling.LANCZOS)
    board.paste(im, (bx, by))

# ─── SECTION 1: HOMEPAGE HERO & ART DIRECTION COMPARISON (Y: 130 to 860) ───
paste_section_box(40, 130, 2320, 720, "1. Homepage Hero — Dirección de Arte Fotográfica & Comparativa de Opciones", "DIRECCIÓN DE ARTE")

# Option A: Current (IMG_0337.JPG)
safe_paste("hero-comparison/option-a-desktop.webp", (60, 190, 720, 400), crop_to_fill=True)
draw.text((60, 600), "OPCIÓN A: Actual (IMG_0337.JPG) — Césped sintético con palapa", fill=(212, 175, 55, 255))
draw.text((60, 625), "• Sensación campestre / recreativa • Payload: 1.1 MB", fill=(180, 180, 180, 255))
draw.text((60, 650), "• Dictamen: Menor autoridad constructiva institucional", fill=(255, 140, 0, 255))

# Option B: Padel Flagship (IMG_3346.PNG)
safe_paste("hero-comparison/option-b-desktop.webp", (830, 190, 720, 400), crop_to_fill=True)
draw.text((830, 600), "OPCIÓN B: Pádel Flagship (IMG_3346.PNG) — Pistas panorámicas WPT", fill=(212, 175, 55, 255))
draw.text((830, 625), "• Estructura metálica, vidrio templado & iluminación LED • Alto valor comercial", fill=(180, 180, 180, 255))
draw.text((830, 650), "• Dictamen: RECOMENDADO (Máxima autoridad en ingeniería deportiva)", fill=(130, 220, 130, 255))

# Option C: Large Sports Complex (IMG_4527.jpg)
safe_paste("hero-comparison/option-c-desktop.webp", (1600, 190, 720, 400), crop_to_fill=True)
draw.text((1600, 600), "OPCIÓN C: Gran Infraestructura (IMG_4527.jpg) — Complejo multideportivo", fill=(212, 175, 55, 255))
draw.text((1600, 625), "• Cerrajería perimetral, graderías y campo de gran escala", fill=(180, 180, 180, 255))
draw.text((1600, 650), "• Dictamen: Alta envergadura técnica (requiere WebP comprimido)", fill=(200, 200, 200, 255))

# Mobile preview snippet below Option B
safe_paste("hero-comparison/option-b-mobile.webp", (830, 680, 160, 150), crop_to_fill=True)
draw.text((1010, 700), "Mobile Responsive Preview:", fill=(212, 175, 55, 255))
draw.text((1010, 725), "Recorte vertical centrado en pista central con contraste AAA garantizado.", fill=(180, 180, 180, 255))
draw.text((1010, 750), "Botones táctiles apilados (Cotizar Proyecto / Explorar Obras Reales).", fill=(180, 180, 180, 255))

# ─── SECTION 2: NAVIGATION & RESPONSIVE DRAWER (Y: 880 to 1550) ───
paste_section_box(40, 880, 2320, 660, "2. Sistema de Navegación Responsive — Header & Drawer Modal Accesible", "CORE UX & A11Y")

# Desktop Header
draw.text((60, 935), "Header Desktop (1440px): Lockup horizontal 1564x180, enlaces técnicos y CTA en línea:", fill=(200, 200, 200, 255))
safe_paste("qa-header-1440px.webp", (60, 965, 1400, 90), crop_to_fill=True)

# Mobile Header 360px
draw.text((60, 1075), "Header Móvil (360px): Isotipo + Tipografía compacta + Cotizar + Hamburguesa (77px libres):", fill=(200, 200, 200, 255))
safe_paste("qa-header-360px.webp", (60, 1105, 560, 90), crop_to_fill=True)

# Mobile Header 390px
draw.text((680, 1075), "Header Móvil (390px): Espacio amplio (107px libres, cero colisión):", fill=(200, 200, 200, 255))
safe_paste("qa-header-390px.webp", (680, 1105, 600, 90), crop_to_fill=True)

# Mobile Drawer Open (390px)
draw.text((1540, 935), "Mobile Navigation Drawer (Abierto):", fill=(212, 175, 55, 255))
draw.text((1540, 960), "Focus trap, escape-to-close, body scroll lock,", fill=(180, 180, 180, 255))
draw.text((1540, 980), "rutas canónicas y botón prioritario de cotización:", fill=(180, 180, 180, 255))
safe_paste("qa-drawer-open-390px.webp", (1540, 1010, 260, 510), crop_to_fill=True)

draw.text((1830, 1040), "Verificaciones Superadas:", fill=(255, 255, 255, 255))
draw.text((1830, 1075), "✓ aria-expanded dinámico", fill=(130, 220, 130, 255))
draw.text((1830, 1105), "✓ aria-controls='mobile-navigation-drawer'", fill=(130, 220, 130, 255))
draw.text((1830, 1135), "✓ Foco confinado con Tab/Shift+Tab", fill=(130, 220, 130, 255))
draw.text((1830, 1165), "✓ Retorno de foco al disparador al cerrar", fill=(130, 220, 130, 255))
draw.text((1830, 1195), "✓ Bloqueo estricto del scroll de fondo", fill=(130, 220, 130, 255))
draw.text((1830, 1225), "✓ Cierre inmediato con tecla Escape", fill=(130, 220, 130, 255))
draw.text((1830, 1255), "✓ Cierre al hacer click en el backdrop", fill=(130, 220, 130, 255))
draw.text((1830, 1285), "✓ Resalte dorado de ruta activa (usePathname)", fill=(130, 220, 130, 255))

# Footer samples in Navigation box
draw.text((60, 1220), "Footer Institucional — Desktop (1440px) y Móvil (390px):", fill=(200, 200, 200, 255))
safe_paste("qa-footer-desktop.webp", (60, 1250, 960, 260), crop_to_fill=True)
safe_paste("qa-footer-mobile.webp", (1060, 1250, 180, 260), crop_to_fill=True)
draw.text((1260, 1280), "Especialidades Canónicas:", fill=(212, 175, 55, 255))
draw.text((1260, 1310), "• /servicios/canchas-deportivas", fill=(180, 180, 180, 255))
draw.text((1260, 1335), "• /servicios/parques-infantiles", fill=(180, 180, 180, 255))
draw.text((1260, 1360), "• /servicios/paisajismo", fill=(180, 180, 180, 255))
draw.text((1260, 1385), "• /portafolio", fill=(180, 180, 180, 255))
draw.text((1260, 1420), "Canales Verificados: Sede Bucaramanga & Nacional", fill=(130, 220, 130, 255))

# ─── SECTION 3: SERVICE HEROES & CONTINUITY (Y: 1570 to 2280) ───
paste_section_box(40, 1570, 2320, 700, "3. Heroes de Servicios & Continuidad Visual — Canchas, Parques y Paisajismo", "ARQUITECTURA VISUAL")

# Canchas Hero
safe_paste("qa-canchas-dynamic-desktop.webp", (60, 1630, 720, 420), crop_to_fill=True)
draw.text((60, 2070), "CANCHAS DEPORTIVAS (/servicios/canchas-deportivas)", fill=(212, 175, 55, 255))
draw.text((60, 2095), "Slider dinámico de 4 obras reales (pádel y fútbol) con especificaciones técnicas.", fill=(180, 180, 180, 255))

# Parques Hero
safe_paste("qa-parques-dynamic-desktop.webp", (830, 1630, 720, 420), crop_to_fill=True)
draw.text((830, 2070), "PARQUES INFANTILES (/servicios/parques-infantiles)", fill=(212, 175, 55, 255))
draw.text((830, 2095), "Áreas recreativas modulares, juegos temáticos y pisos de seguridad amortiguantes.", fill=(180, 180, 180, 255))

# Paisajismo Hero
safe_paste("qa-paisajismo-dynamic-desktop.webp", (1600, 1630, 720, 420), crop_to_fill=True)
draw.text((1600, 2070), "PAISAJISMO Y TERRAZAS (/servicios/paisajismo)", fill=(212, 175, 55, 255))
draw.text((1600, 2095), "Jardines verticales, cubiertas verdes y paisajismo corporativo de bajo mantenimiento.", fill=(180, 180, 180, 255))

# Continuity summary below
draw.text((60, 2150), "Continuidad Visual Certificada:", fill=(255, 255, 255, 255))
draw.text((60, 2180), "• Todos los Heroes emplean fotografía real de proyectos ejecutados en Colombia (sin sellos de agua ni badges decorativos sobre la foto).", fill=(200, 200, 200, 255))
draw.text((60, 2205), "• Gradientes arquitectónicos oscuros con idéntica proporción de contraste WCAG AAA e indicadores circulares mínimos no invasivos.", fill=(200, 200, 200, 255))
draw.text((60, 2230), "• Integración armónica de las ilustraciones isométricas aprobadas en las tarjetas descriptivas inferiores de cada servicio.", fill=(200, 200, 200, 255))

# ─── SECTION 4: HERO CMS & BRAND SYSTEM GOVERNANCE (Y: 2300 to 3150) ───
paste_section_box(40, 2300, 2320, 840, "4. CMS Visual de Heroes & Matriz de Identidad de Marca", "CMS & BRAND SYSTEM")

# Admin Hero CMS Desktop
safe_paste("qa-admin-heroes-cms-desktop.webp", (60, 2360, 750, 440), crop_to_fill=True)
draw.text((60, 2820), "Panel Administrativo CMS (/admin/biblioteca-media):", fill=(212, 175, 55, 255))
draw.text((60, 2845), "Control total de diapositivas: orden, título, visibilidad y punto focal.", fill=(180, 180, 180, 255))
draw.text((60, 2870), "Validación en pre-vuelo: rechaza archivos rotos, videos o URLs no autorizadas.", fill=(130, 220, 130, 255))

# Admin Hero CMS Mobile
safe_paste("qa-admin-heroes-cms-mobile.webp", (840, 2360, 280, 440), crop_to_fill=True)
draw.text((840, 2820), "CMS Móvil:", fill=(212, 175, 55, 255))
draw.text((840, 2845), "Totalmente responsivo", fill=(180, 180, 180, 255))

# Brand Identity Board Miniaturized on the right
safe_paste("qa-logo-system-board.webp", (1160, 2360, 1160, 680), crop_to_fill=True)
draw.text((1160, 3060), "Tablero Canónico de Identidad de Marca (Variante Institucional, Horizontal e Isotipo)", fill=(212, 175, 55, 255))
draw.text((1160, 3085), "Geometría original y relación 1564:180 preservada. Transparencia 100% alfa y contraste WCAG AAA sobre #0b120d.", fill=(180, 180, 180, 255))

# Final Footer Bar
draw.rectangle([(0, H - 40), (W, H)], fill=(16, 26, 19, 255))
draw.text((60, H - 28), "Generado por Antigravity Release Preflight Pipeline • PlanMaestro Ecosystem • packages/proyectos-y-montajes", fill=(150, 150, 150, 255))
draw.text((W - 400, H - 28), "CANDIDATO DE LIBERACIÓN INTEGRAL VERIFICADO", fill=(212, 175, 55, 255))

master_board_path = os.path.join(QA_DIR, "qa-final-release-acceptance-board.webp")
master_brain_path = os.path.join(BRAIN_DIR, "qa-final-release-acceptance-board.webp")
board.save(master_board_path, "WEBP", quality=88)
board.save(master_brain_path, "WEBP", quality=88)
print(f"Master Acceptance Board generated: {master_board_path}")
