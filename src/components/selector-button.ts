import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface SelectorOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * @tag ads-selector-button
 * An enterprise-grade accessible single-select dropdown pill custom element rendered in Light DOM.
 * Exactly matches the CSS specification and geometry of .selector-btn in AHHA.
 */
@customElement("ads-selector-button")
export class AdsSelectorButton extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @property({ type: String, reflect: true })
  value = "";

  @property({ type: Array })
  options: SelectorOption[] = [];

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  label = "Select an option";

  @property({ type: String, attribute: "min-width" })
  minWidth = "";

  override connectedCallback() {
    super.connectedCallback();
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    document.addEventListener("click", this._handleOutsideClick);
    document.addEventListener("keydown", this._handleKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleOutsideClick);
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  private _handleOutsideClick(e: MouseEvent) {
    if (!this.open) return;
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === "Escape") {
      this.open = false;
      const trigger = this.querySelector<HTMLButtonElement>(".selector-btn-trigger");
      trigger?.focus();
    }
  }

  private _toggleOpen() {
    this.open = !this.open;
  }

  private _selectOption(opt: SelectorOption) {
    this.value = opt.value;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { value: opt.value, option: opt },
        bubbles: true,
        composed: true
      })
    );
  }

  private _renderGlyph(opt: SelectorOption) {
    const key = opt.icon || opt.value;
    switch (key) {
      // Tabler / Stage 1 geometric demo specimen glyphs:
      case "alpha":
      case "circle":
        return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9"/></svg>`;
      case "beta":
      case "triangle":
        return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5l8 15H4z"/></svg>`;
      case "gamma":
      case "square":
        return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-square"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`;
      // Tabler mode glyphs:
      case "light":
      case "sun":
      case "default":
        return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-sun"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="4"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/></svg>`;
      case "system":
      case "device-desktop":
      case "contrast":
        return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-contrast"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" stroke="none"/></svg>`;
      case "dark":
      case "moon":
      case "invert":
        return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-moon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"/></svg>`;
      default:
        return null;
    }
  }

  override render() {
    const currentOpt = this.options.find((o) => o.value === this.value) || this.options[0];
    const displayLabel = currentOpt ? currentOpt.label : this.value;
    const currentGlyph = currentOpt ? this._renderGlyph(currentOpt) : null;

    const styleAttr = this.minWidth ? `--selector-min-width: ${this.minWidth};` : "";

    return html`
      <div class="selector-btn" data-open=${this.open ? "true" : "false"} style=${styleAttr}>
        <button
          type="button"
          class="selector-btn-trigger"
          aria-haspopup="true"
          aria-expanded=${this.open ? "true" : "false"}
          aria-label=${this.label}
          @click=${this._toggleOpen}
        >
          <span class="selector-btn-current">
            ${currentGlyph}
          </span>
          <span class="selector-btn-text">${displayLabel}</span>
          <svg
            class="selector-btn-chevron"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 9l6 6l6 -6" />
          </svg>
        </button>

        <div class="selector-btn-options" role="group" aria-label=${this.label}>
          ${this.options.map(
            (opt) => html`
              <button
                type="button"
                class="selector-btn-option"
                data-selector-option=${opt.value}
                aria-pressed=${opt.value === this.value ? "true" : "false"}
                @click=${() => this._selectOption(opt)}
              >
                ${this._renderGlyph(opt)}
                <span class="selector-btn-text">${opt.label}</span>
              </button>
            `
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ads-selector-button": AdsSelectorButton;
  }
}
