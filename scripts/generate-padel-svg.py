import math

def rot(x, y, cx, cy, angle_deg):
    rad = math.radians(angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)
    nx = cos_a * (x - cx) - sin_a * (y - cy) + cx
    ny = sin_a * (x - cx) + cos_a * (y - cy) + cy
    return round(nx, 2), round(ny, 2)

# Unrotated upright racket centered around cx=32, cy=30:
# Head is an oval from y=8 to y=28, width 20 (x=22 to x=42)
# Throat from y=28 to y=35
# Handle from y=35 to y=52, width 3.5

# Let's generate points for angle = -22 and angle = +22
def generate_racket(angle, color, is_front=False):
    cx, cy = 32, 30
    
    # 1. Handle
    h_top_l = rot(30.5, 34, cx, cy, angle)
    h_top_r = rot(33.5, 34, cx, cy, angle)
    h_bot_l = rot(30.5, 50, cx, cy, angle)
    h_bot_r = rot(33.5, 50, cx, cy, angle)
    h_cap = rot(32, 51.5, cx, cy, angle)

    # 2. Throat triangular cutout
    th_l = rot(29, 29, cx, cy, angle)
    th_r = rot(35, 29, cx, cy, angle)
    th_b = rot(32, 34, cx, cy, angle)

    # 3. Head perimeter bezier points (8 points)
    # top: (32, 9), top-right: (41, 14), right: (42, 21), throat-r: (36, 29)
    # throat-l: (28, 29), left: (22, 21), top-left: (23, 14)
    head_pts = [
        rot(32, 8.5, cx, cy, angle),
        rot(40.5, 12, cx, cy, angle),
        rot(42, 19, cx, cy, angle),
        rot(36, 28, cx, cy, angle),
        rot(32, 30, cx, cy, angle),
        rot(28, 28, cx, cy, angle),
        rot(22, 19, cx, cy, angle),
        rot(23.5, 12, cx, cy, angle),
    ]

    # 4. Holes grid
    holes = []
    for row_y in [13, 16.5, 20, 23.5]:
        cols_x = [27, 32, 37] if row_y in [13, 23.5] else [25, 28.5, 32, 35.5, 39]
        for hx in cols_x:
            holes.append(rot(hx, row_y, cx, cy, angle))

    grip_lines = []
    for gy in [38, 41.5, 45, 48]:
        gl_1 = rot(30.5, gy, cx, cy, angle)
        gl_2 = rot(33.5, gy + 1, cx, cy, angle)
        grip_lines.append((gl_1, gl_2))

    return {
        'handle': (h_top_l, h_top_r, h_bot_r, h_bot_l, h_cap),
        'throat': (th_l, th_r, th_b),
        'head': head_pts,
        'holes': holes,
        'grips': grip_lines,
        'color': color
    }

r_white = generate_racket(-24, "#ffffff", False)
r_lime = generate_racket(24, "#a3e635", True)

def format_racket_svg(r, id_name):
    h = r['handle']
    th = r['throat']
    pts = r['head']
    col = r['color']
    
    # Smooth bezier through head points
    path_d = f"M {pts[0][0]} {pts[0][1]} "
    path_d += f"C {pts[1][0]} {pts[1][1]}, {pts[2][0]} {pts[2][1]}, {pts[3][0]} {pts[3][1]} "
    path_d += f"L {pts[4][0]} {pts[4][1]} "
    path_d += f"L {pts[5][0]} {pts[5][1]} "
    path_d += f"C {pts[6][0]} {pts[6][1]}, {pts[7][0]} {pts[7][1]}, {pts[0][0]} {pts[0][1]} Z"

    svg_str = f'  <g id="{id_name}">\n'
    # Handle
    svg_str += f'    <polygon points="{h[0][0]},{h[0][1]} {h[1][0]},{h[1][1]} {h[2][0]},{h[2][1]} {h[3][0]},{h[3][1]}" fill="#0b120d" stroke="{col}" stroke-width="2"/>\n'
    svg_str += f'    <circle cx="{h[4][0]}" cy="{h[4][1]}" r="1.75" fill="{col}"/>\n'
    for gl in r['grips']:
        svg_str += f'    <line x1="{gl[0][0]}" y1="{gl[0][1]}" x2="{gl[1][0]}" y2="{gl[1][1]}" stroke="{col}" stroke-width="1.2" opacity="0.6"/>\n'
    # Head
    svg_str += f'    <path d="{path_d}" fill="#0b120d" fill-opacity="0.85" stroke="{col}" stroke-width="2.25"/>\n'
    # Throat opening
    svg_str += f'    <polygon points="{th[0][0]},{th[0][1]} {th[1][0]},{th[1][1]} {th[2][0]},{th[2][1]}" fill="#0b120d" stroke="{col}" stroke-width="1.5"/>\n'
    # Holes
    for hx, hy in r['holes']:
        svg_str += f'    <circle cx="{hx}" cy="{hy}" r="0.9" fill="{col}"/>\n'
    svg_str += '  </g>\n'
    return svg_str

full_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Icono Pádel Proyectos y Montajes">
  <!-- Padel Court Perimeter & Corner Demarcation -->
  <rect x="10" y="24" width="44" height="34" rx="3" stroke="#1b5e20" stroke-width="1.75" fill="#0b120d" fill-opacity="0.5"/>
  <line x1="32" y1="24" x2="32" y2="58" stroke="#1b5e20" stroke-width="1.5"/>
  <path d="M10 44C16 44 20 48 20 58" stroke="#1b5e20" stroke-width="1.5"/>
  <path d="M54 44C48 44 44 48 44 58" stroke="#1b5e20" stroke-width="1.5"/>

  <!-- Padel Ball (Top Center) -->
  <circle cx="32" cy="7" r="3.75" fill="#a3e635"/>
  <path d="M30 4.2C31.2 5.2 31.2 8.8 30 9.8" stroke="#0b120d" stroke-width="0.85" fill="none"/>
  <path d="M34 4.2C32.8 5.2 32.8 8.8 34 9.8" stroke="#0b120d" stroke-width="0.85" fill="none"/>

""" + format_racket_svg(r_white, "racket-white") + format_racket_svg(r_lime, "racket-lime") + "</svg>"

with open('public/brand/icons/svg/padel-linear.svg', 'w') as f:
    f.write(full_svg)

print("Generated mathematically rotated padel-linear.svg")
