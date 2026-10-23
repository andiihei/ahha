(function () {
  "use strict";

  /* ---------- Selector Button (top row): the Mode Switch application ----------
     The .selector-btn component is generic: a trigger pill
     showing the current selection and an options panel that
     slides out below it; it only reports selection changes.
     The wiring in this block is the shell's Mode Switch
     application — the options are Light / System / Dark, and
     a reported selection sets data-mode on <html>; the
     page-scope CSS does everything else — "system" resolves
     through prefers-color-scheme in CSS, so OS changes apply
     live with no JS involvement. The choice is held for this
     page view only. */
  var selectorBtn = document.querySelector("[data-selector-btn]");
  var selectorOptions = Array.prototype.slice.call(document.querySelectorAll("[data-selector-option]"));
  var menuModeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-menu-mode-option]"));
  if (selectorBtn && selectorOptions.length) {
    var selectorTrigger = selectorBtn.querySelector("[data-selector-trigger]");
    var selectorLabel = selectorBtn.querySelector("[data-selector-current-label]");
    var modeNames = { "default": "Light", system: "System", invert: "Dark", light: "Light", dark: "Dark" };
    var setOpen = function (open) {
      selectorBtn.setAttribute("data-open", open ? "true" : "false");
      selectorTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    };
    var isOpen = function () { return selectorBtn.getAttribute("data-open") === "true"; };
    var setMode = function (mode) {
      document.documentElement.setAttribute("data-mode", mode);
      selectorOptions.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-selector-option") === mode ? "true" : "false");
      });
      menuModeButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-menu-mode-option") === mode ? "true" : "false");
      });
      selectorLabel.textContent = modeNames[mode] || modeNames.system;
      selectorTrigger.setAttribute("aria-label", "Colour mode: " + (modeNames[mode] || modeNames.system));
    };
    var focusOption = function (mode) {
      var target = selectorOptions.filter(function (b) {
        return b.getAttribute("data-selector-option") === mode;
      })[0] || selectorOptions[0];
      if (target) target.focus();
    };
    selectorTrigger.addEventListener("click", function () { setOpen(!isOpen()); });
    selectorOptions.forEach(function (b, index) {
      b.addEventListener("click", function () {
        setMode(b.getAttribute("data-selector-option"));
        setOpen(false);
        selectorTrigger.focus();
      });
      b.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown") next = selectorOptions[(index + 1) % selectorOptions.length];
        else if (event.key === "ArrowUp") next = selectorOptions[(index - 1 + selectorOptions.length) % selectorOptions.length];
        else if (event.key === "Home") next = selectorOptions[0];
        else if (event.key === "End") next = selectorOptions[selectorOptions.length - 1];
        if (next) { event.preventDefault(); next.focus(); }
      });
    });
    selectorBtn.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        setOpen(false);
        selectorTrigger.focus();
      }
    });
    selectorTrigger.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
        focusOption(document.documentElement.getAttribute("data-mode") || "system");
      }
    });
    document.addEventListener("click", function (event) {
      if (isOpen() && !selectorBtn.contains(event.target)) setOpen(false);
    });
    document.addEventListener("focusin", function (event) {
      if (isOpen() && !selectorBtn.contains(event.target)) setOpen(false);
    });

    /* ---------- Extra-compact nav menu ----------
       At the extra-compact tier the top row defers to the
       hamburger button. Its panel carries the page links above
       the Mode Switch at the bottom as three inline pills — the
       same setMode wiring, so the two controls can never disagree.
       The menu closes from the button (its glyph swaps to a
       × while open), on Escape, or on any tap/click outside
       the panel. Choosing a mode keeps the menu open so the
       change is visible in place. */
    var navBurger = document.querySelector("[data-nav-burger]");
    var navMenu = document.querySelector("[data-nav-menu]");
    if (navBurger && navMenu) {
      var setMenuOpen = function (open) {
        navMenu.classList.toggle("is-open", open);
        navBurger.classList.toggle("is-open", open);
        navBurger.setAttribute("aria-expanded", open ? "true" : "false");
        navBurger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      var menuIsOpen = function () { return navMenu.classList.contains("is-open"); };
      navBurger.addEventListener("click", function () { setMenuOpen(!menuIsOpen()); });
      menuModeButtons.forEach(function (b) {
        b.addEventListener("click", function () {
          setMode(b.getAttribute("data-menu-mode-option"));
        });
      });
      document.addEventListener("click", function (event) {
        if (menuIsOpen() && !navMenu.contains(event.target) && !navBurger.contains(event.target)) setMenuOpen(false);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menuIsOpen()) {
          setMenuOpen(false);
          navBurger.focus();
        }
      });
    }
    setMode(document.documentElement.getAttribute("data-mode") || "system");
    setOpen(false);
  }
})();
