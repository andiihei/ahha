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
    max-width: 24rem;
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
  const padding = `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`
    .replace(/px/g, "");
  const color = computed.color;
  const bg = computed.backgroundColor;
  const font = `${computed.fontWeight} ${computed.fontSize} / ${computed.lineHeight} ${computed.fontFamily.split(",")[0]}`;
  const border = computed.borderWidth !== "0px" ? `${computed.borderWidth} ${computed.borderStyle} ${computed.borderColor}` : "none";

  // Check key AHHA CSS tokens
  const tokens = [
    "--surface-bg",
    "--surface-bg-1",
    "--text-fg-1",
    "--text-fg-2",
    "--surface-border",
    "--action-bg-1",
    "--action-fg-1",
    "--action-border",
    "--brand-ink",
    "--brand-faint",
    "--brand-line",
    "--page-dim"
  ]
    .map((token) => {
      const val = computed.getPropertyValue(token).trim();
      return val ? `<div style="display:flex; justify-content:space-between; gap:8px;"><span style="color:var(--text-fg-2);">${token}</span><span style="font-weight:600; text-overflow:ellipsis; overflow:hidden; max-width:140px; white-space:nowrap;">${val}</span></div>` : null;
    })
    .filter(Boolean)
    .slice(0, 4)
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
    ${tokens ? `<div style="border-top:1px dashed var(--surface-border, #ddd); margin-top:6px; padding-top:6px;"><div style="font-size:10px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-fg-2); margin-bottom:4px; font-weight:600;">Active AHHA Tokens</div>${tokens}</div>` : ""}
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
