/* ============================================================================
   main.js — theme toggle, TOC scroll-spy, footnote tooltips, tab widgets,
   client-side search.
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------ dark mode */
  // The initial class is applied by an inline script in <head> to avoid a
  // flash; here we only wire up the control and follow the OS afterwards.
  var root = document.documentElement;
  // Keep transitions off through the first paint; deferred scripts run after CSS loads.
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      root.removeAttribute("data-theme-init");
    });
  });
  var checkbox = document.getElementById("theme-toggle");
  var explicit = false;

  try {
    explicit = localStorage.getItem("theme") !== null;
  } catch (e) {
    /* storage unavailable (private mode) — fall back to OS preference */
  }

  function syncCheckbox() {
    if (checkbox) {
      checkbox.checked = root.classList.contains("u-mode-invert");
    }
  }

  function setTheme(dark, save) {
    root.classList.toggle("u-mode-invert", dark);
    if (save) {
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch (e) {
        /* ignore */
      }
    }
    syncCheckbox();
  }

  syncCheckbox();

  if (checkbox) {
    checkbox.addEventListener("change", function () {
      explicit = true;
      setTheme(this.checked, true);
    });
  }

  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var onSchemeChange = function (e) {
    if (!explicit) setTheme(e.matches, false);
  };
  if (mq.addEventListener) mq.addEventListener("change", onSchemeChange);
  else if (mq.addListener) mq.addListener(onSchemeChange);

  /* ----------------------------------------------------------- TOC visibility */
  var tocToggle = document.querySelector("[data-toc-toggle]");
  var mobileToc = window.matchMedia("(max-width: 991px)");

  function setTocOpen(open) {
    root.setAttribute("data-toc-open", open ? "true" : "false");
    if (tocToggle) tocToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function closeToc() {
    setTocOpen(false);
  }

  if (tocToggle && document.getElementById("toc")) {
    // The sidebar starts visible on desktop; the mobile panel starts closed.
    setTocOpen(!mobileToc.matches);

    tocToggle.addEventListener("click", function () {
      setTocOpen(root.getAttribute("data-toc-open") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.getAttribute("data-toc-open") === "true") {
        closeToc();
        tocToggle.focus();
      }
    });

    function onTocBreakpoint(e) {
      setTocOpen(!e.matches);
    }
    if (mobileToc.addEventListener)
      mobileToc.addEventListener("change", onTocBreakpoint);
    else if (mobileToc.addListener)
      mobileToc.addListener(onTocBreakpoint);

    window.addEventListener("hashchange", function () {
      if (mobileToc.matches) closeToc();
    });
  }

  /* ------------------------------------------------------------- TOC spy */
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.toc__link[href^="#"]')
  );

  if (tocLinks.length) {
    var headings = [];
    tocLinks.forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute("href").slice(1));
      var el = document.getElementById(id);
      if (el) headings.push({ el: el, link: link });
    });

    // Nested <li> ordering already matches document order, but sort defensively
    // so the "last heading above the fold" scan is correct.
    headings.sort(function (a, b) {
      return a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top;
    });

    var current = null;
    var ticking = false;

    function updateActive() {
      ticking = false;
      var offset = window.innerHeight * 0.3;
      var active = headings[0];

      for (var i = 0; i < headings.length; i++) {
        if (headings[i].el.getBoundingClientRect().top <= offset) {
          active = headings[i];
        } else {
          break;
        }
      }

      // Bottom of page: always light up the final heading.
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2
      ) {
        active = headings[headings.length - 1];
      }

      if (active && active.link !== current) {
        if (current) {
          current.classList.remove("is-active");
          current.removeAttribute("aria-current");
        }
        active.link.classList.add("is-active");
        active.link.setAttribute("aria-current", "location");
        current = active.link;
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActive);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateActive();

    // Native anchor navigation handles scrolling and browser history.
    tocLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (mobileToc.matches) closeToc();
      });
    });
  }

  /* ------------------------------------------------------- footnote tooltips */
  // Markdown renders footnotes as an endnote list; the source design shows the
  // note inline on hover. Clone each note into a positioned tooltip.
  if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelectorAll("a.footnote-ref").forEach(function (ref) {
      var id = (ref.getAttribute("href") || "").slice(1);
      if (!id) return;
      var note = document.getElementById(id);
      if (!note) return;

      var clone = note.cloneNode(true);
      clone.querySelectorAll("a.footnote-backref").forEach(function (a) {
        a.remove();
      });

      var tip = document.createElement("span");
      tip.className = "footnote-tooltip";
      tip.setAttribute("aria-hidden", "true");
      tip.innerHTML = clone.innerHTML;

      ref.parentNode.insertBefore(tip, ref.nextSibling);
    });
  }

  /* ------------------------------------------------------------------ tabs */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var buttons = Array.prototype.slice.call(
      group.querySelectorAll('[role="tab"]')
    );

    function select(index) {
      buttons.forEach(function (btn, i) {
        var selected = i === index;
        btn.setAttribute("aria-selected", selected ? "true" : "false");
        btn.setAttribute("tabindex", selected ? "0" : "-1");
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
    }

    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        select(i);
      });
      btn.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % buttons.length;
        else if (e.key === "ArrowLeft")
          next = (i - 1 + buttons.length) % buttons.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = buttons.length - 1;
        if (next === null) return;
        e.preventDefault();
        select(next);
        buttons[next].focus();
      });
    });

    if (buttons.length) select(0);
  });

  /* ------------------------------------------------------------- site search */
  var searchInput = document.getElementById("search-input");
  if (searchInput) {
    var listEl = document.getElementById("search-results");
    var statusEl = document.getElementById("search-status");
    var index = null;

    var load = function () {
      if (index) return Promise.resolve(index);
      return fetch(searchInput.dataset.indexUrl)
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          index = data;
          return index;
        });
    };

    var render = function (results, query) {
      listEl.innerHTML = "";
      if (!results.length) {
        statusEl.textContent = "No results for “" + query + "”.";
        return;
      }
      statusEl.textContent = results.length + " result(s).";
      results.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.permalink;
        a.textContent = item.title;
        li.appendChild(a);
        if (item.summary) {
          var p = document.createElement("p");
          p.className = "post-list__summary";
          p.textContent = item.summary;
          li.appendChild(p);
        }
        listEl.appendChild(li);
      });
    };

    var search = function () {
      var q = searchInput.value.trim().toLowerCase();
      if (q.length < 2) {
        listEl.innerHTML = "";
        statusEl.textContent = "";
        return;
      }
      load().then(function (data) {
        var results = data.filter(function (item) {
          return (
            (item.title && item.title.toLowerCase().indexOf(q) !== -1) ||
            (item.summary && item.summary.toLowerCase().indexOf(q) !== -1) ||
            (item.content && item.content.toLowerCase().indexOf(q) !== -1) ||
            (item.tags && item.tags.join(" ").toLowerCase().indexOf(q) !== -1)
          );
        });
        render(results.slice(0, 20), searchInput.value.trim());
      });
    };

    var timer;
    searchInput.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(search, 120);
    });

    if (searchInput.value) search();
  }
})();
