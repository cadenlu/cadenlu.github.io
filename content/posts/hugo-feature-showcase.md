---
title: "Every Hugo Feature, Demonstrated"
subtitle: "A working tour of markdown, shortcodes, templates, and output formats"
date: 2026-09-24
lastmod: 2026-09-24
draft: true
description: "A single post that exercises the Hugo feature surface end to end: front matter, Goldmark extensions, shortcodes, syntax highlighting, math, diagrams, taxonomies, and output formats."
summary: "Rather than a list of features, this is a post that uses them. Everything below renders on this page — front matter, footnotes, definition lists, task lists, highlighted code with line numbers, custom shortcodes, KaTeX, Mermaid, series navigation, and related posts."
tags: ["hugo", "markdown", "shortcodes", "templates"]
categories: ["Engineering"]
series: ["Building this site"]
keywords: ["hugo", "goldmark", "chroma", "katex", "mermaid", "go templates"]
math: true
mermaid: true
toc: true
weight: 3
aliases: ["/showcase", "/posts/hugo-showcase"]
slug: "hugo-feature-showcase"
---

Everything on this page is real output, not a screenshot. If a feature is listed
here, it renders below — including the ones that are easy to claim and hard to
demonstrate, like footnotes,[^1] definition lists, and a table of contents built
from the heading tree.

The point is to have one page that fails loudly when a template regresses. Change
a layout, break a shortcode, or upgrade Hugo and this post is the canary.

## Front matter

The front matter on this file is doing real work:

```yaml {hl_lines=[7, 11]}
title: "Every Hugo Feature, Demonstrated"
subtitle: "A working tour of markdown, shortcodes, templates, and output formats"
date: 2026-09-24
lastmod: 2026-09-24
tags: ["hugo", "markdown", "shortcodes", "templates"]
categories: ["Engineering"]
series: ["Building this site"]
math: true
mermaid: true
toc: true
aliases: ["/showcase", "/posts/hugo-showcase"]
slug: "hugo-feature-showcase"
```

Each of those keys maps to something visible. `tags` and `categories` populate
the taxonomy pages and the footer under this post. `series` drives the navigation
block at the bottom. `aliases` writes redirect stubs so old URLs keep working.
`math` and `mermaid` turn on the conditional asset loaders in `<head>` — the page
you are reading is the only one that fetches KaTeX and Mermaid.

{{< callout type="note" title="Conditional by default" >}}
Loading KaTeX and Mermaid unconditionally would add roughly 350 KB to every page
on the site. Gating them behind a front-matter flag means the cost is paid only
where the feature is used.
{{< /callout >}}

## Inline markdown

Standard emphasis works as expected: **bold**, *italic*, ***bold italic***, and
~~strikethrough~~. Inline code looks like `hugo --gc --minify`. Links can be
absolute ([Hugo's documentation](https://gohugo.io/documentation/)) or bare
autolinks like https://gohugo.io, which Goldmark's linkify extension converts
without any markup.

Raw HTML passes through because `unsafe` is enabled in the renderer config, so
`<abbr>`, `<sup>`, `<sub>`, and `<mark>` all work: the
<abbr title="Static Site Generator">SSG</abbr> pattern, E = mc<sup>2</sup>,
H<sub>2</sub>O, and <mark>a highlighted phrase</mark>.

The typographer extension handles smart punctuation, so a straight-quoted `"like
this"` renders with curly quotes, three dots become an ellipsis…

### Heading levels three through six

The table of contents beside this post is generated from the heading tree, limited
to levels two and three by `markup.tableOfContents`. Deeper headings still get
anchor IDs, they are just not listed.

#### Level four

Level four headings render at 1.1em in the regular weight — a deliberate choice
in the source design, where hierarchy is carried by size more than by weight.

##### Level five

Level five is body-sized.

###### Level six

Level six is smaller than body copy and is the last level with an automatic
anchor.

## Lists

### Unordered, with nesting

- Goldmark parses the markdown
  - Hugo renders the templates
    - Chroma colours the code
- Hugo Pipes bundles the assets
- GitHub Actions deploys the output

### Ordered, with a custom start

5. Five
6. Six
7. Seven

### Definition lists

Definition lists are not part of CommonMark; Goldmark exposes them behind an
extension flag.

Hugo
: A static site generator written in Go. Builds this site in well under a
  second, which is the entire reason it was chosen over the alternatives.

Goldmark
: The CommonMark-compliant markdown parser Hugo uses. Extensions are
  opt-in via `markup.goldmark.extensions`, so the dialect is a decision rather
  than an accident.

Chroma
: The syntax highlighter. Emits CSS classes rather than inline styles, which is
  what makes the light/dark theme switch possible without re-highlighting.

### Task lists

- [x] Port the design system
- [x] Build the layouts
- [x] Write the shortcodes
- [ ] Rebuild the archived essays

## Tables

| Feature | Config key | Default |
| :--- | :---: | ---: |
| Footnotes | `extensions.footnote` | `false` |
| Definition lists | `extensions.definitionList` | `false` |
| Task lists | `extensions.taskList` | `false` |
| Typographer | `extensions.typographer` | `false` |
| Passthrough | `extensions.passthrough` | `false` |

Alignment is controlled per column with the colon syntax in the delimiter row —
left, centre, and right in the table above.

## Blockquotes

A single-level quote, which the design renders with a hairline rule rather than a
heavy bar:

> The best time to plant a tree was twenty years ago. The second best time is
> now.

Quotes nest, and the inner rule insets:

> An outer quote that makes a point.
>
> > And an inner quote that qualifies it.
>
> Back to the outer level.

## Footnotes

Footnotes are the feature most likely to break silently. This paragraph carries
one,[^2] and the one at the top of the post carries another.[^1] Both render as
superscript markers that link down to a list at the end of the article, with
backlinks that return you to the exact spot you left.

On screens wider than 768px, hovering a marker shows the note inline — the
tooltip is built client-side by cloning the target list item, which is why the
notes only exist once in the markup.

## Code

Fenced code blocks are highlighted by Chroma. With `noClasses = false` the output
is a set of class names, which is what lets the dark theme recolour a block
without re-rendering it.

```go
// Hugo's asset pipeline, as a template.
{{- $css := slice (resources.Get "css/chroma.css") (resources.Get "css/main.css")
      | resources.Concat "css/site.css" -}}
{{- $css = $css | minify | fingerprint "sha384" }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}"
      integrity="{{ $css.Data.Integrity }}" crossorigin="anonymous">
```

Line numbers, a highlight range, a non-default start, and a filename label are
all available through code fence attributes:

```python {title="build.py", linenos=table, linenostart=10, hl_lines=[9, 10]}
def build(site):
    """Render every page in the site."""
    pages = site.pages()
    for page in pages:
        page.render()

# The two highlighted lines below are the ones that
# actually touch the filesystem.
output = site.target_directory()
write_all(pages, output)
```

An unterminated-language fence falls back to plain text, and a fence with no
language at all skips highlighting entirely:

```
$ hugo --gc --minify
Start building sites …
hugo v0.166.0+extended+withdeploy
built in 143 ms
```

The `highlight` shortcode does the same job when you need to pass options
explicitly, at the cost of carrying its body in a shortcode block:

{{< highlight javascript "linenos=inline,hl_lines=3-4" >}}
const indexPath = document.getElementById('search-input').dataset.indexUrl;
const [index, setIndex] = [null, (v) => { index = v; }];

const load = () => index ? Promise.resolve(index)
  : fetch(indexPath).then((r) => r.json()).then(setIndex);
{{< /highlight >}}

## Shortcodes

### Built in

The `figure` shortcode wraps an image in `<figure>` with a `<figcaption>`, and
accepts `alt`, `caption`, `link`, `class`, `width`, and `height`:

{{< figure
  src="/images/type-scale.svg"
  alt="A specimen ladder showing the site's heading sizes from 3.1em down to 0.9em"
  caption="The type scale this site is built from. Optical sizing is automatic, so the display sizes use the same family at a larger optical size."
>}}

`ref` and `relref` resolve links through Hugo's page graph rather than as raw
URLs, so they break the build when the target disappears instead of shipping a
404. The links to [Porting a Design System]({{< ref "posts/porting-a-design-system.md" >}})
and [Deploying Hugo to GitHub Pages]({{< relref "posts/deploying-hugo-to-github-pages.md" >}})
are both resolved at build time.

`param` reads from page params with a fallback to site params. The author of this
site is {{< param "author" >}}.

`youtube` and `vimeo` embed a responsive player without any custom markup:

{{< youtube aqz-KE-bpKQ >}}

{{< vimeo 76979871 >}}

{{< details summary="What do the youtube and vimeo shortcodes emit?" >}}
A `<div class="w-video">` wrapper containing a 16:9 aspect-ratio iframe with
`loading="lazy"`, `allowfullscreen`, and a `title` attribute. No tracking scripts
are added — the iframe is the only third-party content.
{{< /details >}}

### Custom

A callout, which takes a type and an optional title:

{{< callout type="warning" title="Build-time failures are the good kind" >}}
`ref` and `relref` fail the build when their target is missing. That is
deliberate: a broken internal link should stop the deploy, not reach production.
{{< /callout >}}

{{< callout type="tip" title="Write the shortcode body as markdown" >}}
The custom shortcodes pipe their inner content through `markdownify`, so you can
use **bold**, `code`, [links](https://gohugo.io/), and lists inside them without
escaping anything.
{{< /callout >}}

Collapsible content, useful for asides that would otherwise interrupt the flow:

{{< details summary="How the tab shortcode keeps its panels in order" open="true" >}}
The outer `tabs` shortcode forces evaluation of its inner content by assigning
the inner block to a variable, which causes each `tab` to append itself to the
parent's `.Store`. The nav is then emitted before the panels, in insertion order.
{{< /details >}}

A tab group, switched without a page reload:

{{< tabs id="config-demo" label="Renderer configuration" >}}

{{< tab name="hugo.toml" >}}
```toml
[markup.goldmark.renderer]
  unsafe = true     # allow raw HTML in markdown
  hardWraps = false # a single newline is not a <br>
  xhtml = false
```
{{< /tab >}}

{{< tab name="markup table" >}}
| Option | Effect |
| --- | --- |
| `unsafe` | Raw HTML passes through |
| `hardWraps` | Newlines become `<br>` |
| `xhtml` | Self-closing tags in void elements |
{{< /tab >}}

{{< tab name="why" >}}
`unsafe = true` is required for `<abbr>`, `<kbd>`, and `<mark>` to survive the
markdown pass. It is safe here because every author on this site is also the
person reviewing the diff.
{{< /tab >}}

{{< /tabs >}}

Keycaps, for documenting shortcuts — {{< kbd "Cmd" "Shift" "P" >}} opens the
command palette, and {{< kbd "Esc" >}} closes it.

## Mathematics

With passthrough enabled, `$…$` is inline math and `$$…$$` is display math, and
both survive the markdown pass untouched so KaTeX can render them in the browser.

Inline math sits in the text flow: the identity $e^{i\pi} + 1 = 0$ needs no
markup beyond its delimiters, and neither does a longer expression like
$\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}$.

Display math gets its own block and its own line:

$$
\operatorname{Var}(X) = \mathbb{E}\left[(X - \mu)^2\right]
= \mathbb{E}[X^2] - \mu^2
$$

The `math` shortcode is equivalent, and is occasionally easier to read inside a
list:

- Pythagoras: {{< math >}}a^2 + b^2 = c^2{{< /math >}}
- Euler: {{< math >}}e^{i\pi} + 1 = 0{{< /math >}}
- Bayes: {{< math display="true" >}}P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}{{< /math >}}

## Diagrams

Mermaid runs client-side and re-renders when the colour scheme changes, so the
diagram matches the surrounding page rather than fighting it:

{{< mermaid caption="How a page becomes HTML." >}}
graph LR
  A[Markdown] --> B[Goldmark]
  B --> C[Go templates]
  C --> D[Hugo Pipes]
  D --> E[public/]
{{< /mermaid >}}

Sequence diagrams work the same way:

{{< mermaid >}}
sequenceDiagram
  participant U as Browser
  participant H as Hugo
  participant G as GitHub Pages
  U->>H: open the page
  H-->>U: HTML + CSS + JS
  U->>G: fetch /index.json
  G-->>U: search index
{{< /mermaid >}}

## Escaping shortcodes

Hugo expands shortcodes *before* it runs the markdown parser, which means a
shortcode written inside a code span still executes. To emit one literally, wrap
the delimiters in comment markers — this source:

<!-- prettier-ignore -->
```text
{{</* callout type="tip" */>}}
```

renders as the literal text `{{</* callout type="tip" */>}}` rather than as a
callout, which is how the examples throughout this post are quoted without being
executed.

## What the templates add

Everything above is content. The page furniture around it is template work, and
it is where most of the site's behaviour lives.

### Table of contents

Hugo parses the heading tree before rendering and exposes it as `.Fragments`.
The sidebar is a recursive partial over `.Fragments.Headings`, and a small
scroll-spy script marks the active entry as you move through the document.

### Taxonomies and series

`tags`, `categories`, and `series` are all configured in `hugo.toml`. Tags render
in the footer of this post and each has its own listing page. The series produces
the navigation block at the bottom, assembled from
`site.Taxonomies.series` and ordered by date.

### Related posts

Hugo scores relatedness across `keywords`, `tags`, `categories`, and `date`. The
`keywords` in this file's front matter exist purely to make that scoring useful
on a site with a small corpus.

{{< details summary="How related content is configured" >}}
```toml
[related]
  threshold = 80
  includeNewer = true
  toLower = false

  [[related.indices]]
    name = "keywords"
    weight = 100

  [[related.indices]]
    name = "tags"
    weight = 80
```
{{< /details >}}

### Output formats

The home page publishes three formats. `HTML` is what you are reading, `RSS` is
linked in the footer, and `JSON` is the search index that powers
[the search page]({{< relref "search.md" >}}) — one JSON array of every post,
queried client-side with `fetch` and a substring match.

### Metadata

Every page emits Open Graph tags, Twitter card tags, and a JSON-LD `BlogPosting`
with word count, publish and modified dates, author, and keywords. The `aliases`
in this file's front matter generate redirect stubs at `/showcase/` and
`/posts/hugo-showcase/`, each carrying a canonical link back to the real URL.

---

If you are reading this in production and something looks wrong, this page is
also the checklist: each section above exercises exactly one part of the
pipeline, so the broken one is the one that looks odd.

[^1]: This is the first footnote, rendered from Goldmark's `footnote` extension
    with a backlink that returns you to the marker at the top of the post.

[^2]: This is the second. Footnotes can contain *markup* — emphasis, `code`,
    [links](https://gohugo.io/), and even multiple paragraphs, though the last
    one is rarely a good idea. The tooltip that appears on hover is built by
    cloning this list item in JavaScript.
