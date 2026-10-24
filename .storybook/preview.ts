import type { Preview } from "@storybook/web-components";
import { html } from "lit";
import { setInspectorActive } from "./style-inspector.js";

// Load AHHA design language tokens
import "../design-language/colors.css";
import "../design-language/typography.css";
import "../design-language/space.css";
import "../design-language/grid.css";
import "../design-language/elevation.css";
import "../design-language/radius.css";
import "../design-language/motion.css";
import "../design-language/opacity.css";
import "../components/button.css";
import "../components/toggle.css";
import "../components/selector-button.css";
import "../components/nav-menu.css";

const preview: Preview = {
  parameters: {
    docs: {
      source: {
        type: "dynamic"
      }
    },
    html: {
      root: '#story-component-root',
      highlighter: {
        showLineNumbers: true,
        wrapLines: true
      },
      removeEmptyComments: true
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
  globalTypes: {
    family: {
      name: "Color Family",
      description: "AHHA Color Family Scheme",
      defaultValue: "neutral",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "neutral", title: "Neutral" },
          { value: "purple", title: "Purple" },
          { value: "green", title: "Green" },
          { value: "red", title: "Red" },
          { value: "yellow", title: "Yellow" },
          { value: "blue", title: "Blue" }
        ],
        showName: true
      }
    },
    mode: {
      name: "Mode",
      description: "Default vs. Invert",
      defaultValue: "default",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "default", title: "Default (Light)" },
          { value: "invert", title: "Invert (Dark)" }
        ],
        showName: true
      }
    },
    inspectCss: {
      name: "Inspect CSS",
      description: "Live Element Style & Token HUD Inspector",
      defaultValue: "off",
      toolbar: {
        icon: "eye",
        items: [
          { value: "off", title: "Inspector: Off" },
          { value: "on", title: "Inspector: On" }
        ],
        showName: true
      }
    }
  },
  decorators: [
    (story, context) => {
      const family = context.globals.family || "neutral";
      const mode = context.globals.mode || "default";
      const inspect = context.globals.inspectCss === "on";

      setInspectorActive(inspect);

      return html`
        <div
          data-style="${family}"
          data-mode="${mode}"
          style="padding: 2rem; background: var(--surface-bg); color: var(--text-fg-1); border-radius: var(--radius-150); border: 1px solid var(--surface-border); min-height: 100px; display: flex; align-items: center; justify-content: center; gap: 1rem;"
        >
          <div id="story-component-root" style="display: contents;">
            ${story()}
          </div>
        </div>
      `;
    }
  ]
};

export default preview;
