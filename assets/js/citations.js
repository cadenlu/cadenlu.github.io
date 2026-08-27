(function () {
  "use strict";

  var DESKTOP_QUERY = "(min-width: 901px)";
  var NOTE_GAP = 16;

  function init() {
    var article = document.querySelector(".article-layout > article");
    var rail = document.querySelector(".sidenote-rail");
    var sources = Array.prototype.slice.call(document.querySelectorAll(".citation__source"));
    if (!article || !rail || !sources.length) return;

    var notes = sources.map(function (source) {
      var citation = source.closest(".citation");
      var note = document.createElement("aside");
      note.className = "sidenote";
      note.dataset.citation = citation.dataset.citation;
      note.setAttribute("aria-label", "Citation " + source.querySelector(".citation__number").textContent);
      note.innerHTML = source.innerHTML;
      rail.appendChild(note);

      function setActive(active) {
        citation.classList.toggle("citation--active", active);
        note.classList.toggle("sidenote--active", active);
      }
      citation.addEventListener("mouseenter", function () { setActive(true); });
      citation.addEventListener("mouseleave", function () { setActive(false); });
      citation.addEventListener("focusin", function () { setActive(true); });
      citation.addEventListener("focusout", function () { setActive(false); });

      return { citation: citation, note: note };
    });

    function layout() {
      if (!window.matchMedia(DESKTOP_QUERY).matches) return;

      var articleTop = article.getBoundingClientRect().top;
      var previousBottom = 0;
      notes.forEach(function (entry) {
        var idealTop = entry.citation.getBoundingClientRect().top - articleTop;
        var top = Math.max(idealTop, previousBottom + NOTE_GAP);
        entry.note.style.top = top + "px";
        previousBottom = top + entry.note.offsetHeight;
      });
    }

    var frame;
    function schedule() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(layout);
    }

    window.addEventListener("load", schedule);
    window.addEventListener("resize", schedule);
    document.fonts && document.fonts.ready.then(schedule);
    Array.prototype.forEach.call(article.querySelectorAll("img, iframe"), function (media) {
      media.addEventListener("load", schedule);
    });
    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(article);
    schedule();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();