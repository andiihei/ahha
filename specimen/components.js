(function () {
  "use strict";

  function slice(list) { return Array.prototype.slice.call(list); }

  /* ---------- Stage scoping ----------
     Every stage body carries a data-scheme scope. The family
     chips re-derive the family half; the Light/Dark chips set
     the mode half. The chips are the stage's own controls —
     the demo Selector Button in the first stage is a separate
     consumer and never touches the stage's scope. */
  slice(document.querySelectorAll("[data-stage]")).forEach(function (stage) {
    var body = stage.querySelector("[data-stage-body]");
    var name = stage.querySelector("[data-scope-name]");
    function current() {
      var fam = body.getAttribute("data-style") || "neutral";
      var mode = body.getAttribute("data-mode") || "default";
      return { fam: fam, mode: mode };
    }
    function apply(fam, mode) {
      body.setAttribute("data-style", fam);
      body.setAttribute("data-mode", mode);
      if (name) name.textContent = fam + " / " + mode;
    }
    slice(stage.querySelectorAll("[data-fam-chip]")).forEach(function (chip) {
      chip.addEventListener("click", function () {
        slice(stage.querySelectorAll("[data-fam-chip]")).forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        apply(chip.getAttribute("data-fam-chip"), current().mode);
      });
    });
    slice(stage.querySelectorAll("[data-mode-chip]")).forEach(function (chip) {
      chip.addEventListener("click", function () {
        slice(stage.querySelectorAll("[data-mode-chip]")).forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        apply(current().fam, chip.getAttribute("data-mode-chip"));
      });
    });
  });

  /* ---------- Demo Selector Button ----------
     A second consumer of the same component as the top row's,
     fed deliberately meaningless options (Alpha / Beta /
     Gamma) to prove the component is generic: its
     selection-change notifications go only to the readout
     under the stage. It never touches the page's data-mode or
     the stage's scheme scope — the stage's family and mode
     chips do that. Open/close, arrow keys, Esc, and
     outside-click mirror the top-row instance's mechanics. */
  var demoSelector = document.querySelector("[data-demo-selector]");
  if (demoSelector) {
    var demoTrigger = demoSelector.querySelector("[data-demo-selector-trigger]");
    var demoLabel = demoSelector.querySelector("[data-demo-selector-label]");
    var demoReadout = document.querySelector("[data-demo-selector-readout]");
    var demoOptions = slice(demoSelector.querySelectorAll("[data-demo-selector-option]"));
    var demoGlyphs = slice(demoSelector.querySelectorAll("[data-demo-glyph]"));
    var demoNames = { alpha: "Alpha", beta: "Beta", gamma: "Gamma" };
    var selection = "alpha";
    var setOpen = function (open) {
      demoSelector.setAttribute("data-open", open ? "true" : "false");
      demoTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    };
    var isOpen = function () { return demoSelector.getAttribute("data-open") === "true"; };
    var render = function () {
      demoOptions.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-demo-selector-option") === selection ? "true" : "false");
      });
      demoGlyphs.forEach(function (g) {
        if (g.getAttribute("data-demo-glyph") === selection) g.classList.add("is-current");
        else g.classList.remove("is-current");
      });
      demoLabel.textContent = demoNames[selection];
      demoTrigger.setAttribute("aria-label", "Demo selector: " + demoNames[selection]);
      if (demoReadout) {
        demoReadout.innerHTML = "Selection reported: <strong>" + selection + "</strong>.";
      }
    };
    demoTrigger.addEventListener("click", function () { setOpen(!isOpen()); });
    demoOptions.forEach(function (b, index) {
      b.addEventListener("click", function () {
        selection = b.getAttribute("data-demo-selector-option");
        render();
        setOpen(false);
        demoTrigger.focus();
      });
      b.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown") next = demoOptions[(index + 1) % demoOptions.length];
        else if (event.key === "ArrowUp") next = demoOptions[(index - 1 + demoOptions.length) % demoOptions.length];
        else if (event.key === "Home") next = demoOptions[0];
        else if (event.key === "End") next = demoOptions[demoOptions.length - 1];
        if (next) { event.preventDefault(); next.focus(); }
      });
    });
    demoSelector.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        event.preventDefault();
        setOpen(false);
        demoTrigger.focus();
      }
    });
    demoTrigger.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
        var target = demoOptions.filter(function (b) {
          return b.getAttribute("data-demo-selector-option") === selection;
        })[0] || demoOptions[0];
        if (target) target.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (isOpen() && !demoSelector.contains(event.target)) setOpen(false);
    });
    document.addEventListener("focusin", function (event) {
      if (isOpen() && !demoSelector.contains(event.target)) setOpen(false);
    });
    render();
    setOpen(false);
  }

  /* ---------- Demo toggles ----------
     A disabled <button> fires no click, so the disabled pair
     is inert without any guard here — as the contract says. */
  slice(document.querySelectorAll("[data-toggle]")).forEach(function (t) {
    t.addEventListener("click", function () {
      var on = t.getAttribute("aria-checked") === "true";
      t.setAttribute("aria-checked", on ? "false" : "true");
      var item = t.closest(".demo-item");
      var state = item ? item.querySelector("[data-toggle-state]") : null;
      if (state) state.textContent = on ? "Off" : "On";
    });
  });

  /* ---------- Demo action buttons ---------- */
  var actionReadout = document.querySelector("[data-action-readout]");
  slice(document.querySelectorAll("[data-action-name]")).forEach(function (b) {
    b.addEventListener("click", function () {
      if (actionReadout) actionReadout.textContent = b.getAttribute("data-action-name");
    });
  });
})();
