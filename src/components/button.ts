import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * @tag ads-button
 * An enterprise-grade, accessible button custom element rendered in Light DOM
 * allowing full cascade of AHHA typography, atomic modifiers (.text-caps), and scheme slots.
 */
@customElement("ads-button")
export class AdsButton extends LitElement {
  // Render in Light DOM so global utility classes (.text-caps, typography roles) apply cleanly
  override createRenderRoot() {
    return this;
  }

  @property({ type: String, reflect: true })
  variant: "primary" | "secondary" = "primary";

  @property({ type: String, reflect: true })
  size: "110" | "100" | "75" = "100";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  type: "button" | "submit" | "reset" = "button";

  @property({ type: String, attribute: "aria-label" })
  ariaLabelText: string | null = null;

  @property({ type: String })
  label = "";

  override render() {
    const isPrimary = this.variant !== "secondary";
    const variantClass = isPrimary ? "state-btn-primary" : "state-btn-secondary";

    return html`
      <button
        type=${this.type}
        class="state-btn ${variantClass}"
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabelText ?? undefined}
      >
        <span class="state-btn-label">
          ${this.label || html`<slot></slot>`}
        </span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ads-button": AdsButton;
  }
}
