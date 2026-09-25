# cadenlu.xyz

Personal site. [Hugo](https://gohugo.io/) static build, deployed to GitHub Pages
by `.github/workflows/`.

The visual system is a port of [darioamodei.com](https://darioamodei.com/) —
same ivory-and-slate palette, [Newsreader](https://fonts.google.com/specimen/Newsreader)
typeface, narrow single-column measure, bulleted home links, and a floating
table of contents on longer posts. The header keeps the site name, Archive and
Tags, the theme switch, and the post contents control; the footer carries the
copyright line and the `footer` menu (Archive). Article dates display month and
year.

## Requirements

- Hugo **extended** v0.146 or newer (the pinned version lives in
  `.github/workflows/`)
- Python 3 — only for `make chroma`

## Commands

```
make serve    # dev server with drafts, at :1313
make build    # production build into public/
make check    # build with path/unused-template warnings promoted to errors
make chroma   # regenerate assets/css/chroma.css (see below)
make clean    # drop public/ and the Hugo cache
```

## Layout

```
hugo.toml              config: markup, taxonomies, menus, outputs, related content
content/
  _index.md            home page intro
  archive.md           archive listing           (layout: archive)
  search.md            client-side search        (layout: search)
  posts/               the posts
    hello-world/       leaf bundle: index.md + rocks.webp (page resource)
data/links.toml        home-page external link groups — edit without touching templates
assets/css/main.css    the design system (tokens → resets → components → responsive)
assets/css/chroma.css  GENERATED syntax-highlight themes — see below
assets/js/main.js      theme toggle, TOC scroll-spy, footnote tooltips, tabs, search
assets/js/mermaid.js   diagram rendering, loaded only when a page sets `mermaid: true`
layouts/               templates, partials, and shortcodes
static/                passthrough files: og-card.png, images/
```

## Conventions worth knowing

**`unlisted: true`** in front matter keeps a page out of listings, the archive,
the search index, and the RSS feed. Utility pages (`archive.md`, `search.md`) use
it together with a per-page `[sitemap] disable = true`.

**Page bundles.** Post assets live in a leaf bundle next to the post, so
`content/posts/hello-world/index.md` owns `content/posts/hello-world/rocks.webp`:
a page resource of that post, published to `/posts/hello-world/rocks.webp`, and
reachable from the content as `{{< figure src="rocks.webp" >}}` or from a
template as `.Resources.Get "rocks.webp"` (which also exposes `.Width`/`.Height`
and Hugo's image processing). Contrast `content/_index.md`, which is a branch
bundle: files beside it are resources of the home page and publish to the site
root.

**Strip metadata from bundle images.** `content/posts/hello-world/rocks.webp` is
`cwebp -q 82 -m 6 -resize 640 480 -metadata none <src> -o <dest>` — no EXIF, XMP,
ICC, or text chunks survive. Re-encoding without `-metadata none` would carry the
source's metadata through.

**Conditional assets.** `math: true` and `mermaid: true` opt a page into KaTeX and
Mermaid. Neither is loaded site-wide — together they would add roughly 350 KB to
every page.

**Code fence attributes.** ` ```python {title="build.py", linenos=table, hl_lines=[9, 10]} `
drives the filename label, line numbers, and line highlighting.

**Shortcodes.** `callout`, `details`, `tabs`/`tab`, `kbd`, `math`, and `mermaid`
are defined in `layouts/shortcodes/`. The first four pipe their inner content
through `markdownify`, so markdown works inside them.

## Generating `chroma.css`

Chroma emits one stylesheet per style; this site needs two, scoped so the theme
toggle can swap them without re-highlighting:

```
make chroma
```

`scripts/gen-chroma.py` runs `hugo gen chromastyles` for
`catppuccin-latte` and `catppuccin-mocha`, drops the hard-coded backgrounds (the
code-block surface comes from `main.css`), and prefixes every dark rule with
`.u-mode-invert`. It fails loudly if any dark rule is left unscoped.

Do not edit `assets/css/chroma.css` by hand.

## Deploying

Push to `main`. The workflow installs the pinned Hugo, runs
`hugo --gc --minify`, and publishes `public/` through GitHub Pages. The custom
domain is set by `CNAME`.
