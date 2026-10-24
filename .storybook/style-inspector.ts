/**
 * AHHA Storybook HUD Style & Token Inspector
 *
 * Lightweight, non-intrusive live element style inspector.
 * Enabled via the top Storybook toolbar "Inspect CSS" toggle.
 * When active, hovering over elements in the story canvas highlights the element
 * and displays an interactive floating HUD showing:
 * - HTML Tag, classes, ID
 * - Box model dimensions (W x H)
 * - Color / Background / Border values (resolving OKLCH tokens)
 * - Typography (Font family, size, weight, line-height)
 * - Layout (display, flex, grid, gap, padding, margin)
 * - Resolved Layer 2 CSS custom properties (--surface-bg, --text-fg-1, etc.)
 */

let inspectorActive = false;
let hudElement: HTMLElement | null = null;
let currentTarget: HTMLElement | null = null;

function ensureHud() {
  if (hudElement) return hudElement;

  hudElement = document.createElement("div");
  hudElement.id = "ahha-style-hud";
  hudElement.setAttribute("aria-hidden", "true");
  hudElement.style.cssText = `
    position: fixed;
    z-index: 999999;
    max-width: 32rem;
    pointer-events: none;
    font-family: var(--font-mono, "IBM Plex Mono", monospace);
    font-size: 11px;
    line-height: 1.4;
    color: var(--text-fg-1, #1e1e2f);
    background: color-mix(in oklch, var(--surface-bg, #ffffff) 94%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--surface-border, rgba(0, 0, 0, 0.15));
    border-radius: var(--radius-100, 8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    padding: 10px 12px;
    display: none;
    opacity: 0;
    transition: opacity 120ms ease;
  `;

  document.body.appendChild(hudElement);
  return hudElement;
}

function getResolvedToken(style: CSSStyleDeclaration, prop: string): string | null {
  const val = style.getPropertyValue(prop).trim();
  return val ? `${prop}: ${val}` : null;
}

interface TokenChainResult {
  l2Slot: string;
  l1Step: string;
  l1Primitive: string;
  computedVal: string;
}

function resolveTokenChain(target: HTMLElement, token: string): TokenChainResult | null {
  const computed = window.getComputedStyle(target);
  const computedVal = computed.getPropertyValue(token).trim();
  if (!computedVal) return null;

  // Detect style attribute or active context
  const hostWithStyle = target.closest("[data-style]") as HTMLElement | null;
  const hostWithMode = target.closest("[data-mode]") as HTMLElement | null;

  const styleFamily = hostWithStyle?.getAttribute("data-style") || "neutral";
  let mode = hostWithMode?.getAttribute("data-mode") || "default";

  if (mode === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    mode = isDark ? "invert" : "default";
  }

  // Map Layer 2 Semantic Slot -> Layer 1 Ramp Step
  const slotToStep: Record<string, { default: string; invert: string }> = {
    "--surface-bg": { default: "--color-25", invert: "--color-1000" },
    "--surface-bg-1": { default: "--color-50", invert: "--color-900" },
    "--text-fg-1": { default: "--color-1000", invert: "--color-25" },
    "--text-fg-2": { default: "--color-700", invert: "--color-300" },
    "--surface-border": { default: "--color-200", invert: "--color-800" },
    "--action-bg-1": { default: "--color-800", invert: "--color-100" },
    "--action-border": { default: "--color-700", invert: "--color-200" },
    "--action-fg-1": { default: "--color-25", invert: "--color-1000" },
    "--brand-ink": { default: "--color-1000", invert: "--color-25" },
    "--brand-faint": { default: "--color-50", invert: "--color-900" },
    "--brand-line": { default: "--color-700", invert: "--color-300" },
    "--page-fill": { default: "--neutral-100", invert: "--neutral-800" },
    "--page-line": { default: "--neutral-300", invert: "--neutral-700" },
    "--page-dim": { default: "--neutral-300", invert: "--neutral-500" },
  };

  const slotInfo = slotToStep[token];
  if (!slotInfo) {
    return { l2Slot: token, l1Step: "", l1Primitive: "", computedVal };
  }

  const stepVar = mode === "invert" ? slotInfo.invert : slotInfo.default;
  let primitiveVar = "";

  if (stepVar.startsWith("--neutral-")) {
    primitiveVar = stepVar;
  } else if (stepVar.startsWith("--color-")) {
    const stepNum = stepVar.replace("--color-", "");
    primitiveVar = `--${styleFamily}-${stepNum}`;
  }

  return {
    l2Slot: token,
    l1Step: stepVar,
    l1Primitive: primitiveVar,
    computedVal,
  };
}

function updateHud(target: HTMLElement, e: MouseEvent) {
  const hud = ensureHud();
  const rect = target.getBoundingClientRect();
  const computed = window.getComputedStyle(target);

  // Extract relevant properties
  const tag = target.tagName.toLowerCase();
  const idStr = target.id ? `#${target.id}` : "";
  const classStr = target.className && typeof target.className === "string"
    ? "." + target.className.trim().split(/\s+/).slice(0, 3).join(".")
    : "";

  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  const display = computed.display;
  const color = computed.color;
  const bg = computed.backgroundColor;
  const font = `${computed.fontWeight} ${computed.fontSize} / ${computed.lineHeight} ${computed.fontFamily.split(",")[0]}`;
  const border = computed.borderWidth !== "0px" ? `${computed.borderWidth} ${computed.borderStyle} ${computed.borderColor}` : "none";

  // Check key AHHA CSS tokens and expose alias inheritance in distinct columns
  const checkTokens = [
    "--surface-bg",
    "--surface-bg-1",
    "--text-fg-1",
    "--text-fg-2",
    "--surface-border",
    "--action-bg-1",
    "--action-fg-1",
    "--action-border",
    "--brand-ink",
    "--brand-line",
    "--page-fill",
    "--page-dim",
  ];

  const resolvedTokens = checkTokens
    .map((token) => resolveTokenChain(target, token))
    .filter((res): res is TokenChainResult => Boolean(res))
    .slice(0, 6)
    .map((res) => {
      const stepDisplay = res.l1Step ? `${res.l1Step}` : "-";
      const primitiveDisplay = res.l1Primitive ? `&rarr; ${res.l1Primitive}` : "";
      return `
        <div style="display:grid; grid-template-columns: minmax(105px, auto) 14px minmax(95px, auto) 14px minmax(100px, auto); align-items:baseline; gap:4px; font-size:10.5px; margin-bottom:2px;" title="${res.computedVal}">
          <span style="color:var(--text-fg-2); font-weight:500;">${res.l2Slot}</span>
          <span style="color:var(--text-fg-2); text-align:center;">&rarr;</span>
          <span style="font-weight:600; color:var(--text-fg-1);">${stepDisplay}</span>
          <span style="color:var(--text-fg-2); text-align:center;">${res.l1Primitive ? "&rarr;" : ""}</span>
          <span style="font-weight:600; color:var(--action-border, #4f46e5);">${res.l1Primitive || ""}</span>
        </div>
      `;
    })
    .join("");

  hud.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--surface-border, #ddd); padding-bottom:6px; margin-bottom:6px;">
      <span style="font-weight:700; color:var(--action-border, #4f46e5);">&lt;${tag}&gt;<span style="color:var(--text-fg-2);">${idStr}${classStr}</span></span>
      <span style="background:var(--surface-bg-1, #eee); padding:1px 5px; border-radius:4px; font-weight:600;">${width} &times; ${height}px</span>
    </div>
    <div style="display:grid; gap:3px;">
      <div><span style="color:var(--text-fg-2);">layout:</span> ${display}</div>
      <div><span style="color:var(--text-fg-2);">type:</span> ${font}</div>
      <div><span style="color:var(--text-fg-2);">color:</span> <span style="display:inline-block; width:9px; height:9px; border-radius:2px; vertical-align:middle; background:${color}; border:1px solid rgba(0,0,0,0.2);"></span> ${color}</div>
      ${bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent" ? `<div><span style="color:var(--text-fg-2);">bg:</span> <span style="display:inline-block; width:9px; height:9px; border-radius:2px; vertical-align:middle; background:${bg}; border:1px solid rgba(0,0,0,0.2);"></span> ${bg}</div>` : ""}
      ${border !== "none" ? `<div><span style="color:var(--text-fg-2);">border:</span> ${border}</div>` : ""}
    </div>
    ${resolvedTokens ? `
      <div style="border-top:1px dashed var(--surface-border, #ddd); margin-top:6px; padding-top:6px;">
        <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-fg-2); margin-bottom:5px; font-weight:700;">
          Token Inheritance Chain
        </div>
        ${resolvedTokens}
      </div>
    ` : ""}
  `;

  // Position HUD near cursor avoiding screen edges
  const margin = 16;
  let posX = e.clientX + margin;
  let posY = e.clientY + margin;

  if (posX + 380 > window.innerWidth) {
    posX = e.clientX - 390;
  }
  if (posY + 260 > window.innerHeight) {
    posY = e.clientY - 270;
  }

  hud.style.left = `${Math.max(10, posX)}px`;
  hud.style.top = `${Math.max(10, posY)}px`;
  hud.style.display = "block";
  hud.style.opacity = "1";
}

function handlePointerOver(e: MouseEvent) {
  if (!inspectorActive) return;
  const target = (e.target as HTMLElement)?.closest("*") as HTMLElement;
  if (!target || target === document.body || target === document.documentElement || target.id === "ahha-style-hud" || target.id === "story-component-root") return;

  if (currentTarget && currentTarget !== target) {
    currentTarget.style.outline = "";
    currentTarget.style.outlineOffset = "";
  }

  currentTarget = target;
  currentTarget.style.outline = "2px solid var(--action-border, #4f46e5)";
  currentTarget.style.outlineOffset = "1px";

  updateHud(target, e);
}

function handlePointerMove(e: MouseEvent) {
  if (!inspectorActive || !currentTarget) return;
  updateHud(currentTarget, e);
}

function handlePointerOut(e: MouseEvent) {
  if (!inspectorActive) return;
  if (currentTarget) {
    currentTarget.style.outline = "";
    currentTarget.style.outlineOffset = "";
    currentTarget = null;
  }
  if (hudElement) {
    hudElement.style.opacity = "0";
    hudElement.style.display = "none";
  }
}

export function setInspectorActive(active: boolean) {
  inspectorActive = active;

  if (!active) {
    if (currentTarget) {
      currentTarget.style.outline = "";
      currentTarget.style.outlineOffset = "";
      currentTarget = null;
    }
    if (hudElement) {
      hudElement.style.opacity = "0";
      hudElement.style.display = "none";
    }
    document.removeEventListener("mouseover", handlePointerOver);
    document.removeEventListener("mousemove", handlePointerMove);
    document.removeEventListener("mouseout", handlePointerOut);
  } else {
    document.addEventListener("mouseover", handlePointerOver, { passive: true });
    document.addEventListener("mousemove", handlePointerMove, { passive: true });
    document.addEventListener("mouseout", handlePointerOut, { passive: true });
  }
}
