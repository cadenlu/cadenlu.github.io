---
title: "Porting a Design System to Hugo"
subtitle: "Reading a compiled stylesheet backwards"
date: 2026-09-14
lastmod: 2026-09-16
draft: true
description: "How I extracted the tokens, type scale, and layout rules from a compiled Webflow stylesheet and rebuilt them as a Hugo theme."
summary: "A compiled Webflow stylesheet is still just CSS. Here is the process for pulling a coherent design system out of it — tokens first, then type, then layout — and re-expressing it as Hugo templates."
tags: ["hugo", "css", "design-systems"]
categories: ["Engineering"]
series: ["Building this site"]
keywords: ["hugo", "css", "design tokens", "webflow", "newsreader"]
weight: 1
toc: true
---

Most sites ship a stylesheet that is technically readable but structurally
hostile: one minified line, vendor resets interleaved with bespoke rules, and
custom properties named after the editor that generated them. Rebuilding the
look in a different system is therefore less a design exercise than an
archaeology one.

## Tokens come first

The single highest-leverage move is to extract the custom properties before
touching anything else. A `:root` block usually carries the entire palette,
type scale, and spacing system, and everything downstream is a reference to it.

The useful sorting is by *kind*, not by name:

1. **Raw swatches** — literal hex values with no meaning beyond the colour.
2. **Semantic aliases** — `background`, `text`, `border`, each pointing at a swatch.
3. **Derived values** — computed from a semantic alias with `color-mix()`.

That three-layer split is what makes dark mode a five-line change instead of a
second stylesheet. Override layer two, leave layers one and three alone.

## Then the type scale

Sizes declared in `em` are the tell that a scale is *relative* — headings sized
against a root font size, not against each other. Reproducing that faithfully
means resisting the urge to convert everything to `rem`. The relationships
matter more than the absolute numbers.

Watch for optical-size axes, too. A family with an `opsz` axis is effectively
two typefaces: the body text and the display headings are the same font at
different optical sizes, and `font-optical-sizing: auto` recovers that behaviour
for free.

## Layout last

By the time you get here the rules are mostly boring: a wide container, a narrow
container, and a breakpoint or two. The one decision worth deliberating is
whether the content column is centred in the viewport or in the space left over
by a fixed sidebar. Those are visibly different, and the source site made a
deliberate choice.

```css
.container {
  width: 100%;
  max-width: var(--container-wide);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}

.container--narrow {
  max-width: var(--container-narrow);
}
```

Centred in the viewport. The sidebar floats over otherwise-empty margin, which
is why it can be `position: fixed` without any layout coupling at all.

## What to leave behind

Not everything survives the port. Webflow emits a large amount of markup-driven
utility CSS that exists to serve its own editor; reproducing it would be
faithful to the wrong thing. The test I used: if a rule exists to make a visual
builder produce a particular DOM shape, it is scaffolding, and the Hugo
templates should just produce the right DOM directly.

The result is a stylesheet roughly a fifth the size that renders the same page.
