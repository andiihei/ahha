import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../components/selector-button.js";

const demoOptions = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
  { value: "gamma", label: "Gamma" }
];

const modeOptions = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" }
];

const meta: Meta = {
  title: "Components/Selector Button",
  component: "ads-selector-button",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text"
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    label: {
      control: "text"
    },
    minWidth: {
      control: "text",
      description: "Minimum width of the trigger pill (e.g. 7.5rem, 8.5rem, auto)"
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    value: "alpha",
    size: "md",
    label: "Demo selector",
    minWidth: "8rem"
  },
  render: (args) => html`
    <ads-selector-button
      value=${args.value}
      size=${args.size}
      label=${args.label}
      min-width=${args.minWidth}
      .options=${demoOptions}
    ></ads-selector-button>
  `
};

export const ModeSwitchApp: Story = {
  args: {
    value: "system",
    size: "md",
    label: "Colour mode",
    minWidth: "8rem"
  },
  render: (args) => html`
    <ads-selector-button
      value=${args.value}
      size=${args.size}
      label=${args.label}
      min-width=${args.minWidth}
      .options=${modeOptions}
    ></ads-selector-button>
  `
};

export const SizeScale: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-60, 0.75rem);">
      <ads-selector-button
        value="alpha"
        size="sm"
        label="Small selector"
        min-width="6.5rem"
        .options=${demoOptions}
      ></ads-selector-button>
      <ads-selector-button
        value="alpha"
        size="md"
        label="Medium selector"
        min-width="8rem"
        .options=${demoOptions}
      ></ads-selector-button>
      <ads-selector-button
        value="alpha"
        size="lg"
        label="Large selector"
        min-width="9.5rem"
        .options=${demoOptions}
      ></ads-selector-button>
    </div>
  `
};
