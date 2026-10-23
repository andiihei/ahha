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
    label: "Demo selector",
    minWidth: "7.5rem"
  },
  render: (args) => html`
    <ads-selector-button
      value=${args.value}
      label=${args.label}
      min-width=${args.minWidth}
      .options=${demoOptions}
    ></ads-selector-button>
  `
};

export const ModeSwitchApp: Story = {
  args: {
    value: "system",
    label: "Colour mode",
    minWidth: "8rem"
  },
  render: (args) => html`
    <ads-selector-button
      value=${args.value}
      label=${args.label}
      min-width=${args.minWidth}
      .options=${modeOptions}
    ></ads-selector-button>
  `
};
