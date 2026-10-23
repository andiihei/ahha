import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/button.js";

const meta: Meta = {
  title: "Components/Button",
  component: "ads-button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"]
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

export const Primary: Story = {
  args: {
    variant: "primary",
    disabled: false,
    label: "Primary action"
  },
  render: (args) => html`
    <ads-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      .label=${args.label}
    ></ads-button>
  `
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    disabled: false,
    label: "Secondary action"
  },
  render: (args) => html`
    <ads-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      .label=${args.label}
    ></ads-button>
  `
};

/**
 * Replicating the Stage 3 specimen layout from components.html:
 * Two rows of active and disabled pairs.
 */
export const SpecimenMatrix: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--space-100, 1.25rem);">
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-60, 0.75rem);">
        <ads-button variant="primary" label="Primary action"></ads-button>
        <ads-button variant="secondary" label="Secondary action"></ads-button>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: var(--space-60, 0.75rem);">
        <ads-button variant="primary" disabled label="Primary action"></ads-button>
        <ads-button variant="secondary" disabled label="Secondary action"></ads-button>
      </div>
    </div>
  `
};
