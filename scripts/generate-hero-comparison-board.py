import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO_ROOT = "/home/sebastiangarcia/planmaestro-ecosystem/packages/proyectos-y-montajes"
OUT_DIR = os.path.join(REPO_ROOT, "qa-previews", "hero-comparison")
BRAIN_DIR = "/home/sebastiangarcia/.gemini/antigravity-ide/brain/b72628d8-7784-4d06-8f3e-4a129e5bad8e"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(BRAIN_DIR, exist_ok=True)

options = [
    {
        "id": "option-a",
        "title": "Opción A: Actual (IMG_0337.JPG)",
        "subtitle": "Cancha Fútbol Sintético con Palapa Campestre",
        "path": os.path.join(REPO_ROOT, "public/images/futbol/IMG_0337.JPG"),
        "focal": (0.5, 0.4),
    },
    {
        "id": "option-b",
        "title": "Opción B: Pádel Flagship (IMG_3346.PNG)",
        "subtitle": "Pista Profesional de Pádel Panorámica",
        "path": os.path.join(REPO_ROOT, "public/images/padel/IMG_3346.PNG"),
        "focal": (0.5, 0.45),
    },
    {
        "id": "option-c",
        "title": "Opción C: Gran Infraestructura (IMG_4527.jpg)",
        "subtitle": "Complejo Deportivo y Obras de Ingeniería",
        "path": os.path.join(REPO_ROOT, "public/images/drive organice/canchas/IMG_4527.jpg"),
        "focal": (0.5, 0.4),
    },
]

def render_hero_mockup(opt, width, height, is_mobile=False):
    canvas = Image.new("RGBA", (width, height), (11, 18, 13, 255))
    
    # Load and crop background image
    src_img = Image.open(opt["path"]).convert("RGBA")
    sw, sh = src_img.size
    
    # Scale to cover
    ratio = max(width / sw, height / sh)
    nw, nh = int(sw * ratio), int(sh * ratio)
    scaled = src_img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    # Center crop with focal
    fx, fy = opt["focal"]
    cx = int((nw - width) * fx)
    cy = int((nh - height) * fy)
    cx = max(0, min(nw - width, cx))
    cy = max(0, min(nh - height, cy))
    
    cropped = scaled.crop((cx, cy, cx + width, cy + height))
    canvas.paste(cropped, (0, 0))
    
    # Dark architectural overlays
    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)
    
    # Vertical gradient from brand-dark/90 via 75 to 95
    for y in range(height):
        p = y / height
        if p < 0.2:
            alpha = int(220 + 20 * (1 - p / 0.2))
        elif p < 0.7:
            alpha = int(190 + 30 * ((p - 0.2) / 0.5))
        else:
            alpha = int(220 + 35 * ((p - 0.7) / 0.3))
        draw_ov.line([(0, y), (width, y)], fill=(11, 18, 13, min(245, alpha)))
        
    canvas = Image.alpha_composite(canvas, overlay)
    draw = ImageDraw.Draw(canvas)
    
    # Minimal typography layout
    # Header bar
    draw.rectangle([(0, 0), (width, 60 if is_mobile else 76)], fill=(11, 18, 13, 230))
    draw.line([(0, 60 if is_mobile else 76), (width, 60 if is_mobile else 76)], fill=(27, 94, 32, 100), width=1)
    
    # Header logo text
    draw.text((16, 20 if is_mobile else 26), "PROYECTOS Y MONTAJES", fill=(212, 175, 55, 255))
    
    # Badge
    badge_y = 90 if is_mobile else 140
    badge_text = "MÁS DE 20 AÑOS TRANSFORMANDO ESPACIOS EN COLOMBIA"
    draw.rounded_rectangle([(width//2 - 160, badge_y), (width//2 + 160, badge_y + 26)], radius=13, fill=(27, 94, 32, 120), outline=(27, 94, 32, 200))
    draw.text((width//2 - 145, badge_y + 6), badge_text, fill=(247, 249, 247, 240))
    
    # Main Headline
    h1_y = badge_y + 40
    if is_mobile:
        draw.text((width//2 - 150, h1_y), "Ingeniería Deportiva,", fill=(255, 255, 255, 255))
        draw.text((width//2 - 150, h1_y + 32), "Recreativa y", fill=(255, 255, 255, 255))
        draw.text((width//2 - 150, h1_y + 64), "Paisajismo Arquitectónico", fill=(212, 175, 55, 255))
        btn_y = h1_y + 160
    else:
        draw.text((width//2 - 320, h1_y), "Ingeniería Deportiva, Recreativa y", fill=(255, 255, 255, 255))
        draw.text((width//2 - 200, h1_y + 50), "Paisajismo Arquitectónico", fill=(212, 175, 55, 255))
        btn_y = h1_y + 170

    # CTAs
    draw.rounded_rectangle([(width//2 - 140, btn_y), (width//2 - 10, btn_y + 44)], radius=8, fill=(212, 175, 55, 255))
    draw.text((width//2 - 120, btn_y + 14), "Cotizar Proyecto", fill=(11, 18, 13, 255))
    draw.rounded_rectangle([(width//2 + 10, btn_y), (width//2 + 150, btn_y + 44)], radius=8, fill=(255, 255, 255, 25), outline=(255, 255, 255, 100))
    draw.text((width//2 + 25, btn_y + 14), "Explorar Obras", fill=(255, 255, 255, 255))
    
    # Watermark test label
    draw.text((20, height - 30), f"{opt['title']} — {width}x{height}", fill=(212, 175, 55, 200))
    
    return canvas

# Generate comparison boards
desktop_w, desktop_h = 1200, 680
mobile_w, mobile_h = 390, 780

for opt in options:
    d_canvas = render_hero_mockup(opt, desktop_w, desktop_h, is_mobile=False)
    d_path = os.path.join(OUT_DIR, f"{opt['id']}-desktop.webp")
    d_brain = os.path.join(BRAIN_DIR, f"{opt['id']}-desktop.webp")
    d_canvas.save(d_path, "WEBP", quality=90)
    d_canvas.save(d_brain, "WEBP", quality=90)
    
    m_canvas = render_hero_mockup(opt, mobile_w, mobile_h, is_mobile=True)
    m_path = os.path.join(OUT_DIR, f"{opt['id']}-mobile.webp")
    m_brain = os.path.join(BRAIN_DIR, f"{opt['id']}-mobile.webp")
    m_canvas.save(m_path, "WEBP", quality=90)
    m_canvas.save(m_brain, "WEBP", quality=90)
    print(f"Generated comparison for {opt['id']}")

# Now generate a master 3-Option Comparison Board combining desktop & mobile
board_w = 1800
board_h = 1350
board = Image.new("RGBA", (board_w, board_h), (11, 18, 13, 255))
b_draw = ImageDraw.Draw(board)

b_draw.text((60, 40), "PROYECTOS Y MONTAJES — COMPARATIVA DE DIRECCIÓN DE ARTE: HERO PRINCIPAL", fill=(212, 175, 55, 255))
b_draw.text((60, 70), "Evaluación de Autoridad Constructiva, Fidelidad Fotográfica Real y Posicionamiento de Marca", fill=(200, 200, 200, 255))

for idx, opt in enumerate(options):
    x_offset = 60 + idx * 570
    y_offset = 120
    
    b_draw.rectangle([(x_offset, y_offset), (x_offset + 540, y_offset + 1150)], fill=(16, 26, 19, 255), outline=(27, 94, 32, 150), width=1)
    b_draw.text((x_offset + 20, y_offset + 16), opt["title"], fill=(255, 255, 255, 255))
    b_draw.text((x_offset + 20, y_offset + 38), opt["subtitle"], fill=(212, 175, 55, 255))
    
    # Desktop preview (scale to 500x280)
    d_im = Image.open(os.path.join(OUT_DIR, f"{opt['id']}-desktop.webp")).resize((500, 283), Image.Resampling.LANCZOS)
    board.paste(d_im, (x_offset + 20, y_offset + 70))
    b_draw.text((x_offset + 20, y_offset + 360), "Desktop Preview (1200x680)", fill=(150, 150, 150, 255))
    
    # Mobile preview (scale to 240x480)
    m_im = Image.open(os.path.join(OUT_DIR, f"{opt['id']}-mobile.webp")).resize((240, 480), Image.Resampling.LANCZOS)
    board.paste(m_im, (x_offset + 20, y_offset + 390))
    b_draw.text((x_offset + 280, y_offset + 420), "Mobile Preview", fill=(212, 175, 55, 255))
    b_draw.text((x_offset + 280, y_offset + 445), "Viewport: 390x780", fill=(180, 180, 180, 255))
    b_draw.text((x_offset + 280, y_offset + 480), "Características:", fill=(255, 255, 255, 255))
    
    if opt["id"] == "option-a":
        chars = ["• Césped sintético recreativo", "• Palapa rústica lateral", "• Sensación campestre / social", "• Payload: 1.1 MB (sin optimizar)", "• Veredicto: Bajo en ingeniería"]
    elif opt["id"] == "option-b":
        chars = ["• Pista de Pádel panorámica", "• Estructura metálica & vidrio", "• Alto valor comercial (flagship)", "• Payload: 1.8 MB (sin optimizar)", "• Veredicto: MÁXIMA AUTORIDAD"]
    else:
        chars = ["• Complejo multideportivo", "• Cerrajería & graderías", "• Escala institucional", "• Payload: 9.2 MB (requiere WebP)", "• Veredicto: Alta envergadura"]
        
    for cy_idx, c in enumerate(chars):
        b_draw.text((x_offset + 280, y_offset + 510 + cy_idx * 24), c, fill=(200, 200, 200, 255))

master_board_path = os.path.join(OUT_DIR, "qa-hero-comparison-board.webp")
master_brain_path = os.path.join(BRAIN_DIR, "qa-hero-comparison-board.webp")
board.save(master_board_path, "WEBP", quality=90)
board.save(master_brain_path, "WEBP", quality=90)
print(f"Master comparison board saved to {master_board_path}")
