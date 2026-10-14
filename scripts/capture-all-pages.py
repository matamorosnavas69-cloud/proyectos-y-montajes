import os
import subprocess
from PIL import Image

CHROME = "/usr/bin/google-chrome"
OUT_DIR = "qa-previews"
os.makedirs(OUT_DIR, exist_ok=True)

targets = [
    {"name": "homepage", "url": "http://localhost:3005/"},
    {"name": "canchas", "url": "http://localhost:3005/servicios/canchas-deportivas"},
    {"name": "parques", "url": "http://localhost:3005/servicios/parques-infantiles"},
    {"name": "paisajismo", "url": "http://localhost:3005/servicios/paisajismo"},
    {"name": "nosotros", "url": "http://localhost:3005/nosotros"},
]

for t in targets:
    # Desktop (1440x950)
    desktop_png = f"{OUT_DIR}/qa-{t['name']}-desktop.png"
    desktop_webp = f"{OUT_DIR}/qa-{t['name']}-desktop.webp"
    cmd_d = [
        CHROME,
        "--headless",
        "--disable-gpu",
        "--window-size=1440,950",
        f"--screenshot={desktop_png}",
        t["url"]
    ]
    subprocess.run(cmd_d, check=True)
    with Image.open(desktop_png) as im:
        im.save(desktop_webp, "WEBP", quality=85)
    print(f"Captured {desktop_png} and {desktop_webp}")
    
    # Mobile (390x844)
    mobile_png = f"{OUT_DIR}/qa-{t['name']}-mobile.png"
    mobile_webp = f"{OUT_DIR}/qa-{t['name']}-mobile.webp"
    cmd_m = [
        CHROME,
        "--headless",
        "--disable-gpu",
        "--window-size=390,844",
        f"--screenshot={mobile_png}",
        t["url"]
    ]
    subprocess.run(cmd_m, check=True)
    with Image.open(mobile_png) as im:
        im.save(mobile_webp, "WEBP", quality=85)
    print(f"Captured {mobile_png} and {mobile_webp}")

print("All QA screenshots successfully generated in qa-previews/!")
