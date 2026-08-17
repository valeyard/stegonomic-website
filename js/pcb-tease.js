// Stegonomic PCB tease
// ==================================================
// Toggles .pcb-tease's .is-glitching class at randomized intervals so the
// CSS glitch (pcb-tease.css) actually replays — a CSS animation on a
// class only plays once per class-add, not on a loop, so this is what
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
  // Green most of the time; amber (pcbgame's other CRT phosphor option,
  // see css/pcb-tease.css's .is-amber) on roughly a third of glitches —
  // "occasionally," not every other time, so green still reads as the
  // default.
  var AMBER_CHANCE = 0.3;

  function randomDelay() {
    // Roughly every 6-14s.
    return 6000 + Math.random() * 8000;
  }

  function scheduleNext() {
    window.setTimeout(glitch, randomDelay());
  }

  function glitch() {
    var amber = Math.random() < AMBER_CHANCE;
    el.classList.add("is-glitching");
    if (amber) el.classList.add("is-amber");
    window.setTimeout(function () {
      el.classList.remove("is-glitching");
      el.classList.remove("is-amber");
    }, GLITCH_DURATION_MS);
    scheduleNext();
  }

  scheduleNext();
})();
