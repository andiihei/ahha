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
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    critical: {
      control: "boolean",
      description: "Applies the .text-caps uppercase utility class to button text"
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
    size: "md",
    critical: false,
    disabled: false,
    label: "Primary action"
  },
  render: (args) => html`
    <ads-button
      variant=${args.variant}
      size=${args.size}
      ?critical=${args.critical}
      ?disabled=${args.disabled}
      .label=${args.label}
    ></ads-button>
  `
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    critical: false,
    disabled: false,
    label: "Secondary action"
  },
  render: (args) => html`
    <ads-button
      variant=${args.variant}
      size=${args.size}
      ?critical=${args.critical}
      ?disabled=${args.disabled}
      .label=${args.label}
    ></ads-button>
  `
};

export const CriticalAction: Story = {
  args: {
    variant: "primary",
    size: "md",
    critical: true,
    disabled: false,
    label: "Critical action"
  },
  render: (args) => html`
    <ads-button
      variant=${args.variant}
      size=${args.size}
      ?critical=${args.critical}
      ?disabled=${args.disabled}
      .label=${args.label}
    ></ads-button>
  `
};

/**
 * Replicating the Stage 3 specimen layout from components.html:
 * Pairs of active and disabled buttons, plus size scale (sm, md, lg) and critical flag.
 */
export const SpecimenMatrix: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--space-100, 1.25rem);">
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-60, 0.75rem);">
        <ads-button variant="primary" label="Primary action"></ads-button>
        <ads-button variant="secondary" label="Secondary action"></ads-button>
        <ads-button variant="primary" critical label="Critical action"></ads-button>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-60, 0.75rem);">
        <ads-button variant="primary" disabled label="Primary action"></ads-button>
        <ads-button variant="secondary" disabled label="Secondary action"></ads-button>
        <ads-button variant="primary" critical disabled label="Critical action"></ads-button>
      </div>
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-60, 0.75rem);">
        <ads-button variant="primary" size="sm" label="Small (sm)"></ads-button>
        <ads-button variant="primary" size="md" label="Medium (md)"></ads-button>
        <ads-button variant="primary" size="lg" label="Large (lg)"></ads-button>
      </div>
    </div>
  `
};
