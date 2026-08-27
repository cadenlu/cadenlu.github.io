+++
title = 'A Hugo post can do all this'
date = 2026-07-20T12:00:00-07:00
draft = true
designFixture = true
description = 'A kitchen-sink article demonstrating rich Markdown, images, code, tables, embeds, math, shortcodes, and page resources.'
tags = ['hugo', 'code', 'demo']
categories = ['site']
toc = true
tocBorder = true
mathjax = true
+++

This is a deliberately over-equipped post. It is here to test typography and
spacing while the site is being redesigned, and to act as a reference for
things a Hugo entry can contain.

The layout now treats the right column as part of the article rather than as
empty metadata space. Hugo's
{{< cite id="hugo-content" href="https://gohugo.io/content-management/" label="content system" >}}
Hugo turns Markdown and page resources into a static site at build time; no
client-side framework is required to render the article.
{{< /cite >}}
is a useful first citation: one short source attached to one link.

Several references can land on almost the same line. This sentence cites
{{< cite id="goldmark" href="https://gohugo.io/getting-started/configuration-markup/" label="Goldmark" >}}
Goldmark is Hugo's default Markdown renderer and controls parsing, render hooks,
and whether trusted inline HTML is allowed.
{{< /cite >}},
{{< cite id="page-bundles" href="https://gohugo.io/content-management/page-bundles/" label="page bundles" >}}
Leaf bundles keep a post's Markdown and its local images or data together in
one directory.
{{< /cite >}}, and
{{< cite id="shortcodes" href="https://gohugo.io/content-management/shortcodes/" label="shortcodes" >}}
Shortcodes provide reusable, parameterized HTML while keeping the post source
readable. This deliberately longer annotation tests collision handling when
three references occupy one prose cluster and the notes cannot all align to
their ideal vertical positions.
{{< /cite >}}
without letting the annotations overlap.

An annotation does not have to leave the site:
{{< cite id="editorial-aside" label="this editorial aside" >}}
This is a note rather than an external source. Keyboard focus should highlight
it just like pointer hover, while the absence of an `href` prevents it from
pretending to be a citation.
{{< /cite >}}.

## Ordinary Markdown {#ordinary-markdown}

Text can be **bold**, *italic*, ~~struck through~~, or written as
`inline code`. Links can point to [another post]({{< relref
"/posts/2026-07-22" >}}), and a sentence can carry a
footnote.[^bundle]

> Good defaults matter most when a post mixes prose, code, media, and data.
{.feature-quote}

- Unordered lists work.
- Nested lists work too.
  - So do second-level notes.
- Hugo keeps the source readable.

1. Write Markdown.
2. Add front matter.
3. Build a static site.

[^bundle]: This article is a leaf page bundle. Its Markdown and image live in
    the same directory, so the asset travels with the post.

## Images and figures

The illustration below is a page resource stored beside this post. Hugo page
bundles can keep images, data, audio, and other files next to the entry that
uses them.

{{< figure
  src="workbench.jpg"
  alt="A risograph-style desk with a notebook, chart, chalk bag, plant, and climbing hold"
  caption="An original workbench illustration bundled with this article."
  loading="lazy"
>}}

Plain Markdown images work too:

![A cropped detail of the same workbench illustration](workbench.jpg "The workbench")
{.wide-image}

With a custom image render hook or shortcode, Hugo can resize, crop, convert,
lazy-load, and generate responsive variants from processable page resources.

## Code with syntax highlighting

Fenced code blocks use Hugo's built-in highlighter. Options can add inline line
numbers and emphasize selected lines.

```python {linenos=inline hl_lines=[2,4] lineNoStart=7}
def compound(value: float, rate: float, years: int) -> float:
    """Return a value after annual compounding."""
    growth = 1 + rate
    return value * growth**years
```

The same post can mix languages:

```javascript
const topics = ["code", "markets", "lifting", "league"];
const current = topics.at(Math.floor(Math.random() * topics.length));
console.log(`today's rabbit hole: ${current}`);
```

## Tables and structured information

| Feature | Native Markdown | Hugo enhancement |
|:--|:--:|--:|
| Headings and lists | Yes | Attributes and render hooks |
| Code blocks | Yes | Highlighting and line numbers |
| Images | Yes | Page resources and processing |
| Video | No | Embedded shortcodes |
| Reusable callouts | No | Custom shortcodes |
{.feature-table}

## Collapsible sections

Hugo includes a `details` shortcode for optional material.

{{< details summary="Open the implementation note" >}}
This text is still Markdown, so it can contain **emphasis**, lists, links, and
`code`. Collapsible sections are useful for spoilers, derivations, or details
that would interrupt the main flow.
{{< /details >}}

## Custom callouts

Shortcodes are small templates that turn a compact authoring syntax into
consistent HTML.

{{< callout title="Design note" tone="signal" >}}
This callout comes from a project-level shortcode. A future design can restyle
every callout without editing every post.
{{< /callout >}}

## Video and other embeds

Hugo ships with shortcodes for YouTube, Vimeo, Instagram, X posts, figures,
QR codes, highlighting, references, and more. This example uses the video from
Hugo's own shortcode documentation.

{{< youtube id="0RKpf3rK57I" loading="lazy" title="An embedded video demonstrating Hugo content" >}}

Raw HTML is also enabled in this project, which means trusted posts can include
responsive iframes or native elements when a shortcode does not exist:

<iframe
  title="A tiny embedded color specimen"
  srcdoc="<!doctype html><style>html{font:16px system-ui;background:#111;color:#f4f0e6}body{margin:0;padding:2rem}b{color:#c8f52a}</style><b>Embedded HTML</b><p>This document lives inside the post.</p>"
  width="100%"
  height="180"
  loading="lazy"
  style="border:0;border-radius:8px"
></iframe>

## Math

This theme already conditionally loads MathJax for posts that opt in through
front matter. That makes inline expressions such as $E[X] = \sum_x xp(x)$ and
display equations possible:

$$
G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots
$$

## Generated media

Hugo can also generate a QR code during the build:

{{< qr
  text="https://cadenlu.xyz/"
  alt="QR code linking to cadenlu.xyz"
  loading="lazy"
  scale=3
/>}}

---

That is enough material to expose almost every weak spot in a blog design:
measure, hierarchy, focus styles, captions, overflow, embeds, code, tables, and
wide media. If a design makes this page pleasant to read, the simple posts will
be easy.
