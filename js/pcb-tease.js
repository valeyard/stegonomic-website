// Stegonomic PCB tease
// ==================================================
// Toggles .pcb-tease's .is-glitching class at long, randomized intervals
// so the CSS glitch (pcb-tease.css) actually replays — a CSS animation on
// a class only plays once per class-add, not on a loop, so this is what
// makes it recur instead of firing a single time on page load.
//
// No dependency on jQuery/particles.js/anything else already loaded here
// — plain DOM, safe to include standalone at the end of the body.
(function () {
  "use strict";

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  var el = document.querySelector(".pcb-tease");
  if (!el) return;

  var GLITCH_DURATION_MS = 380;

  function randomDelay() {
    // Roughly every 20-45s. Rare enough that it reads as "wait, did that
    // just happen?" rather than a loop the eye tunes out after a minute.
    return 20000 + Math.random() * 25000;
  }

  function scheduleNext() {
    window.setTimeout(glitch, randomDelay());
  }

  function glitch() {
    el.classList.add("is-glitching");
    window.setTimeout(function () {
      el.classList.remove("is-glitching");
    }, GLITCH_DURATION_MS);
    scheduleNext();
  }

  scheduleNext();
})();
