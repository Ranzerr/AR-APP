"""Create numbered transparent PNG logos and tiny colored cube GLBs."""
import json
import os
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
LOGOS = ROOT / "assets" / "logos"
MODELS = ROOT / "assets" / "models"


def make_logo(number):
    image = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    color = (220, 174, 50, 255)
    draw.ellipse((18, 18, 494, 494), fill=(7, 26, 51, 255), outline=color, width=18)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 220)
    except OSError:
        font = ImageFont.load_default()
    label = str(number)
    bounds = draw.textbbox((0, 0), label, font=font)
    x = (512 - (bounds[2] - bounds[0])) / 2 - bounds[0]
    y = (512 - (bounds[3] - bounds[1])) / 2 - bounds[1]
    draw.text((x, y), label, fill=(255, 248, 231, 255), font=font)
    image.save(LOGOS / f"dept{number}.png")


def make_cube(number):
    # Positions, normals and UVs for a 24-vertex cube, followed by 36 indices.
    positions = [
        (-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1), (1,-1,-1),(-1,-1,-1),(-1,1,-1),(1,1,-1),
        (-1,1,1),(1,1,1),(1,1,-1),(-1,1,-1), (-1,-1,-1),(1,-1,-1),(1,-1,1),(-1,-1,1),
        (1,-1,1),(1,-1,-1),(1,1,-1),(1,1,1), (-1,-1,-1),(-1,-1,1),(-1,1,1),(-1,1,-1)
    ]
    normals = [(0,0,1)]*4 + [(0,0,-1)]*4 + [(0,1,0)]*4 + [(0,-1,0)]*4 + [(1,0,0)]*4 + [(-1,0,0)]*4
    uvs = [(0,0),(1,0),(1,1),(0,1)] * 6
    indices = []
    for face in range(6):
        start = face * 4
        indices += [start, start+1, start+2, start, start+2, start+3]
    blob = b"".join(struct.pack("<3f", *value) for value in positions)
    normal_blob = b"".join(struct.pack("<3f", *value) for value in normals)
    uv_blob = b"".join(struct.pack("<2f", *value) for value in uvs)
    index_blob = b"".join(struct.pack("<H", value) for value in indices)
    buffer = blob + normal_blob + uv_blob + index_blob
    color = [[0.92, 0.58, 0.10, 1.0], [0.12, 0.42, 0.72, 1.0], [0.20, 0.68, 0.48, 1.0], [0.78, 0.25, 0.23, 1.0]][(number - 1) % 4]
    gltf = {
        "asset": {"version": "2.0", "generator": "CU AR placeholder generator"},
        "scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0, "name": f"Department {number} placeholder"}],
        "meshes": [{"primitives": [{"attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, "indices": 3, "material": 0}]}],
        "materials": [{"pbrMetallicRoughness": {"baseColorFactor": color, "metallicFactor": 0.05, "roughnessFactor": 0.72}}],
        "buffers": [{"byteLength": len(buffer)}],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": len(blob), "target": 34962},
            {"buffer": 0, "byteOffset": len(blob), "byteLength": len(normal_blob), "target": 34962},
            {"buffer": 0, "byteOffset": len(blob) + len(normal_blob), "byteLength": len(uv_blob), "target": 34962},
            {"buffer": 0, "byteOffset": len(blob) + len(normal_blob) + len(uv_blob), "byteLength": len(index_blob), "target": 34963}
        ],
        "accessors": [
            {"bufferView": 0, "componentType": 5126, "count": 24, "type": "VEC3", "min": [-1,-1,-1], "max": [1,1,1]},
            {"bufferView": 1, "componentType": 5126, "count": 24, "type": "VEC3"},
            {"bufferView": 2, "componentType": 5126, "count": 24, "type": "VEC2"},
            {"bufferView": 3, "componentType": 5123, "count": 36, "type": "SCALAR"}
        ]
    }
    json_bytes = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
    json_bytes += b" " * ((4 - len(json_bytes) % 4) % 4)
    bin_bytes = buffer + b"\0" * ((4 - len(buffer) % 4) % 4)
    total = 12 + 8 + len(json_bytes) + 8 + len(bin_bytes)
    glb = struct.pack("<4sII", b"glTF", 2, total)
    glb += struct.pack("<II", len(json_bytes), 0x4E4F534A) + json_bytes
    glb += struct.pack("<II", len(bin_bytes), 0x004E4942) + bin_bytes
    (MODELS / f"dept{number}.glb").write_bytes(glb)


if __name__ == "__main__":
    LOGOS.mkdir(parents=True, exist_ok=True)
    MODELS.mkdir(parents=True, exist_ok=True)
    for number in range(1, 9):
        make_logo(number)
        make_cube(number)
    print("Created 8 placeholder logos and 8 placeholder GLB models.")
