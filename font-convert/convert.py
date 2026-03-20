"""Convert OTF/CFF fonts to TTF (glyf outlines) for browser canvas compatibility.

Chrome's OTS rejects CFF outlines (OTTO format) in both OTF and WOFF2 when
loaded via the FontFace API. Converting to TrueType quadratic outlines (glyf)
produces a font that passes OTS validation.
"""

import sys
from pathlib import Path
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.ttLib.tables._g_l_y_f import Glyph


MAX_ERR = 1.0  # max approximation error in font units


def otf_to_ttf(src: Path, dst: Path) -> None:
    font = TTFont(src)

    if 'CFF ' not in font:
        print(f"  skip {src.name} (not CFF)")
        font.save(str(dst))
        return

    glyph_order = font.getGlyphOrder()
    glyph_set = font.getGlyphSet()

    glyphs = {}
    glyph_widths = {}

    for name in glyph_order:
        item = glyph_set[name]
        glyph_widths[name] = item.width

        tt_pen = TTGlyphPen(None)
        cu2qu_pen = Cu2QuPen(tt_pen, MAX_ERR, reverse_direction=True)
        try:
            item.draw(cu2qu_pen)
            glyphs[name] = tt_pen.glyph()
        except Exception:
            glyphs[name] = Glyph()

    # Build glyf + loca
    font['glyf'] = newTable('glyf')
    font['glyf'].glyphs = glyphs
    font['glyf'].glyphOrder = glyph_order

    font['loca'] = newTable('loca')

    # Switch sfntVersion to TrueType
    font.sfntVersion = '\x00\x01\x00\x00'
    font['head'].indexToLocFormat = 0

    # Drop CFF-specific tables
    for tag in ('CFF ', 'CFF2', 'VORG'):
        if tag in font:
            del font[tag]

    font.save(str(dst), reorderTables=False)
    print(f"{src.name} → {dst.name}")


if __name__ == "__main__":
    src_paths = sys.argv[1:]
    if not src_paths:
        print("usage: uv run python convert.py <font.otf> [...]")
        sys.exit(1)

    for p in src_paths:
        src = Path(p)
        dst = src.with_suffix(".ttf")
        print(f"converting {src.name}...")
        otf_to_ttf(src, dst)
