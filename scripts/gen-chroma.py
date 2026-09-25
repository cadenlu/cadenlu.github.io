#!/usr/bin/env python3
"""Regenerate assets/css/chroma.css.

Hugo's `gen chromastyles` emits a flat stylesheet for a single Chroma style.
This site needs two — one per colour mode — with the dark variant scoped under
`.u-mode-invert` so the theme toggle can swap them without re-highlighting.

The hard-coded `background-color` declarations are dropped: the code-block
surface, border, and radius come from main.css so they follow the design tokens.

Usage:  make chroma      (or: python3 scripts/gen-chroma.py)
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

LIGHT_STYLE = "catppuccin-latte"
DARK_STYLE = "catppuccin-mocha"
INVERT_CLASS = ".u-mode-invert"
OUT = Path(__file__).resolve().parent.parent / "assets" / "css" / "chroma.css"

HEADER = """/* ==========================================================================
   chroma.css — syntax highlighting, one block per colour mode.

   GENERATED FILE — do not edit by hand.
   Regenerate with:  make chroma

   Light rules are unscoped; dark rules are prefixed with `{invert}` so they
   only apply when the theme toggle sets that class on <html>. Background
   colours are omitted by design: the code-block surface comes from main.css.
   ======================================================================== */
""".format(invert=INVERT_CLASS)


def generate(style: str) -> str:
    """Run `hugo gen chromastyles` for one style."""
    try:
        proc = subprocess.run(
            ["hugo", "gen", "chromastyles", f"--style={style}"],
            capture_output=True,
            text=True,
            check=True,
        )
    except FileNotFoundError:
        sys.exit("error: `hugo` not found on PATH")
    except subprocess.CalledProcessError as exc:
        sys.exit(f"error: hugo gen chromastyles failed for {style}: {exc.stderr}")
    return proc.stdout


def strip_backgrounds(css: str) -> str:
    """Remove background-color declarations so the site's surface shows through."""
    return re.sub(r"background-color:[^;}]*;?", "", css)


def scope(css: str, prefix: str) -> list[str]:
    """Prefix each rule's selector while preserving its `/* Kind */` label."""
    rules: list[str] = []
    for raw in css.splitlines():
        line = raw.strip()
        if "{" not in line or line.startswith("/* Generated"):
            continue  # banner and blank lines
        brace = line.index("{")
        head, tail = line[:brace], line[brace:]
        if prefix:
            if "*/" in head:  # "/* Keyword */ .chroma .k" -> scope after the label
                cut = head.rindex("*/") + 2
                head = f"{head[:cut]} {prefix} {head[cut:].lstrip()}"
            else:
                head = f"{prefix} {head}"
        rules.append(f"{head.strip()} {tail}")
    return rules


def selector_of(rule: str) -> str:
    """Return the selector of a rule, dropping any leading `/* Kind */` label."""
    head = rule[: rule.index("{")]
    if "*/" in head:
        head = head[head.rindex("*/") + 2 :]
    return head.strip()


def main() -> None:
    light = scope(strip_backgrounds(generate(LIGHT_STYLE)), "")
    dark = scope(strip_backgrounds(generate(DARK_STYLE)), INVERT_CLASS)

    body = [HEADER.strip(), "", "/* ---------- light ---------- */", *light,
            "", "/* ---------- dark ---------- */", *dark, ""]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(body), encoding="utf-8")

    scoped = [r for r in dark if selector_of(r).startswith(INVERT_CLASS)]
    unscoped = [r for r in dark if r not in scoped]
    print(f"wrote {OUT.relative_to(OUT.parent.parent.parent)}")
    print(f"  light rules: {len(light)}")
    print(f"  dark rules:  {len(dark)} ({len(scoped)} scoped to {INVERT_CLASS})")
    if unscoped:
        for rule in unscoped[:5]:
            print(f"  unscoped: {rule}", file=sys.stderr)
        sys.exit("error: some dark rules were not scoped")


if __name__ == "__main__":
    main()
