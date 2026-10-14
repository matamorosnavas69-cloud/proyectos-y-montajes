import os
import numpy as np
from PIL import Image
from collections import deque

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_DIR = os.path.join(BASE_DIR, "public/brand/raw-sheets")
OUT_ILLUST_DIR = os.path.join(BASE_DIR, "public/brand/illustrations")
os.makedirs(OUT_ILLUST_DIR, exist_ok=True)

def isolate_white_background(img_crop, threshold=242):
    """
    BFS Flood fill from border pixels that are >= threshold in all channels.
    This preserves white lines or highlights inside the artwork!
    """
    im_rgb = img_crop.convert("RGB")
    arr = np.array(im_rgb)
    h, w, _ = arr.shape
    
    alpha = np.ones((h, w), dtype=np.uint8) * 255
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    
    # Initialize from the outer perimeter
    for x in range(w):
        for y in [0, h - 1]:
            if np.all(arr[y, x] >= threshold):
                q.append((y, x))
                visited[y, x] = True
    for y in range(h):
        for x in [0, w - 1]:
            if not visited[y, x] and np.all(arr[y, x] >= threshold):
                q.append((y, x))
                visited[y, x] = True
                
    while q:
        cy, cx = q.popleft()
        alpha[cy, cx] = 0
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                if np.all(arr[ny, nx] >= threshold):
                    visited[ny, nx] = True
                    q.append((ny, nx))
                    
    # Smooth alpha edges slightly
    im_rgba = Image.new("RGBA", (w, h))
    arr_rgba = np.dstack([arr, alpha])
    result = Image.fromarray(arr_rgba, "RGBA")
    
    # Auto-crop to content bounding box
    bbox = result.getbbox()
    if bbox:
        # Add 12px optical padding
        pad = 12
        crop_box = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad)
        )
        result = result.crop(crop_box)
        
    return result

def isolate_dark_background(img_crop, threshold=38):
    """
    BFS Flood fill from border for dark green/black background in Sheet 4.
    """
    im_rgb = img_crop.convert("RGB")
    arr = np.array(im_rgb)
    h, w, _ = arr.shape
    
    alpha = np.ones((h, w), dtype=np.uint8) * 255
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    
    for x in range(w):
        for y in [0, h - 1]:
            if np.mean(arr[y, x]) <= threshold:
                q.append((y, x))
                visited[y, x] = True
    for y in range(h):
        for x in [0, w - 1]:
            if not visited[y, x] and np.mean(arr[y, x]) <= threshold:
                q.append((y, x))
                visited[y, x] = True
                
    while q:
        cy, cx = q.popleft()
        alpha[cy, cx] = 0
        for dy, dx in [(-1,0), (1,0), (0,-1), (0,1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                if np.mean(arr[ny, nx]) <= threshold:
                    visited[ny, nx] = True
                    q.append((ny, nx))
                    
    im_rgba = Image.new("RGBA", (w, h))
    arr_rgba = np.dstack([arr, alpha])
    result = Image.fromarray(arr_rgba, "RGBA")
    bbox = result.getbbox()
    if bbox:
        pad = 10
        crop_box = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(w, bbox[2] + pad),
            min(h, bbox[3] + pad)
        )
        result = result.crop(crop_box)
    return result

# Extraction manifest
ASSETS_SPEC = [
    # Sheet 1: Pillars
    {
        "sheet": "sheet-01-three-pillars.jpg",
        "id": "playground-castle-isometric",
        "box": (485, 108, 894, 618),
        "dark": False,
        "thresh": 242
    },
    {
        "sheet": "sheet-01-three-pillars.jpg",
        "id": "landscaping-pergola-terrace",
        "box": (922, 108, 1348, 618),
        "dark": False,
        "thresh": 242
    },
    # Sheet 2: Landscaping Technical
    {
        "sheet": "sheet-02-landscaping-technical.jpg",
        "id": "landscaping-fibers",
        "box": (120, 20, 580, 380),
        "dark": False,
        "thresh": 240
    },
    {
        "sheet": "sheet-02-landscaping-technical.jpg",
        "id": "landscaping-vertical-garden",
        "box": (830, 20, 1235, 380),
        "dark": False,
        "thresh": 240
    },
    {
        "sheet": "sheet-02-landscaping-technical.jpg",
        "id": "landscaping-terrace-lawn",
        "box": (830, 390, 1235, 735),
        "dark": False,
        "thresh": 240
    },
    # Sheet 3: Playgrounds & Recreational
    {
        "sheet": "sheet-03-playgrounds-recreational.jpg",
        "id": "playground-modular-castle",
        "box": (90, 25, 610, 370),
        "dark": False,
        "thresh": 240
    },
    {
        "sheet": "sheet-03-playgrounds-recreational.jpg",
        "id": "playground-safety-floor",
        "box": (790, 25, 1260, 370),
        "dark": False,
        "thresh": 240
    },
    {
        "sheet": "sheet-03-playgrounds-recreational.jpg",
        "id": "outdoor-fitness-gym",
        "box": (90, 385, 610, 750),
        "dark": False,
        "thresh": 240
    },
    {
        "sheet": "sheet-03-playgrounds-recreational.jpg",
        "id": "calisthenics-frame",
        "box": (790, 385, 1260, 750),
        "dark": False,
        "thresh": 240
    },
    # Sheet 4: Sports Isometric Badges
    {
        "sheet": "sheet-04-courts-isometric-filled.jpg",
        "id": "court-futbol-isometric",
        "box": (180, 140, 450, 380),
        "dark": True,
        "thresh": 40
    },
    {
        "sheet": "sheet-04-courts-isometric-filled.jpg",
        "id": "court-padel-badge-isometric",
        "box": (540, 140, 840, 380),
        "dark": True,
        "thresh": 40
    },
    {
        "sheet": "sheet-04-courts-isometric-filled.jpg",
        "id": "court-tenis-isometric",
        "box": (930, 140, 1200, 380),
        "dark": True,
        "thresh": 40
    },
    {
        "sheet": "sheet-04-courts-isometric-filled.jpg",
        "id": "court-golf-isometric",
        "box": (180, 440, 450, 680),
        "dark": True,
        "thresh": 40
    },
    {
        "sheet": "sheet-04-courts-isometric-filled.jpg",
        "id": "court-multideporte-isometric",
        "box": (540, 440, 840, 680),
        "dark": True,
        "thresh": 40
    },
    {
        "sheet": "sheet-04-courts-isometric-filled.jpg",
        "id": "court-volleyball-isometric",
        "box": (930, 440, 1200, 680),
        "dark": True,
        "thresh": 40
    },
]

print(f"Starting batch production of {len(ASSETS_SPEC)} brand illustrations...")
for spec in ASSETS_SPEC:
    sheet_path = os.path.join(RAW_DIR, spec["sheet"])
    sheet_im = Image.open(sheet_path)
    crop = sheet_im.crop(spec["box"])
    
    if spec["dark"]:
        clean = isolate_dark_background(crop, threshold=spec["thresh"])
    else:
        clean = isolate_white_background(crop, threshold=spec["thresh"])
        
    png_path = os.path.join(OUT_ILLUST_DIR, f"{spec['id']}.png")
    webp_path = os.path.join(OUT_ILLUST_DIR, f"{spec['id']}.webp")
    
    clean.save(png_path, "PNG", optimize=True)
    clean.save(webp_path, "WEBP", quality=88, method=6)
    
    png_sz = os.path.getsize(png_path) / 1024
    webp_sz = os.path.getsize(webp_path) / 1024
    savings = (1 - webp_sz / png_sz) * 100
    print(f"[{spec['id']}] {clean.size} -> PNG: {png_sz:.1f}KB, WebP: {webp_sz:.1f}KB (-{savings:.1f}%)")

print("All illustrations successfully processed!")
