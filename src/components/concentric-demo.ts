import { LitElement, html } from 'lit';

export interface LayerState {
  name: string;
  isConcentric: boolean;
  fixedRadius: string;
}

export class AdsConcentricDemo extends LitElement {
  static properties = {
    governingRadius: { type: String },
    gapToken: { type: String },
    layers: { type: Array },
  };

  governingRadius: string = '--radius-300';
  gapToken: string = '--space-100';

  layers: LayerState[] = [
    { name: 'Panel', isConcentric: true, fixedRadius: '--radius-300' },
    { name: 'Card', isConcentric: true, fixedRadius: '--radius-300' },
    { name: 'Chip', isConcentric: true, fixedRadius: '--radius-300' },
  ];

  private readonly RADIUS_REM: Record<string, number> = {
    '--radius-0': 0,
    '--radius-25': 0.125,
    '--radius-50': 0.25,
    '--radius-100': 0.5,
    '--radius-150': 0.75,
    '--radius-250': 1.25,
    '--radius-300': 1.5,
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.requestUpdate();
  };

  private setGap(token: string) {
    this.gapToken = token;
    this.requestUpdate();
  }

  private toggleConcentric(index: number) {
    this.layers = this.layers.map((l, i) =>
      i === index ? { ...l, isConcentric: !l.isConcentric } : l
    );
    this.requestUpdate();
  }

  private setFixedRadius(index: number, val: string) {
    this.layers = this.layers.map((l, i) =>
      i === index ? { ...l, fixedRadius: val } : l
    );
    this.requestUpdate();
  }

  private calculateGeometry() {
    const rootPx =
      typeof window !== 'undefined'
        ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        : 16;

    // Estimate gap px from token
    let gapPx = 20;
    if (this.gapToken === '--space-50') gapPx = 10;
    else if (this.gapToken === '--space-100') gapPx = 20;
    else if (this.gapToken === '--space-200') gapPx = 40;

    const govRem = this.RADIUS_REM[this.governingRadius] ?? 1.5;
    const cdR = govRem * rootPx;

    const radii: number[] = [];
    let parentR = cdR;

    this.layers.forEach((layer, i) => {
      let r = layer.isConcentric
        ? i === 0
          ? cdR
          : parentR - gapPx
        : (this.RADIUS_REM[layer.fixedRadius] ?? 0) * rootPx;
      r = r < 0.5 ? 0 : r;
      radii.push(r);
      parentR = r;
    });

    const centres = radii.map((r, i) => ({
      x: i * gapPx + r,
      y: i * gapPx + r,
    }));

    return { rootPx, gapPx, radii, centres };
  }

  render() {
    const { gapPx, radii, centres } = this.calculateGeometry();
    const liveIndices: number[] = [];
    const flooredIndices: number[] = [];

    radii.forEach((r, i) => {
      if (r > 0) liveIndices.push(i);
      else flooredIndices.push(i);
    });

    let statusSummary = this.layers
      .map((l, i) => `${l.name} ${l.isConcentric ? 'concentric' : `fixed ${l.fixedRadius}`}`)
      .join(' · ');

    let statusDetail = `Gap ${this.gapToken} (${gapPx}px) — Panel: ${(radii[0] / 16).toFixed(3)}rem (${Math.round(radii[0])}px), Card: ${(radii[1] / 16).toFixed(3)}rem (${Math.round(radii[1])}px), Chip: ${(radii[2] / 16).toFixed(3)}rem (${Math.round(radii[2])}px).`;

    if (liveIndices.length === 0) {
      statusDetail += ' All layers floored to square (r=0).';
    } else {
      const c0 = centres[liveIndices[0]].x;
      const allCoincide = liveIndices.every(
        (i) => Math.abs(centres[i].x - c0) < 0.5
      );
      if (allCoincide && liveIndices.length > 1) {
        statusDetail += ` Arc centres coincide at (${Math.round(c0)}px, ${Math.round(c0)}px). Pure concentricity achieved.`;
      }
    }

    // Determine styles for layers
    const layer1Radius = this.layers[0].isConcentric
      ? `var(${this.governingRadius})`
      : `var(${this.layers[0].fixedRadius})`;

    const layer2Style = this.layers[1].isConcentric
      ? `border-radius: max(0rem, calc(${layer1Radius} - var(${this.gapToken}))); padding: var(${this.gapToken});`
      : `border-radius: var(${this.layers[1].fixedRadius}); padding: var(${this.gapToken});`;

    const layer3Style = this.layers[2].isConcentric
      ? `border-radius: max(0rem, calc(${layer1Radius} - calc(2 * var(${this.gapToken}))));`
      : `border-radius: var(${this.layers[2].fixedRadius});`;

    return html`
      <div class="ads-concentric-demo" data-testid="concentric-demo">
        <div class="demo-controls">
          <div class="control-group">
            <span class="control-label">Gap (layer padding)</span>
            <div class="seg-group" role="group" aria-label="Gap selection">
              <button
                type="button"
                class="seg-btn"
                aria-pressed="${this.gapToken === '--space-50'}"
                @click="${() => this.setGap('--space-50')}"
              >
                --space-50 (10px)
              </button>
              <button
                type="button"
                class="seg-btn"
                aria-pressed="${this.gapToken === '--space-100'}"
                @click="${() => this.setGap('--space-100')}"
              >
                --space-100 (20px)
              </button>
              <button
                type="button"
                class="seg-btn"
                aria-pressed="${this.gapToken === '--space-200'}"
                @click="${() => this.setGap('--space-200')}"
              >
                --space-200 (40px)
              </button>
            </div>
          </div>
        </div>

        <div class="stage" style="padding: var(${this.gapToken});">
          <div
            class="layer layer-1"
            data-testid="layer-1"
            style="border-radius: ${layer1Radius}; padding: var(${this.gapToken});"
          >
            <div
              class="layer layer-2"
              data-testid="layer-2"
              style="${layer2Style}"
            >
              <div
                class="layer layer-3"
                data-testid="layer-3"
                style="${layer3Style}"
              >
                <span class="control-label" style="color: var(--action-fg-1);">
                  Inner Concentric Surface
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="legend" role="group" aria-label="Concentric demo per-layer controls">
          ${this.layers.map(
            (layer, i) => html`
              <div class="legend-entry" data-testid="legend-row-${i}">
                <span class="swatch swatch-${i + 1}" aria-hidden="true"></span>
                <span class="legend-readout">
                  ${layer.name} — ${(radii[i] / 16).toFixed(3)}rem (${Math.round(radii[i])}px)
                </span>
                <button
                  type="button"
                  class="switch-btn"
                  role="switch"
                  data-testid="switch-${i}"
                  aria-checked="${layer.isConcentric}"
                  aria-label="${layer.name} concentric"
                  @click="${() => this.toggleConcentric(i)}"
                >
                  <span class="switch-track" aria-hidden="true">
                    <span class="switch-knob"></span>
                  </span>
                  <span>Concentric</span>
                </button>
                <select
                  class="radius-select"
                  data-testid="select-${i}"
                  aria-label="${layer.name} fixed radius"
                  ?disabled="${layer.isConcentric}"
                  .value="${layer.fixedRadius}"
                  @change="${(e: Event) =>
                    this.setFixedRadius(i, (e.target as HTMLSelectElement).value)}"
                >
                  <option value="--radius-0">--radius-0 · 0px</option>
                  <option value="--radius-25">--radius-25 · 2px</option>
                  <option value="--radius-50">--radius-50 · 4px</option>
                  <option value="--radius-100">--radius-100 · 8px</option>
                  <option value="--radius-150">--radius-150 · 12px</option>
                  <option value="--radius-250">--radius-250 · 20px</option>
                  <option value="--radius-300">--radius-300 · 24px</option>
                </select>
              </div>
            `
          )}
        </div>

        <div class="status-box" role="status" aria-live="polite">
          <strong>${statusSummary}</strong>
          <span class="mono">${statusDetail}</span>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('ads-concentric-demo')) {
  customElements.define('ads-concentric-demo', AdsConcentricDemo);
}

declare global {
  interface HTMLElementTagNameMap {
    'ads-concentric-demo': AdsConcentricDemo;
  }
}
