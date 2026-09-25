---
title: "Deploying Hugo to GitHub Pages"
subtitle: "One workflow, no build artifacts in git"
date: 2026-09-20
draft: true
description: "The GitHub Actions workflow that builds this site, and the details that matter: pinned Hugo versions, submodules, cache, and the artifact upload."
summary: "GitHub Pages wants a directory of static files. Hugo produces exactly that. The workflow between the two is short, but a few details — version pinning, the deploy permissions, and the base URL override — are easy to get wrong."
tags: ["hugo", "github-actions", "deployment"]
categories: ["Engineering"]
series: ["Building this site"]
keywords: ["hugo", "github pages", "actions", "ci"]
weight: 2
toc: true
---

The shape of the pipeline is fixed: install Hugo, run `hugo`, hand the resulting
`public/` directory to the Pages deploy action. Everything interesting is in the
details around that.

## Pin the version

```yaml {hl_lines=[2]}
env:
  HUGO_VERSION: 0.164.0
steps:
  - name: Install Hugo CLI
    run: |
      wget -O ${{ runner.temp }}/hugo.deb \
        https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb
      sudo dpkg -i ${{ runner.temp }}/hugo.deb
```

An unpinned Hugo is a build that works today and breaks on a Tuesday. Pin the
version in the workflow and upgrade it deliberately.

{{< callout type="warning" title="Extended, not standard" >}}
The `extended` build is required for SCSS transpilation and for Hugo Pipes
features that depend on it. The `_extended_` infix in the download URL is load
bearing — the standard build will fail on any site that touches Sass.
{{< /callout >}}

## Base URL

GitHub Pages serves project sites from a subpath. Hugo needs to know that, or
every absolute URL in the output points at the wrong place:

```yaml
- name: Build with Hugo
  env:
    HUGO_ENVIRONMENT: production
  run: hugo --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}/"
```

For a user site — a repository named `<user>.github.io` — the base URL is the
domain root, and the override is harmless either way.

## Permissions

The deploy job needs an ID token and permission to write a Pages deployment.
Both are declared once at the workflow level:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

{{< callout type="note" title="Concurrency" >}}
Set `cancel-in-progress: false`. Cancelling a Pages deployment mid-flight can
leave the environment in a state where the next deploy fails, and the cost of
letting a redundant build finish is a few seconds of runner time.
{{< /callout >}}

## Cache

`HUGO_CACHEDIR` points at a directory the runner will persist between builds.
Poppingulate it from `${{ runner.temp }}` and the image-processing and
resource-generation steps stop re-doing work on every push.
