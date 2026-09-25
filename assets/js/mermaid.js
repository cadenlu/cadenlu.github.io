/* ============================================================================
   mermaid.js — client-side diagram rendering, themed from the site palette.
   Loaded only on pages with `mermaid: true` in front matter.
   ========================================================================= */
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

/* Mirrors the tokens in main.css. Kept as literals rather than read from the
   stylesheet so diagrams are correct on the first paint, before layout. */
const THEMES = {
  light: {
    primaryColor: "#e8e6dc",
    primaryTextColor: "#1f1e1d",
    primaryBorderColor: "#b0aea5",
    lineColor: "#87867f",
    textColor: "#1f1e1d",
    mainBkg: "#e8e6dc",
    nodeBorder: "#b0aea5",
    secondaryColor: "#d1cfc5",
    tertiaryColor: "#faf9f5",
    clusterBkg: "#f0eee6",
    clusterBorder: "#d1cfc5",
    titleColor: "#1f1e1d",
    edgeLabelBackground: "#f0eee6",
    actorBkg: "#e8e6dc",
    actorBorder: "#b0aea5",
    actorTextColor: "#1f1e1d",
    actorLineColor: "#87867f",
    signalColor: "#1f1e1d",
    signalTextColor: "#1f1e1d",
    noteBkgColor: "#e8e6dc",
    noteTextColor: "#1f1e1d",
    noteBorderColor: "#b0aea5",
    labelBoxBkgColor: "#e8e6dc",
    labelBoxBorderColor: "#b0aea5",
    labelTextColor: "#1f1e1d",
    loopTextColor: "#1f1e1d",
    sequenceNumberColor: "#f0eee6",
  },
  dark: {
    primaryColor: "#3d3d3a",
    primaryTextColor: "#f0eee6",
    primaryBorderColor: "#5e5d59",
    lineColor: "#b0aea5",
    textColor: "#f0eee6",
    mainBkg: "#3d3d3a",
    nodeBorder: "#5e5d59",
    secondaryColor: "#2e2d2b",
    tertiaryColor: "#2e2d2b",
    clusterBkg: "#1f1e1d",
    clusterBorder: "#5e5d59",
    titleColor: "#f0eee6",
    edgeLabelBackground: "#1f1e1d",
    actorBkg: "#3d3d3a",
    actorBorder: "#5e5d59",
    actorTextColor: "#f0eee6",
    actorLineColor: "#b0aea5",
    signalColor: "#f0eee6",
    signalTextColor: "#f0eee6",
    noteBkgColor: "#3d3d3a",
    noteTextColor: "#f0eee6",
    noteBorderColor: "#5e5d59",
    labelBoxBkgColor: "#3d3d3a",
    labelBoxBorderColor: "#5e5d59",
    labelTextColor: "#f0eee6",
    loopTextColor: "#f0eee6",
    sequenceNumberColor: "#1f1e1d",
  },
};

const sources = new Map(
  [...document.querySelectorAll(".mermaid")].map((el) => [el, el.textContent])
);

/* Mermaid's computed bounding box is unreliable for flowcharts here — it can
   omit the trailing nodes, which clips the last one against the column edge.
   Rebuild the viewBox from the painted geometry instead. */
function fitToContent(svg, pad = 8) {
  let box;
  try {
    box = svg.getBBox();
  } catch {
    return; // detached or unmeasurable
  }
  if (!box.width || !box.height) return;

  const w = box.width + pad * 2;
  const h = box.height + pad * 2;
  svg.setAttribute(
    "viewBox",
    `${box.x - pad} ${box.y - pad} ${w} ${h}`
  );
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.removeAttribute("height");
  svg.style.maxWidth = `${Math.ceil(w)}px`;
  svg.style.width = "100%";
  svg.style.height = "auto";
}

const draw = async () => {
  const dark = document.documentElement.classList.contains("u-mode-invert");
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      ...THEMES[dark ? "dark" : "light"],
      fontFamily: "Newsreader, Times New Roman, serif",
      fontSize: "16px",
    },
    // SVG labels. The HTML-label path measures an order of magnitude too wide
    // inside this layout, which collapses the diagram to an illegible size.
    htmlLabels: false,
    flowchart: { htmlLabels: false, useMaxWidth: true },
    sequence: { useMaxWidth: true },
  });

  for (const [el, src] of sources) {
    el.removeAttribute("data-processed");
    el.textContent = src;
  }
  await mermaid.run({ nodes: [...sources.keys()] });
  document.querySelectorAll(".mermaid svg").forEach((svg) => fitToContent(svg));
};

await document.fonts.ready;
await draw();
document
  .getElementById("theme-toggle")
  ?.addEventListener("change", () => {
    void draw();
  });
