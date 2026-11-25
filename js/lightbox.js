// Stegonomic project gallery lightbox
// ==================================================
// Click (or Enter/Space on) a thumbnail in .project-detail__gallery to see
// it full size in a modal <dialog>. Thumbnails can be <img> or muted looping
// <video>. Left/right arrows (keys or buttons) step through the gallery; Esc,
// the close button or a click outside the media closes it.
//
// Also: visitors who ask for reduced motion get autoplaying videos paused on
// their poster frame (with controls, outside the gallery) instead of looping.
//
// Plain DOM, no dependencies. Gallery <img>s for photos that don't exist yet
// remove themselves (onerror), so the media list is read at open time rather
// than once on load.
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    Array.prototype.forEach.call(document.querySelectorAll("video[autoplay]"), function (v) {
      v.removeAttribute("autoplay");
      v.pause();
      // gallery thumbnails stay click-to-enlarge; the enlarged copy gets controls
      if (!v.closest(".project-detail__gallery")) v.controls = true;
    });
  }

  var gallery = document.querySelector(".project-detail__gallery");
  if (!gallery || typeof HTMLDialogElement === "undefined") return;

  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Media viewer");
  dialog.innerHTML =
    '<img class="lightbox__img" alt="" hidden>' +
    '<video class="lightbox__img" muted loop playsinline hidden></video>' +
    '<button type="button" class="lightbox__btn lightbox__close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous">&lsaquo;</button>' +
    '<button type="button" class="lightbox__btn lightbox__next" aria-label="Next">&rsaquo;</button>';
  document.body.appendChild(dialog);

  var bigImg = dialog.querySelector("img.lightbox__img");
  var bigVid = dialog.querySelector("video.lightbox__img");
  var prev = dialog.querySelector(".lightbox__prev");
  var next = dialog.querySelector(".lightbox__next");
  var items = [];
  var index = 0;

  function isMedia(el) {
    return el.tagName === "IMG" || el.tagName === "VIDEO";
  }

  function thumbs() {
    return Array.prototype.slice.call(gallery.querySelectorAll("img, video"));
  }

  function show(i) {
    index = (i + items.length) % items.length;
    var item = items[index];
    var video = item.tagName === "VIDEO";

    bigImg.hidden = video;
    bigVid.hidden = !video;

    if (video) {
      bigImg.removeAttribute("src");
      bigVid.poster = item.poster;
      bigVid.src = item.currentSrc || item.src;
      bigVid.setAttribute("aria-label", item.getAttribute("data-label") || "");
      bigVid.controls = reduceMotion;
      if (!reduceMotion) bigVid.play().catch(function () {});
    } else {
      bigVid.pause();
      bigVid.removeAttribute("src");
      bigImg.src = item.currentSrc || item.src;
      bigImg.alt = item.alt;
    }
  }

  function open(el) {
    items = thumbs();
    var many = items.length > 1;
    prev.hidden = !many;
    next.hidden = !many;
    show(items.indexOf(el));
    dialog.showModal();
  }

  // make each thumbnail keyboard-reachable
  thumbs().forEach(function (el) {
    var label = el.alt || el.getAttribute("aria-label") || "";
    el.setAttribute("data-label", label);
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.setAttribute("aria-label", "View larger: " + label);
  });

  gallery.addEventListener("click", function (e) {
    if (isMedia(e.target)) open(e.target);
  });

  gallery.addEventListener("keydown", function (e) {
    if (isMedia(e.target) && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open(e.target);
    }
  });

  prev.addEventListener("click", function () { show(index - 1); });
  next.addEventListener("click", function () { show(index + 1); });
  dialog.querySelector(".lightbox__close").addEventListener("click", function () {
    dialog.close();
  });

  // stop the enlarged video when the viewer closes (Esc included)
  dialog.addEventListener("close", function () {
    bigVid.pause();
  });

  // click on the dark backdrop (the dialog itself, not its contents) closes
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", function (e) {
    if (items.length < 2) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
