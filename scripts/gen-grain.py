#!/usr/bin/env python3
"""Regenerate the paper-grain tiles in static/images/paper/.

The alembic.space paper shader adds independent, uniformly distributed grey
noise to every pixel: measured on an export, roughly U(-50, +50) on 0–255,
no correlation between neighbours, no colour, clipped at white. CSS cannot add
a signed value, so the noise is split across two tiles built from the same
draw, each pixel landing in exactly one of them:

  grain-lighten.png  +u where u > 0, else 0   composited with plus-lighter
  grain-darken.png   1 - |u|/PAPER where u < 0, else 1   composited with multiply

Multiplying by 1 - |u|/PAPER subtracts exactly |u| from the paper colour
(#f0eee6, ~240), so the paper gets the shader's additive noise; darker text is
darkened proportionally less, as an additive shader clipped at black would.

Usage:  make grain      (or: python3 scripts/gen-grain.py)
"""

from __future__ import annotations

import random
import struct
import zlib
from pathlib import Path

SIZE = 128        # tile edge in pixels; CSS draws it at one device pixel each
AMPLITUDE = 50    # u ~ U(-AMPLITUDE, +AMPLITUDE), in 0–255 units
PAPER = 240       # light-mode paper value the darken tile is calibrated to
SEED = 1          # fixed so regenerating does not churn the files
OUT = Path(__file__).resolve().parent.parent / "static" / "images" / "paper"


def write_grey_png(path: Path, rows: list[bytes]) -> None:
    """Write an 8-bit greyscale PNG (colour type 0) with no filtering."""
    def chunk(kind: bytes, data: bytes) -> bytes:
        return (struct.pack(">I", len(data)) + kind + data
                + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF))

    raw = b"".join(b"\x00" + row for row in rows)
    path.write_bytes(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", SIZE, SIZE, 8, 0, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def main() -> None:
    rng = random.Random(SEED)
    lighten: list[bytes] = []
    darken: list[bytes] = []
    for _ in range(SIZE):
        up = bytearray(SIZE)
        down = bytearray(SIZE)
        for x in range(SIZE):
            u = rng.randint(-AMPLITUDE, AMPLITUDE)
            up[x] = max(u, 0)
            down[x] = round(255 * (1 - max(-u, 0) / PAPER))
        lighten.append(bytes(up))
        darken.append(bytes(down))

    OUT.mkdir(parents=True, exist_ok=True)
    write_grey_png(OUT / "grain-lighten.png", lighten)
    write_grey_png(OUT / "grain-darken.png", darken)
    for name in ("grain-lighten.png", "grain-darken.png"):
        print(f"wrote {OUT / name} ({(OUT / name).stat().st_size} bytes)")


if __name__ == "__main__":
    main()
