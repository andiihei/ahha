import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * @tag ads-button
 * An enterprise-grade, accessible button custom element rendered in Light DOM
 * allowing full cascade of AHHA typography, atomic modifiers (.u-text-caps), and scheme slots.
 */
@customElement("ads-button")
export class AdsButton extends LitElement {
  // Render in Light DOM so global utility classes (.u-text-caps, typography roles) apply cleanly
  override createRenderRoot() {
    return this;
  }

  @property({ type: String, reflect: true })
  variant: "primary" | "secondary" = "primary";

  @property({ type: String, reflect: true })
  size: "sm" | "md" | "lg" | "75" | "100" | "110" = "md";

  @property({ type: Boolean, reflect: true })
  critical = false;

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

    // Map size aliases: sm -> 75, md -> 100, lg -> 110
    const normalizedSize =
      this.size === "sm" ? "75" : this.size === "lg" ? "110" : this.size === "75" || this.size === "110" ? this.size : "100";

    const labelClasses = ["state-btn-label"];
    if (this.critical) {
      labelClasses.push("u-text-caps");
    }

    return html`
      <button
        type=${this.type}
        class="state-btn ${variantClass}"
        data-size=${normalizedSize}
        ?disabled=${this.disabled}
        aria-label=${this.ariaLabelText ?? undefined}
      >
        <span class="${labelClasses.join(" ")}">
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
