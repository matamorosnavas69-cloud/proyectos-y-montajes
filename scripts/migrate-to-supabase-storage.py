import os
import sys
import mimetypes
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://ygnvcmwoatlaeulrfmdi.supabase.co")
SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY", "")
BUCKET = os.environ.get("NEXT_PUBLIC_SUPABASE_BUCKET", "projectos y montajes librarry")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA_DIR = os.path.join(REPO_ROOT, "public", "images", "drive organice")
CATEGORIES = ["canchas", "golf", "parques", "piscina", "residencial"]

ENCODED_BUCKET = urllib.parse.quote(BUCKET)

def get_content_type(filename):
    ext = os.path.splitext(filename)[1].lower()
    if ext in ['.jpg', '.jpeg']:
        return 'image/jpeg'
    elif ext == '.png':
        return 'image/png'
    elif ext == '.webp':
        return 'image/webp'
    elif ext == '.avif':
        return 'image/avif'
    elif ext == '.mp4':
        return 'video/mp4'
    elif ext == '.mov':
        return 'video/quicktime'
    return 'application/octet-stream'

def upload_file(item):
    cat, filename, file_path = item
    content_type = get_content_type(filename)
    
    # Supabase key
    key_path = f"gallery/{cat}/{filename}"
    encoded_key = urllib.parse.quote(key_path)
    url = f"{PROJECT_URL}/storage/v1/object/{ENCODED_BUCKET}/{encoded_key}"
    
    try:
        with open(file_path, "rb") as f:
            data = f.read()
            
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {SECRET_KEY}",
                "apikey": SECRET_KEY,
                "Content-Type": content_type,
                "x-upsert": "true"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            if res.status in (200, 201):
                return True, cat, filename, len(data), None
            return False, cat, filename, 0, f"Status {res.status}"
    except Exception as e:
        return False, cat, filename, 0, str(e)

def main():
    tasks = []
    for cat in CATEGORIES:
        cat_dir = os.path.join(MEDIA_DIR, cat)
        if not os.path.exists(cat_dir):
            continue
        for fname in os.listdir(cat_dir):
            if fname.startswith("."):
                continue
            ext = os.path.splitext(fname)[1].lower()
            if ext in [".jpg", ".jpeg", ".png", ".webp", ".avif"]:
                full_path = os.path.join(cat_dir, fname)
                tasks.append((cat, fname, full_path))

    total = len(tasks)
    total_bytes = sum(os.path.getsize(t[2]) for t in tasks)
    print(f"🚀 Iniciando migración a Supabase Storage Bucket: '{BUCKET}'")
    print(f"📊 Total imágenes a subir: {total} ({total_bytes / (1024*1024):.1f} MB)")
    print(f"⚡ Conexión: 8 hilos en paralelo...\n")

    uploaded = 0
    failed = 0
    bytes_uploaded = 0

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(upload_file, task): task for task in tasks}
        for future in as_completed(futures):
            success, cat, filename, size, err = future.result()
            if success:
                uploaded += 1
                bytes_uploaded += size
                if uploaded % 25 == 0 or uploaded == total:
                    pct = (uploaded / total) * 100
                    mb = bytes_uploaded / (1024 * 1024)
                    print(f"[{pct:5.1f}%] {uploaded}/{total} subidos ({mb:.1f} MB) - Último: {cat}/{filename}")
            else:
                failed += 1
                print(f"❌ Error en {cat}/{filename}: {err}")

    print("\n" + "=" * 50)
    print(f"✅ Migración finalizada:")
    print(f"   - Exitosos: {uploaded}/{total}")
    print(f"   - Fallidos: {failed}")
    print(f"   - Total transferido: {bytes_uploaded / (1024*1024):.1f} MB")
    print("=" * 50)

if __name__ == "__main__":
    main()
