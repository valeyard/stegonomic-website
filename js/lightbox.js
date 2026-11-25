// Stegonomic project gallery lightbox
// ==================================================
// Click (or Enter/Space on) a thumbnail in .project-detail__gallery to see
// it full size in a modal <dialog>. Left/right arrows (keys or buttons) step
// through the gallery; Esc, the close button or a click outside the photo
// closes it.
//
// Plain DOM, no dependencies. Gallery <img>s for photos that don't exist yet
// remove themselves (onerror), so the image list is read at open time rather
// than once on load.
(function () {
  "use strict";

  var gallery = document.querySelector(".project-detail__gallery");
  if (!gallery || typeof HTMLDialogElement === "undefined") return;

  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Photo viewer");
  dialog.innerHTML =
    '<img class="lightbox__img" alt="">' +
    '<button type="button" class="lightbox__btn lightbox__close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous photo">&lsaquo;</button>' +
    '<button type="button" class="lightbox__btn lightbox__next" aria-label="Next photo">&rsaquo;</button>';
  document.body.appendChild(dialog);

  var big = dialog.querySelector(".lightbox__img");
  var prev = dialog.querySelector(".lightbox__prev");
  var next = dialog.querySelector(".lightbox__next");
  var images = [];
  var index = 0;

  function thumbs() {
    return Array.prototype.slice.call(gallery.querySelectorAll("img"));
  }

  function show(i) {
    index = (i + images.length) % images.length;
    big.src = images[index].currentSrc || images[index].src;
    big.alt = images[index].alt;
  }

  function open(img) {
    images = thumbs();
    var many = images.length > 1;
    prev.hidden = !many;
    next.hidden = !many;
    show(images.indexOf(img));
    dialog.showModal();
  }

  // make each thumbnail keyboard-reachable
  thumbs().forEach(function (img) {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "View larger: " + img.alt);
  });

  gallery.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG") open(e.target);
  });

  gallery.addEventListener("keydown", function (e) {
    if (e.target.tagName === "IMG" && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      open(e.target);
    }
  });

  prev.addEventListener("click", function () { show(index - 1); });
  next.addEventListener("click", function () { show(index + 1); });
  dialog.querySelector(".lightbox__close").addEventListener("click", function () {
    dialog.close();
  });

  // click on the dark backdrop (the dialog itself, not its contents) closes
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", function (e) {
    if (images.length < 2) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();
