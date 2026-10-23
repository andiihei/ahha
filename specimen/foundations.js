(function () {
  "use strict";
  var rootStyle = getComputedStyle(document.documentElement);
  function tokenValue(name) {
    return rootStyle.getPropertyValue(name).trim();
  }
  function fmtPx(v) {
    return (Math.round(v * 10) / 10).toString().replace(/\.0$/, "") + "px";
  }

  var FAMILIES = [
    { id: "neutral", name: "Neutral", note: "The anchor family and the default neutral (Midnight) — elevation shadows reference its 1000." },
    { id: "purple", name: "Purple", note: "Fixed hue 310.12° throughout (Purple Rain)." },
    { id: "green", name: "Green", note: "Torsion ramp (Fern) — teal 199.8° at the dark end walking to green 158° at the light end." },
    { id: "red", name: "Red", note: "Highest chroma in the set (Cerise) — 0.202 at step 500." },
    { id: "yellow", name: "Yellow", note: "Deliberate torsion (Marigold) — amber 60.7° at the dark end, because yellow muddies there, shifting to 100.4° as it lightens." },
    { id: "blue", name: "Blue", note: "Fixed hue 260.5° throughout (Cobalt)." }
  ];
  var STEPS = [1000, 950, 900, 800, 700, 500, 300, 200, 100, 50, 25];

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }
  function copyText(text) {
    function done() { showToast("Copied " + text); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); }
      catch (e) { showToast(text); }
      document.body.removeChild(ta);
    }
  }

  /* ---------- 2. Colour ramps ---------- */
  var rampsEl = document.getElementById("ramps");
  FAMILIES.forEach(function (fam) {
    var wrap = document.createElement("div");
    wrap.className = "family";
    var head = document.createElement("div");
    head.className = "family-head";
    var h = document.createElement("h3");
    h.textContent = fam.name;
    var note = document.createElement("span");
    note.className = "family-note";
    note.textContent = fam.note;
    head.appendChild(h);
    head.appendChild(note);
    wrap.appendChild(head);

    var ramp = document.createElement("div");
    ramp.className = "ramp";
    STEPS.forEach(function (step) {
      var varName = "--" + fam.id + "-" + step;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch " + ((step >= 700 || (step === 500 && fam.id !== "yellow")) ? "on-dark" : "on-light");
      btn.style.background = "var(" + varName + ")";
      btn.setAttribute("aria-label", fam.name + " " + step + " — copy var(" + varName + ")");
      var num = document.createElement("span");
      num.className = "step-num";
      num.textContent = step;
      var val = document.createElement("span");
      val.className = "step-val";
      val.textContent = tokenValue(varName);
      btn.appendChild(num);
      btn.appendChild(val);
      btn.addEventListener("click", function () { copyText("var(" + varName + ")"); });
      ramp.appendChild(btn);
    });
    wrap.appendChild(ramp);
    rampsEl.appendChild(wrap);
  });

  /* ---------- 2b. Opacity scale ---------- */
  var OPACITY_STEPS = [0, 5, 10, 15, 20, 30, 40, 50, 65, 80, 100];
  var opacityEl = document.getElementById("opacity-scale");
  OPACITY_STEPS.forEach(function (step) {
    var varName = "--opacity-" + step;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opacity-swatch";
    btn.setAttribute("aria-label", "Opacity " + step + " — copy var(" + varName + ")");
    var chip = document.createElement("span");
    chip.className = "opacity-chip";
    var layer = document.createElement("span");
    layer.className = "opacity-layer";
    layer.style.opacity = "var(" + varName + ")";
    chip.appendChild(layer);
    var name = document.createElement("span");
    name.className = "opacity-name";
    name.textContent = varName;
    var val = document.createElement("span");
    val.className = "opacity-val";
    val.textContent = tokenValue(varName);
    btn.appendChild(chip);
    btn.appendChild(name);
    btn.appendChild(val);
    btn.addEventListener("click", function () { copyText("var(" + varName + ")"); });
    opacityEl.appendChild(btn);
  });

  /* ---------- 3. Schemes ---------- */
  var clusterTemplate = document.getElementById("cluster-template");
  var clusterCount = 0;
  function makeCluster() {
    clusterCount += 1;
    var node = clusterTemplate.content.cloneNode(true);
    var label = node.querySelector(".field label");
    var input = node.querySelector(".field input");
    var id = "cluster-input-" + clusterCount;
    label.setAttribute("for", id);
    input.id = id;
    var toggle = node.querySelector(".toggle");
    toggle.addEventListener("click", function () {
      toggle.setAttribute("aria-checked", toggle.getAttribute("aria-checked") === "true" ? "false" : "true");
    });
    return node;
  }

  var schemeGrid = document.getElementById("scheme-grid");
  FAMILIES.forEach(function (fam) {
    ["default", "invert"].forEach(function (mode) {
      var panel = document.createElement("div");
      panel.className = "scheme-panel";
      panel.setAttribute("data-style", fam.id);
      panel.setAttribute("data-mode", mode);
      var lab = document.createElement("p");
      lab.className = "scheme-panel-label";
      lab.textContent = fam.name + " — " + (mode === "default" ? "Default" : "Invert");
      panel.appendChild(lab);
      panel.appendChild(makeCluster());
      schemeGrid.appendChild(panel);
    });
  });

  /* Hero demo */
  var heroPanel = document.getElementById("hero-panel");
  var heroLabel = document.getElementById("hero-label");
  document.getElementById("hero-cluster").appendChild(makeCluster());
  var heroFamily = "neutral";
  var heroMode = "default";
  function applyHero() {
    heroPanel.setAttribute("data-style", heroFamily);
    heroPanel.setAttribute("data-mode", heroMode);
    var fam = FAMILIES.filter(function (f) { return f.id === heroFamily; })[0];
    heroLabel.textContent = fam.name + " — " + (heroMode === "default" ? "Default" : "Invert");
  }
  var picker = document.getElementById("family-picker");
  FAMILIES.forEach(function (fam) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = fam.name;
    b.setAttribute("aria-pressed", fam.id === heroFamily ? "true" : "false");
    b.addEventListener("click", function () {
      heroFamily = fam.id;
      picker.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      applyHero();
    });
    picker.appendChild(b);
  });
  var modeLight = document.getElementById("mode-light");
  var modeDark = document.getElementById("mode-dark");
  function setMode(mode) {
    heroMode = mode;
    modeLight.setAttribute("aria-pressed", mode === "default" ? "true" : "false");
    modeDark.setAttribute("aria-pressed", mode === "invert" ? "true" : "false");
    applyHero();
  }
  modeLight.addEventListener("click", function () { setMode("default"); });
  modeDark.addEventListener("click", function () { setMode("invert"); });
  applyHero();

  /* ---------- 4. Fluid type specimens ---------- */
  var TYPE_STEPS = ["--step-60", "--step-70", "--step-80", "--step-100", "--step-120", "--step-140", "--step-160", "--step-180", "--step-200", "--step-250", "--step-300", "--step-350"];
  var typeWrap = document.getElementById("type-specimens");
  var typeLines = [];
  TYPE_STEPS.forEach(function (tok) {
    var stepNum = parseInt(tok.replace("--step-", ""), 10);
    var row = document.createElement("div");
    row.className = "type-row";
    var meta = document.createElement("div");
    meta.className = "type-meta";
    var tokEl = document.createElement("span");
    tokEl.className = "tok";
    tokEl.textContent = tok;
    var sizeEl = document.createElement("span");
    sizeEl.className = "type-size";
    meta.appendChild(tokEl);
    meta.appendChild(sizeEl);
    var line = document.createElement("div");
    line.className = "type-line" + (stepNum >= 160 ? " serif" : "");
    line.style.fontSize = "var(" + tok + ")";
    line.textContent = "Design systems, quietly";
    row.appendChild(meta);
    row.appendChild(line);
    typeWrap.appendChild(row);
    typeLines.push({ el: line, sizeEl: sizeEl });
  });

  /* ---------- 5. Fluid spacing ---------- */
  var SPACE_STEPS = ["10", "30", "50", "60", "70", "80", "100", "125", "150", "200", "300", "400", "500"];
  var SPACE_PAIRS = [
    { name: "10-30", min: 2, max: 5 }, { name: "30-50", min: 5, max: 10 },
    { name: "50-60", min: 9, max: 12 }, { name: "60-70", min: 11, max: 14 },
    { name: "70-80", min: 13, max: 16 }, { name: "80-100", min: 14, max: 20 },
    { name: "100-125", min: 18, max: 25 }, { name: "125-150", min: 23, max: 30 },
    { name: "150-200", min: 27, max: 40 }, { name: "200-300", min: 36, max: 60 },
    { name: "300-400", min: 54, max: 80 }, { name: "400-500", min: 72, max: 100 }
  ];
  var spaceBars = [];
  function spaceRow(container, tok, extraLabel, isPair) {
    var row = document.createElement("div");
    row.className = "space-row";
    var label = document.createElement("div");
    label.className = "space-label";
    var tokEl = document.createElement("span");
    tokEl.className = "tok";
    tokEl.textContent = tok;
    var valEl = document.createElement("span");
    label.appendChild(tokEl);
    label.appendChild(valEl);
    var track = document.createElement("div");
    track.className = "space-bar-track";
    var bar = document.createElement("div");
    bar.className = "space-bar" + (isPair ? " pair" : "");
    bar.style.width = "var(" + tok + ")";
    track.appendChild(bar);
    row.appendChild(label);
    row.appendChild(track);
    container.appendChild(row);
    spaceBars.push({ bar: bar, valEl: valEl, extra: extraLabel || "" });
  }
  var spaceStepsEl = document.getElementById("space-steps");
  SPACE_STEPS.forEach(function (s) {
    spaceRow(spaceStepsEl, "--space-" + s, s === "30" ? " · constant" : "", false);
  });
  var spacePairsEl = document.getElementById("space-pairs");
  SPACE_PAIRS.forEach(function (p) {
    spaceRow(spacePairsEl, "--space-" + p.name, " · range " + p.min + "px → " + p.max + "px", true);
  });

  /* Static spacing — fixed labels (token, rem, px equivalent); bars are
     NOT live-measured, because the values never change with width. */
  var STATIC_STEPS = [
    { name: "10", rem: "0.125rem", px: 2 }, { name: "30", rem: "0.375rem", px: 6 },
    { name: "50", rem: "0.625rem", px: 10 }, { name: "60", rem: "0.75rem", px: 12 },
    { name: "70", rem: "0.875rem", px: 14 }, { name: "80", rem: "1rem", px: 16 },
    { name: "100", rem: "1.25rem", px: 20 }, { name: "125", rem: "1.5625rem", px: 25 },
    { name: "150", rem: "1.875rem", px: 30 }, { name: "200", rem: "2.5rem", px: 40 },
    { name: "300", rem: "3.75rem", px: 60 }, { name: "400", rem: "5rem", px: 80 },
    { name: "500", rem: "6.25rem", px: 100 }
  ];
  var staticBars = [];
  var staticStepsEl = document.getElementById("static-space-steps");
  STATIC_STEPS.forEach(function (s) {
    var tok = "--space-static-" + s.name;
    var row = document.createElement("div");
    row.className = "space-row";
    var label = document.createElement("div");
    label.className = "space-label";
    var tokEl = document.createElement("span");
    tokEl.className = "tok";
    tokEl.textContent = tok;
    var valEl = document.createElement("span");
    valEl.textContent = s.rem + " · " + s.px + "px — fixed";
    label.appendChild(tokEl);
    label.appendChild(valEl);
    var track = document.createElement("div");
    track.className = "space-bar-track";
    var bar = document.createElement("div");
    bar.className = "space-bar static";
    bar.style.width = "var(" + tok + ")";
    track.appendChild(bar);
    row.appendChild(label);
    row.appendChild(track);
    staticStepsEl.appendChild(row);
    staticBars.push({ bar: bar, px: s.px, tok: tok });
  });

  /* ---------- 6. Grid demo ---------- */
  var demoGrid = document.getElementById("demo-grid");
  var overlay = document.getElementById("grid-overlay");
  for (var i = 1; i <= 12; i++) {
    var cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.textContent = i;
    demoGrid.appendChild(cell);
    var guide = document.createElement("i");
    overlay.appendChild(guide);
  }
  var overlayBtn = document.getElementById("overlay-toggle");
  overlayBtn.addEventListener("click", function () {
    var on = overlay.hasAttribute("hidden");
    if (on) { overlay.removeAttribute("hidden"); } else { overlay.setAttribute("hidden", ""); }
    overlayBtn.setAttribute("aria-pressed", on ? "true" : "false");
    overlayBtn.textContent = on ? "Hide column overlay" : "Show column overlay";
  });

  /* ---------- 8. Radius ---------- */
  var RADII = [
    { name: "--radius-0", val: "0 · 0px" }, { name: "--radius-25", val: "0.125rem · 2px" }, { name: "--radius-50", val: "0.25rem · 4px" },
    { name: "--radius-100", val: "0.5rem · 8px" }, { name: "--radius-150", val: "0.75rem · 12px" }, { name: "--radius-250", val: "1.25rem · 20px" },
    { name: "--radius-300", val: "1.5rem · 24px" }, { name: "--radius-full", val: "9999px" }
  ];
  var radiusGrid = document.getElementById("radius-grid");
  RADII.forEach(function (r) {
    var item = document.createElement("div");
    item.className = "radius-item";
    var box = document.createElement("div");
    box.className = "radius-box";
    box.style.borderRadius = "var(" + r.name + ")";
    var nm = document.createElement("span");
    nm.className = "rname";
    nm.textContent = r.name;
    var vl = document.createElement("span");
    vl.className = "rval";
    vl.textContent = r.val;
    item.appendChild(box);
    item.appendChild(nm);
    item.appendChild(vl);
    radiusGrid.appendChild(item);
  });

  /* ---------- 8b. Concentric demo ---------- */
  /* Concentricity is per layer: each layer has a Concentric
     switch (on by default) and a fixed-radius select, enabled
     only while its switch is off. A concentric layer derives
     from its parent's ACTUAL radius minus the gap — the panel,
     outermost, takes the governing radius itself — so a fixed
     layer re-bases the derivation for everything inside it,
     which is what makes the concept testable per element. */
  var cdGapToken = "--space-100";
  var cdGapName = "--space-100 · fluid 18–20px";
  var cdLayers = [document.getElementById("cd-layer-1"), document.getElementById("cd-layer-2"), document.getElementById("cd-layer-3")];
  var cdLabels = [document.getElementById("cd-legend-1"), document.getElementById("cd-legend-2"), document.getElementById("cd-legend-3")];
  var cdNames = ["Panel", "Card", "Chip"];
  var cdStatus = document.getElementById("cd-status");
  var cdConcentric = [true, true, true];
  var cdSwitches = [document.getElementById("cd-switch-1"), document.getElementById("cd-switch-2"), document.getElementById("cd-switch-3")];
  var cdSelects = [document.getElementById("cd-radius-1"), document.getElementById("cd-radius-2"), document.getElementById("cd-radius-3")];
  var CD_RADIUS_REM = { "--radius-0": 0, "--radius-25": 0.125, "--radius-50": 0.25, "--radius-100": 0.5, "--radius-150": 0.75, "--radius-250": 1.25, "--radius-300": 1.5 };
  function fmtRem(px) {
    var rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var v = Math.round((px / rootPx) * 10000) / 10000;
    return v.toString() + "rem";
  }
  function fmtR(px) { return fmtRem(px) + " · " + fmtPx(px); }
  function updateConcentric() {
    /* This function applies state — the gap as padding on layers
       1–2, then each layer's radius by its own setting — and
       computes the readout from the governing values. Concentric
       layers ride the real mechanism: the .u-concentric utility
       reads the inherited --radius, and a FIXED layer re-scopes
       --radius to its own token (the documented re-scoping move),
       so a concentric child's --inset is only ever its distance
       from the nearest ancestor that set --radius — one gap per
       concentric step in between. Actual radii: a concentric
       layer takes its parent's actual radius − gap, floored at 0
       (the panel takes the governing radius); a fixed layer takes
       its select's token. A layer's arc centre is its corner —
       inset one gap per level — offset by its radius. The gap is
       measured from the rendered padding, so the fluid tokens flow
       through; nothing is read back from a computed border-radius,
       which engines serialise inconsistently for var()/max()/calc()
       values. Sub-half-pixel radii snap to 0 so the floored
       wording triggers on the real thing, not on rounding. */
    cdLayers[0].style.padding = "var(" + cdGapToken + ")";
    cdLayers[1].style.padding = "var(" + cdGapToken + ")";
    var gap = parseFloat(getComputedStyle(cdLayers[0]).paddingTop) || 0;
    var rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var cdR = 1.5 * rootPx;
    var radii = [];
    var parentR = cdR;
    cdNames.forEach(function (n, i) {
      var r = cdConcentric[i] ? (i === 0 ? cdR : parentR - gap) : CD_RADIUS_REM[cdSelects[i].value] * rootPx;
      r = r < 0.5 ? 0 : r;
      radii.push(r);
      parentR = r;
    });
    if (cdConcentric[0]) cdLayers[0].style.removeProperty("--radius");
    else cdLayers[0].style.setProperty("--radius", "var(" + cdSelects[0].value + ")");
    var scopeIdx = 0;
    [1, 2].forEach(function (i) {
      var el = cdLayers[i];
      if (cdConcentric[i]) {
        el.classList.add("u-concentric");
        el.style.removeProperty("border-radius");
        el.style.removeProperty("--radius");
        el.style.setProperty("--inset", (((i - scopeIdx) * gap) / rootPx) + "rem");
      } else {
        el.classList.remove("u-concentric");
        el.style.removeProperty("--inset");
        el.style.borderRadius = "var(" + cdSelects[i].value + ")";
        el.style.setProperty("--radius", "var(" + cdSelects[i].value + ")");
        scopeIdx = i;
      }
    });
    var centres = radii.map(function (r, i) { return { x: i * gap + r, y: i * gap + r }; });
    cdLabels.forEach(function (lab, i) {
      lab.textContent = cdNames[i] + " — " + fmtR(radii[i]);
    });
    cdStatus.innerHTML = "";
    var strong = document.createElement("strong");
    strong.textContent = cdNames.map(function (n, i) {
      return n + (cdConcentric[i] ? " concentric" : " fixed " + cdSelects[i].value);
    }).join(" · ");
    cdStatus.appendChild(strong);
    var detail = document.createElement("span");
    detail.className = "mono";
    var msg = " — gap " + cdGapName + " (now " + fmtPx(gap) + ") · radii: panel " + fmtR(radii[0]) + ", card " + fmtR(radii[1]) + ", chip " + fmtR(radii[2]);
    var live = [], floored = [];
    radii.forEach(function (r, i) { (r > 0 ? live : floored).push(i); });
    if (live.length === 0) {
      msg += " · all three layers are floored to square (r 0) — square corners have no arc centre; their corners sit at " + floored.map(function (i) { return fmtPx(i * gap) + ", " + fmtPx(i * gap); }).join(" / ");
    } else {
      var c0 = centres[live[0]].x;
      var same = live.every(function (i) { return Math.abs(centres[i].x - c0) < 0.01; });
      if (same) {
        if (live.length === 1) msg += " · arc centre of " + cdNames[live[0]].toLowerCase() + " sits at " + fmtPx(c0) + ", " + fmtPx(c0);
        else if (live.length === 3) msg += " · all three arc centres coincide at " + fmtPx(c0) + ", " + fmtPx(c0);
        else msg += " · arc centres of " + live.map(function (i) { return cdNames[i].toLowerCase(); }).join(" and ") + " coincide at " + fmtPx(c0) + ", " + fmtPx(c0);
      } else {
        msg += " · arc centres at " + live.map(function (i) { return fmtPx(centres[i].x); }).join(" / ");
      }
      floored.forEach(function (i) {
        msg += " · " + cdNames[i].toLowerCase() + " is floored to square (r 0) — a square corner has no arc centre, so its corner is the point (" + fmtPx(centres[i].x) + ", " + fmtPx(centres[i].y) + ")";
      });
    }
    detail.textContent = msg;
    cdStatus.appendChild(detail);
  }
  var cdGapPicker = document.getElementById("cd-gap-picker");
  cdGapPicker.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      cdGapToken = b.getAttribute("data-gap-token");
      cdGapName = b.getAttribute("data-gap-name");
      cdGapPicker.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      updateConcentric();
    });
  });
  cdSwitches.forEach(function (sw, i) {
    sw.addEventListener("click", function () {
      cdConcentric[i] = !cdConcentric[i];
      sw.setAttribute("aria-checked", cdConcentric[i] ? "true" : "false");
      cdSelects[i].disabled = cdConcentric[i];
      updateConcentric();
    });
  });
  cdSelects.forEach(function (sel) {
    sel.addEventListener("change", function () { updateConcentric(); });
  });
  updateConcentric();
  /* The readout numbers (gap px, radii, centres) derive from the
     measured gap and the root size, so refresh them when the layout
     moves: a viewport resize changes the fluid gap, and font load
     can settle the root size the rem readouts are computed from. */
  var cdUpdateQueued = false;
  function queueCdUpdate() {
    if (cdUpdateQueued) return;
    cdUpdateQueued = true;
    requestAnimationFrame(function () { cdUpdateQueued = false; updateConcentric(); });
  }
  window.addEventListener("resize", queueCdUpdate);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(queueCdUpdate); }

  /* ---------- 9. Motion ---------- */
  var MOTION_DURATIONS = [
    { step: "0", ms: "0ms" }, { step: "25", ms: "50ms" }, { step: "50", ms: "100ms" },
    { step: "75", ms: "150ms" }, { step: "100", ms: "200ms" }, { step: "150", ms: "300ms" },
    { step: "200", ms: "400ms" }, { step: "300", ms: "600ms" }, { step: "400", ms: "800ms" }
  ];
  var MOTION_EASINGS = [
    { name: "--ease-in", val: "cubic-bezier(0.4, 0, 1, 1)", note: "Things leaving" },
    { name: "--ease-out", val: "cubic-bezier(0, 0, 0.2, 1)", note: "Things arriving" },
    { name: "--ease-in-out", val: "cubic-bezier(0.4, 0, 0.2, 1)", note: "Things changing state" },
    { name: "--ease-emphasized", val: "cubic-bezier(0.2, 0, 0, 1)", note: "Large / hero movement" }
  ];
  /* Token displays are buttons with radio semantics — they are the
     Motion Explorer's controls, wired up in section 9b. */
  function motionChip(tok, val, tag) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "motion-chip";
    chip.setAttribute("role", "radio");
    chip.setAttribute("aria-checked", "false");
    chip.tabIndex = -1;
    var tokEl = document.createElement("span");
    tokEl.className = "tok";
    tokEl.textContent = tok;
    chip.appendChild(tokEl);
    if (val) {
      var valEl = document.createElement("span");
      valEl.className = "val";
      valEl.textContent = val;
      chip.appendChild(valEl);
    }
    if (tag) {
      var tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = tag;
      chip.appendChild(tagEl);
    }
    return chip;
  }
  var durationChips = document.getElementById("motion-duration-chips");
  MOTION_DURATIONS.forEach(function (d) {
    var chip = motionChip(
      "--duration-" + d.step, d.ms,
      d.step === "100" ? "base" : ""
    );
    chip.setAttribute("data-step", d.step);
    durationChips.appendChild(chip);
  });
  var easingGrid = document.getElementById("motion-easing-grid");
  MOTION_EASINGS.forEach(function (e) {
    var cell = document.createElement("button");
    cell.type = "button";
    cell.className = "motion-easing-cell";
    cell.setAttribute("role", "radio");
    cell.setAttribute("aria-checked", "false");
    cell.tabIndex = -1;
    cell.setAttribute("data-easing", e.name);
    var tokEl = document.createElement("span");
    tokEl.className = "tok";
    tokEl.textContent = e.name;
    var valEl = document.createElement("span");
    valEl.className = "val";
    valEl.textContent = e.val;
    var noteEl = document.createElement("span");
    noteEl.className = "note";
    noteEl.textContent = e.note;
    cell.appendChild(tokEl);
    cell.appendChild(valEl);
    cell.appendChild(noteEl);
    easingGrid.appendChild(cell);
  });

  /* ---------- 9b. Motion explorer ---------- */
  /* Duration and easing are read from the page's actual custom
     properties at run time (tokenValue reads getComputedStyle), so the
     explorer is driven by the real tokens — under reduced motion the
     durations read as 0ms and every item simply lands at its end state.
     Animation runs on the Web Animations API; in-flight animations are
     cancelled before each re-run. */
  var EX_STAGGERS = [0, 25, 50, 100, 150, 200];
  var exStep = "200";
  var exEasingName = "--ease-out";
  var exStaggerMs = 50;
  var exDots = [];
  var exDelayEls = [];
  var exAnims = [];
  var exLanes = document.getElementById("ex-lanes");
  for (var exI = 0; exI < 5; exI++) {
    var exRow = document.createElement("div");
    exRow.className = "motion-lane-row";
    var exLabel = document.createElement("div");
    exLabel.className = "motion-lane-label";
    var exTok = document.createElement("span");
    exTok.className = "tok";
    exTok.textContent = "Item " + (exI + 1);
    var exDelay = document.createElement("span");
    exLabel.appendChild(exTok);
    exLabel.appendChild(exDelay);
    var exTrack = document.createElement("div");
    exTrack.className = "motion-track";
    var exDot = document.createElement("div");
    exDot.className = "ex-dot";
    exTrack.appendChild(exDot);
    exRow.appendChild(exLabel);
    exRow.appendChild(exTrack);
    exLanes.appendChild(exRow);
    exDots.push(exDot);
    exDelayEls.push(exDelay);
  }
  var exReadout = document.getElementById("ex-readout");
  function runExplorer() {
    var dur = Math.round(parseFloat(tokenValue("--duration-" + exStep))) || 0;
    var ease = tokenValue(exEasingName);
    exAnims.forEach(function (a) { a.cancel(); });
    exAnims = [];
    exDots.forEach(function (dot, i) {
      exAnims.push(dot.animate([
        { left: "3px", opacity: 0 },
        { left: "calc(100% - 19px)", opacity: 1 }
      ], { duration: dur, delay: i * exStaggerMs, easing: ease, fill: "both" }));
    });
    exDelayEls.forEach(function (el, i) {
      el.textContent = "delay " + (i * exStaggerMs) + "ms";
    });
    exReadout.textContent = "duration-" + exStep + " · " + dur + "ms · " +
      exEasingName.replace(/^--/, "") + " · stagger " + exStaggerMs +
      "ms · total ≈ " + (dur + 4 * exStaggerMs) + "ms";
  }
  /* Stagger chips — same control surface as the durations. The 50ms
     chip is tagged with the --stagger token it matches. */
  var staggerChips = document.getElementById("motion-stagger-chips");
  EX_STAGGERS.forEach(function (ms) {
    var chip = motionChip(ms + "ms", "", ms === 50 ? "--stagger" : "");
    chip.setAttribute("data-stagger", String(ms));
    staggerChips.appendChild(chip);
  });
  /* Radio-group behaviour for the three token control groups:
     exactly one checked per group (roving tabindex), arrow keys
     move the selection, and every selection re-runs the explorer. */
  function initRadioGroup(container, isCurrent, onSelect) {
    var btns = Array.prototype.slice.call(container.querySelectorAll('[role="radio"]'));
    function mark(btn) {
      btns.forEach(function (x) {
        var on = x === btn;
        x.setAttribute("aria-checked", on ? "true" : "false");
        x.tabIndex = on ? 0 : -1;
      });
    }
    btns.forEach(function (btn, i) {
      if (isCurrent(btn)) mark(btn);
      btn.addEventListener("click", function () { mark(btn); onSelect(btn); });
      btn.addEventListener("keydown", function (ev) {
        var j = null;
        if (ev.key === "ArrowRight" || ev.key === "ArrowDown") j = (i + 1) % btns.length;
        else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") j = (i - 1 + btns.length) % btns.length;
        else if (ev.key === "Home") j = 0;
        else if (ev.key === "End") j = btns.length - 1;
        if (j !== null) { ev.preventDefault(); mark(btns[j]); btns[j].focus(); onSelect(btns[j]); }
      });
    });
  }
  initRadioGroup(durationChips,
    function (b) { return b.getAttribute("data-step") === exStep; },
    function (b) { exStep = b.getAttribute("data-step"); runExplorer(); });
  initRadioGroup(easingGrid,
    function (b) { return b.getAttribute("data-easing") === exEasingName; },
    function (b) { exEasingName = b.getAttribute("data-easing"); runExplorer(); });
  initRadioGroup(staggerChips,
    function (b) { return parseInt(b.getAttribute("data-stagger"), 10) === exStaggerMs; },
    function (b) { exStaggerMs = parseInt(b.getAttribute("data-stagger"), 10); runExplorer(); });
  document.getElementById("ex-play").addEventListener("click", runExplorer);
  runExplorer();
  if ("IntersectionObserver" in window) {
    var exIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) runExplorer();
      });
    }, { threshold: 0.3 });
    exIO.observe(document.getElementById("motion-explorer-stage"));
  }

  /* ---------- Live measurements ---------- */
  var probe = document.getElementById("probe");
  var gutterReadout = document.getElementById("gutter-readout");
  function measure() {
    typeLines.forEach(function (t) {
      var fs = parseFloat(getComputedStyle(t.el).fontSize);
      t.sizeEl.textContent = "now " + fmtPx(fs);
    });
    spaceBars.forEach(function (s) {
      s.valEl.textContent = "now " + fmtPx(s.bar.getBoundingClientRect().width) + s.extra;
    });
    probe.style.width = "var(--grid-gutter)";
    gutterReadout.textContent = fmtPx(probe.getBoundingClientRect().width);
    updateConcentric();
  }
  var raf = null;
  function scheduleMeasure() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; measure(); });
  }
  window.addEventListener("resize", scheduleMeasure);
  measure();
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(scheduleMeasure); }

})();

(function () {
  "use strict";

  /* ---------- Motion effects: parallax driver ---------- */
  var pxStage = document.getElementById("fx-parallax-stage");
  if (pxStage) {
    var pxFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--parallax")) || 0.3;
    var layers = [
      { el: pxStage.querySelector('[data-fx-rate="far"]'), rate: pxFactor },
      { el: pxStage.querySelector('[data-fx-rate="mid"]'), rate: pxFactor * 2 },
      { el: pxStage.querySelector('[data-fx-rate="near"]'), rate: 1 }
    ];
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var ticking = false;
    function updateParallax() {
      ticking = false;
      if (reduceMotion.matches) {
        layers.forEach(function (l) { if (l.el) l.el.style.transform = ""; });
        return;
      }
      var rect = pxStage.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom < -80 || rect.top > vh + 80) return;
      var progress = ((vh / 2) - (rect.top + rect.height / 2)) / vh;
      progress = Math.max(-1, Math.min(1, progress));
      var travel = 40; /* px of travel for the near (x1) layer */
      layers.forEach(function (l) {
        if (!l.el) return;
        l.el.style.transform = "translateY(" + (progress * travel * l.rate).toFixed(1) + "px)";
      });
    }
    function requestUpdate() {
      if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
    }
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", requestUpdate);
    updateParallax();
  }
})();

(function () {
  "use strict";

  /* ---------- Pill section-nav: docking, gradient mask, scrollspy ---------- */
  var dock = document.querySelector(".section-dock");
  if (!dock) return;
  var scroller = dock.querySelector(".dock-scroll");
  var links = Array.prototype.slice.call(scroller.querySelectorAll("a"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Gradient mask: fade whichever edge(s) still hide content. */
  function updateMask() {
    var max = scroller.scrollWidth - scroller.clientWidth;
    scroller.classList.remove("mask-r", "mask-l", "mask-b");
    if (max <= 2) return;
    var left = scroller.scrollLeft;
    if (left <= 2) scroller.classList.add("mask-r");
    else if (left >= max - 2) scroller.classList.add("mask-l");
    else scroller.classList.add("mask-b");
  }
  scroller.addEventListener("scroll", updateMask, { passive: true });

  /* Docking: a placeholder holds the bar's in-flow spot (same
     height) while the bar is fixed, so page content never jumps.
     The bar docks once the page has scrolled past the bottom of
     its in-flow position, and undocks back above that point. */
  var placeholder = document.createElement("div");
  placeholder.className = "dock-placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  dock.parentNode.insertBefore(placeholder, dock);
  var docked = false;
  function homeBottom() {
    var el = docked ? placeholder : dock;
    return el.getBoundingClientRect().bottom + window.scrollY;
  }
  function updateDock() {
    var threshold = homeBottom();
    if (!docked && window.scrollY >= threshold) {
      placeholder.style.height = dock.offsetHeight + "px";
      placeholder.style.display = "block";
      dock.classList.add("is-docked");
      docked = true;
    } else if (docked && window.scrollY < threshold) {
      dock.classList.remove("is-docked");
      placeholder.style.display = "none";
      placeholder.style.height = "";
      docked = false;
    }
  }
  window.addEventListener("scroll", updateDock, { passive: true });
  window.addEventListener("resize", function () { updateDock(); updateMask(); });
  updateDock();
  updateMask();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { updateDock(); updateMask(); });
  }

  /* Scrollspy: the section in view selects its link, and the
     scroller centres that link — only the scroller moves, never
     the page. */
  function setCurrent(link) {
    links.forEach(function (l) {
      if (l === link) l.setAttribute("aria-current", "true");
      else l.removeAttribute("aria-current");
    });
    if (link) {
      var target = link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2;
      scroller.scrollTo({ left: target, behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
  }
  var byId = {};
  links.forEach(function (l) { byId[l.getAttribute("href").slice(1)] = l; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && byId[entry.target.id]) setCurrent(byId[entry.target.id]);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(function (l) {
      var sec = document.getElementById(l.getAttribute("href").slice(1));
      if (sec) spy.observe(sec);
    });
  }
})();
