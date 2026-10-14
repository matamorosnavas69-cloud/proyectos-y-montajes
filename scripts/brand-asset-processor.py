import os
import numpy as np
from PIL import Image
from collections import deque

def isolate_exterior_background(img_cropped, threshold=242, feather=1.5):
    """
    Flood-fill from image boundaries to mark exterior background as transparent.
    Interior white pixels (court lines, net, subbase layers) are preserved.
    """
    rgba = img_cropped.convert("RGBA")
    arr = np.array(rgba, dtype=np.float32)
    h, w, _ = arr.shape

    # Determine white/near-white mask
    # A pixel is considered background candidate if all RGB channels are >= threshold
    # and color saturation is near zero (gray/white)
    rgb = arr[:, :, :3]
    brightness = np.min(rgb, axis=2)
    diff = np.max(rgb, axis=2) - np.min(rgb, axis=2)
    is_white_candidate = (brightness >= threshold) & (diff < 15)

    # 2D connected component flood fill from edges
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()

    # Seed with borders
    for x in range(w):
        if is_white_candidate[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if is_white_candidate[h-1, x]:
            queue.append((h-1, x))
            visited[h-1, x] = True

    for y in range(h):
        if is_white_candidate[y, 0] and not visited[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if is_white_candidate[y, w-1] and not visited[y, w-1]:
            queue.append((y, w-1))
            visited[y, w-1] = True

    # BFS flood fill
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w:
                if not visited[ny, nx] and is_white_candidate[ny, nx]:
                    visited[ny, nx] = True
                    queue.append((ny, nx))

    # visited is True for exterior background
    alpha = np.ones((h, w), dtype=np.float32) * 255.0
    alpha[visited] = 0.0

    # Gentle anti-aliasing on transition boundary
    # For pixels adjacent to visited, if they are very bright, scale alpha smoothly
    for y in range(h):
        for x in range(w):
            if visited[y, x]:
                continue
            # Check if any neighbor is visited
            has_bg_neighbor = False
            for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and visited[ny, nx]:
                    has_bg_neighbor = True
                    break
            if has_bg_neighbor:
                b = brightness[y, x]
                if b > 220:
                    # smoothly ramp from 0 at 255 down to full opacity at 220
                    fade = 1.0 - ((b - 220) / (255 - 220))
                    alpha[y, x] = np.clip(fade * 255.0, 40.0, 255.0)

    arr[:, :, 3] = alpha
    return Image.fromarray(arr.astype(np.uint8))

print("Isolator utility defined.")
