import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./selector-button.js";

export interface NavLink {
  href: string;
  label: string;
  current?: boolean;
}

/**
 * @tag ads-nav-menu
 * An enterprise navigation bar rendered in Light DOM.
 * Integrates brand logo, navigation links, theme Mode Switch (via ads-selector-button),
 * and a mobile collapsible drawer.
 *
 * @fires mode-change - Fired when the color mode is toggled, detail: { mode: string }
 */
@customElement("ads-nav-menu")
export class AdsNavMenu extends LitElement {
  override createRenderRoot() {
    return this;
  }

  @property({ type: Array })
  links: NavLink[] = [
    { href: "index.html", label: "Foundations" },
    { href: "components.html", label: "Components" },
    { href: "strategy.html", label: "Strategy" },
    { href: "status.html", label: "Status" }
  ];

  @property({ type: String, attribute: "current-path" })
  currentPath = "index.html";

  @property({ type: String, reflect: true })
  variant?: "full" | "compact" | "xCompact" | "auto";

  @property({ type: String, reflect: true })
  mode: "default" | "system" | "invert" = "system";

  @property({ type: Boolean, attribute: "hide-mode-switch" })
  hideModeSwitch = false;

  @state()
  private _drawerOpen = false;

  private _modeOptions = [
    { value: "default", label: "Light", icon: "light" },
    { value: "system", label: "System", icon: "system" },
    { value: "invert", label: "Dark", icon: "dark" }
  ];

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
    if (!this._drawerOpen) return;
    const path = e.composedPath();
    const burger = this.querySelector(".ads-nav-menu-burger");
    const drawer = this.querySelector(".ads-nav-menu-drawer");
    if (!burger?.contains(e.target as Node) && !drawer?.contains(e.target as Node)) {
      this._drawerOpen = false;
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && this._drawerOpen) {
      this._drawerOpen = false;
      const burger = this.querySelector<HTMLButtonElement>(".ads-nav-menu-burger");
      burger?.focus();
    }
  }

  private _toggleDrawer() {
    this._drawerOpen = !this._drawerOpen;
  }

  private _setMode(newMode: "default" | "system" | "invert") {
    this.mode = newMode;
    document.documentElement.setAttribute("data-mode", newMode);
    this.dispatchEvent(
      new CustomEvent("mode-change", {
        detail: { mode: newMode },
        bubbles: true,
        composed: true
      })
    );
  }

  override render() {
    return html`
      <header class="ads-nav-menu-wrap" role="banner">
        <div class="u-container">
          <a href="index.html" class="ads-nav-menu-brand" aria-label="Andii Hei — Home">
            <slot name="brand">
              <svg class="brand-logo" viewBox="0 0 160 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Andii Hei">
                <g clip-path="url(#clip0_nav)"><g style="fill: var(--brand-ink, var(--color-1000, var(--neutral-1000)))"><path d="M10.2128 3.8147e-06H15.0482L25.261 24.0035H19.7794L17.6014 18.6574H7.52756L5.3426 24.0104H-7.62939e-06L10.2128 3.8147e-06ZM15.729 14.0269L12.561 6.2944L9.39643 14.0235L15.729 14.0269Z"/><path d="M28.9362 0.170212H33.7681L44.9362 14.8432V0.170212H50.112V24.0104H45.6657L34.1224 8.85801V24.0104H28.9362V0.170212Z"/><path d="M55.8298 0.170212H65.1185C72.6079 0.170212 77.7838 5.31134 77.7838 12.0191V12.0851C77.7872 18.7998 72.6114 24.0104 65.1185 24.0104H55.8298V0.170212ZM61.0716 4.90491V19.2722H65.1185C69.4086 19.2722 72.3022 16.3786 72.3022 12.1581V12.0886C72.3022 7.868 69.4086 4.90491 65.1185 4.90491H61.0716Z"/><path d="M82.6887 0.170212H87.9305V24.0104H82.6887V0.170212Z"/><path d="M94.1277 0.170212H99.3695V24.0104H94.1277V0.170212Z"/></g><g style="fill: var(--brand-faint, var(--color-200, var(--neutral-200)))"><path d="M159.726 24.0104H154.484V14.4368H144.813V24.0104H139.571V0.170212H144.813V9.60139H154.484V0.170212H159.726V24.0104Z"/><path d="M133.853 24.0104H115.706V19.3382H128.646V14.3326H117.412V9.67086H128.646V4.83543H115.88V0.170212H133.853V24.0104Z"/><path d="M110.809 24.0104H105.563V0.170212H110.809V24.0104Z"/></g></g>
                <defs><clipPath id="clip0_nav"><rect width="159.729" height="24"/></clipPath></defs>
              </svg>
            </slot>
          </a>

          <div class="ads-nav-menu-cluster">
            <nav class="ads-nav-menu-links" aria-label="Main Pages">
              ${this.links.map((link) => {
                const isCurrent = link.current || link.href === this.currentPath;
                return html`
                  <a href=${link.href} aria-current=${isCurrent ? "page" : undefined}>
                    ${link.label}
                  </a>
                `;
              })}
            </nav>

            ${!this.hideModeSwitch
              ? html`
                  <ads-selector-button
                    size="md"
                    .value=${this.mode}
                    label="Colour mode"
                    .options=${this._modeOptions}
                    @select=${(e: CustomEvent) => this._setMode(e.detail.value)}
                  ></ads-selector-button>
                `
              : ""}
          </div>

          <button
            type="button"
            class="ads-nav-menu-burger ${this._drawerOpen ? "is-open" : ""}"
            aria-expanded=${this._drawerOpen ? "true" : "false"}
            aria-controls="nav-drawer"
            aria-label=${this._drawerOpen ? "Close menu" : "Open menu"}
            @click=${this._toggleDrawer}
          >
            <!-- Canonical Tabler menu-3 outline glyph -->
            <svg class="nav-burger-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 6h10"/>
              <path d="M4 12h16"/>
              <path d="M7 12h13"/>
              <path d="M4 18h10"/>
            </svg>
            <svg class="nav-burger-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12"/>
              <path d="M18 6L6 18"/>
            </svg>
          </button>
        </div>

        <div id="nav-drawer" class="ads-nav-menu-drawer ${this._drawerOpen ? "is-open" : ""}">
          <nav class="ads-nav-menu-drawer-links" aria-label="Mobile Navigation">
            ${this.links.map((link) => {
              const isCurrent = link.current || link.href === this.currentPath;
              return html`
                <a href=${link.href} aria-current=${isCurrent ? "page" : undefined}>
                  ${link.label}
                </a>
              `;
            })}
          </nav>

          ${!this.hideModeSwitch
            ? html`
                <div class="ads-nav-menu-mode" role="group" aria-label="Colour mode">
                  ${this._modeOptions.map(
                    (opt) => html`
                      <button
                        type="button"
                        class="ads-nav-menu-mode-btn"
                        aria-pressed=${this.mode === opt.value ? "true" : "false"}
                        @click=${() => this._setMode(opt.value as any)}
                      >
                        ${opt.value === "default"
                          ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>`
                          : opt.value === "system"
                          ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" stroke="none"/></svg>`
                          : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`}
                        <span>${opt.label}</span>
                      </button>
                    `
                  )}
                </div>
              `
            : ""}
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ads-nav-menu": AdsNavMenu;
  }
}
