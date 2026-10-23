import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * @tag ads-toggle
 * An enterprise-grade accessible toggle/switch custom element rendered in Light DOM.
 *
 * @fires change - Dispatched when the toggle state changes, with { checked: boolean }
 */
@customElement("ads-toggle")
export class AdsToggle extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  label = "";

  private _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }

  override render() {
    return html`
      <button
        class="toggle"
        role="switch"
        type="button"
        aria-checked=${this.checked ? "true" : "false"}
        ?disabled=${this.disabled}
        @click=${this._toggle}
      >
        <span class="toggle-track" aria-hidden="true">
          <span class="toggle-knob"></span>
        </span>
        ${this.label ? html`<span class="toggle-label">${this.label}</span>` : html`<slot></slot>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ads-toggle": AdsToggle;
  }
}
