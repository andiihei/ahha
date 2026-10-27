import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { expect, userEvent, within } from "storybook/test";
import "../components/toggle.js";

const meta: Meta = {
  title: "Components/Toggle",
  component: "ads-toggle",
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean"
    },
    disabled: {
      control: "boolean"
    },
    label: {
      control: "text"
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
    label: "Notifications"
  },
  render: (args) => html`
    <ads-toggle
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      .label=${args.label}
    ></ads-toggle>
  `
};

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    label: "Notifications enabled"
  },
  render: (args) => html`
    <ads-toggle
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      .label=${args.label}
    ></ads-toggle>
  `
};

/**
 * Replicating the Stage 2 specimen layout from components.html:
 * 4 list items with status readouts.
 */
export const SpecimenList: Story = {
  render: () => html`
    <div style="display: grid; gap: var(--space-100, 1.25rem); width: 100%; max-width: 32rem;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <ads-toggle checked label="Notifications"></ads-toggle>
        <span style="font-family: var(--font-mono); font-size: var(--step-70); color: var(--text-fg-2);">On</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <ads-toggle label="Weekly digest"></ads-toggle>
        <span style="font-family: var(--font-mono); font-size: var(--step-70); color: var(--text-fg-2);">Off</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <ads-toggle checked disabled label="Two-factor authentication"></ads-toggle>
        <span style="font-family: var(--font-mono); font-size: var(--step-70); color: var(--text-fg-2);">On · disabled</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <ads-toggle disabled label="Beta features"></ads-toggle>
        <span style="font-family: var(--font-mono); font-size: var(--step-70); color: var(--text-fg-2);">Off · disabled</span>
      </div>
    </div>
  `
};

export const InteractiveToggle: Story = {
  args: {
    checked: false,
    label: "Interactive Test Toggle"
  },
  render: (args) => html`
    <ads-toggle
      ?checked=${args.checked}
      .label=${args.label}
    ></ads-toggle>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("switch");

    // Initially off
    await expect(button).toHaveAttribute("aria-checked", "false");

    // Click to turn on
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-checked", "true");

    // Click again to turn off
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-checked", "false");
  }
};
