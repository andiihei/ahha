import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/nav-menu.js";

const demoLinks = [
  { href: "index.html", label: "Foundations" },
  { href: "components.html", label: "Components" },
  { href: "strategy.html", label: "Strategy" },
  { href: "status.html", label: "Status" }
];

const meta: Meta = {
  title: "Components/Navigation Menu",
  component: "ads-nav-menu",
  tags: ["autodocs"],
  argTypes: {
    currentPath: {
      control: "select",
      options: ["index.html", "components.html", "strategy.html", "status.html"],
      description: "URL path marked as active (aria-current='page')"
    },
    variant: {
      control: "select",
      options: ["auto", "full", "compact", "xCompact"],
      description: "Force responsive tier: full (desktop), compact (tablet/icon-only switch), xCompact (mobile burger), or auto (container/viewport responsive)"
    },
    containerWidth: {
      control: { type: "range", min: 300, max: 1200, step: 20 },
      description: "Width in px of the container wrapper for interactive responsiveness testing"
    },
    mode: {
      control: "select",
      options: ["default", "system", "invert"],
      description: "Active color mode"
    },
    hideModeSwitch: {
      control: "boolean",
      description: "Optionally hide the mode switch control"
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    currentPath: "components.html",
    variant: "auto",
    containerWidth: 1000,
    mode: "system",
    hideModeSwitch: false
  },
  render: (args) => html`
    <div
      style="
        width: 100%;
        max-width: ${args.containerWidth}px;
        margin-inline: auto;
        background: var(--surface-bg);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-100);
        min-height: 12rem;
        transition: max-width var(--duration-100) var(--ease-out);
        container-type: inline-size;
        container-name: nav;
      "
    >
      <div style="padding: 0.5rem 1rem; font-size: var(--step-70); color: var(--text-fg-2); border-bottom: 1px solid var(--surface-border); display: flex; justify-content: space-between;">
        <span>Container width: <strong>${args.containerWidth}px</strong></span>
        <span>Variant: <strong>${args.variant || "auto"}</strong></span>
      </div>
      <ads-nav-menu
        .links=${demoLinks}
        current-path=${args.currentPath}
        variant=${args.variant !== "auto" ? args.variant : undefined}
        mode=${args.mode}
        ?hide-mode-switch=${args.hideModeSwitch}
      ></ads-nav-menu>
    </div>
  `
};

export const FullDesktop: Story = {
  args: {
    currentPath: "components.html",
    variant: "full",
    mode: "system",
    hideModeSwitch: false
  },
  render: (args) => html`
    <div style="background: var(--surface-bg); min-height: 12rem;">
      <ads-nav-menu
        .links=${demoLinks}
        current-path=${args.currentPath}
        variant="full"
        mode=${args.mode}
        ?hide-mode-switch=${args.hideModeSwitch}
      ></ads-nav-menu>
    </div>
  `
};

export const CompactTablet: Story = {
  args: {
    currentPath: "components.html",
    variant: "compact",
    mode: "system",
    hideModeSwitch: false
  },
  render: (args) => html`
    <div style="background: var(--surface-bg); min-height: 12rem;">
      <ads-nav-menu
        .links=${demoLinks}
        current-path=${args.currentPath}
        variant="compact"
        mode=${args.mode}
        ?hide-mode-switch=${args.hideModeSwitch}
      ></ads-nav-menu>
    </div>
  `
};

export const ExtraCompactMobile: Story = {
  args: {
    currentPath: "components.html",
    variant: "xCompact",
    mode: "system",
    hideModeSwitch: false
  },
  render: (args) => html`
    <div style="background: var(--surface-bg); max-width: 380px; margin-inline: auto; border: 1px dashed var(--surface-border); min-height: 16rem;">
      <ads-nav-menu
        .links=${demoLinks}
        current-path=${args.currentPath}
        variant="xCompact"
        mode=${args.mode}
        ?hide-mode-switch=${args.hideModeSwitch}
      ></ads-nav-menu>
    </div>
  `
};

export const InteractiveResponsiveContainer: Story = {
  args: {
    currentPath: "components.html",
    containerWidth: 640,
    mode: "system",
    hideModeSwitch: false
  },
  render: (args) => html`
    <div
      style="
        resize: horizontal;
        overflow: auto;
        width: 100%;
        max-width: ${args.containerWidth}px;
        min-width: 280px;
        margin-inline: auto;
        padding: 0.5rem;
        background: var(--surface-bg);
        border: 2px solid var(--surface-border);
        border-radius: var(--radius-100);
        min-height: 14rem;
        container-type: inline-size;
        container-name: nav;
      "
    >
      <div style="padding: 0.25rem 0.5rem; font-size: var(--step-70); color: var(--text-fg-2); border-bottom: 1px solid var(--surface-border); display: flex; justify-content: space-between;">
        <span>Drag right handle or use containerWidth slider to test responsive tiers</span>
        <span>${args.containerWidth}px</span>
      </div>
      <ads-nav-menu
        .links=${demoLinks}
        current-path=${args.currentPath}
        mode=${args.mode}
        ?hide-mode-switch=${args.hideModeSwitch}
      ></ads-nav-menu>
    </div>
  `
};
