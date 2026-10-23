import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|ts)"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {}
  },
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@whitespace/storybook-addon-html"
  ],
  docs: {
    autodocs: true
  }
};

export default config;
