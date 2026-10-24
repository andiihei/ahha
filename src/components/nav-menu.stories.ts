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
      options: ["index.html", "components.html", "strategy.html", "status.html"]
    },
    mode: {
      control: "select",
      options: ["default", "system", "invert"]
    },
    hideModeSwitch: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    currentPath: "components.html",
    mode: "system",
    hideModeSwitch: false
  },
  render: (args) => html`
    <div style="background: var(--surface-bg); min-height: 12rem;">
      <ads-nav-menu
        .links=${demoLinks}
        current-path=${args.currentPath}
        mode=${args.mode}
        ?hide-mode-switch=${args.hideModeSwitch}
      ></ads-nav-menu>
    </div>
  `
};

export const FoundationsCurrent: Story = {
  args: {
    currentPath: "index.html",
    mode: "system",
    hideModeSwitch: false
  },
  render: (args) => html`
    <div style="background: var(--surface-bg); min-height: 12rem;">
      <ads-nav-menu
        .links=${demoLinks}
        current-path=${args.currentPath}
        mode=${args.mode}
        ?hide-mode-switch=${args.hideModeSwitch}
      ></ads-nav-menu>
    </div>
  `
};
