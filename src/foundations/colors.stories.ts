import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { COLOR_FAMILIES, COLOR_STEPS, COLOR_TOKENS } from './tokens.js';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: {
    docs: {
      description: {
        component: `
# Colors & Opacity (Layer 1 Foundations)
The AHHA Design Language uses **6 OKLCH primitive ramps** (\`neutral\`, \`purple\`, \`green\`, \`red\`, \`yellow\`, \`blue\`), each across 11 discrete luminance steps (\`1000..25\`).

- **Brand Core**: \`neutral\` (Midnight) is engineered for universal color blindness ($L_c \\ge 107$).
- **No Direct Color Hardcoding**: Components consume Layer 2 Color Roles (\`--surface-bg\`, \`--action-bg-1\`), which map to these Layer 1 ramps via \`[data-style]\` and \`[data-mode]\`.
- **Live Edit**: Use the controls below to preview custom OKLCH overrides live.
        `,
      },
    },
  },
  argTypes: {
    previewLightness: {
      name: 'Lightness Override (Step 800)',
      control: { type: 'range', min: 0.1, max: 0.9, step: 0.02 },
      defaultValue: 0.38,
      description: 'Dynamically adjust OKLCH lightness on sample element',
    },
    previewChroma: {
      name: 'Chroma Override (Step 800)',
      control: { type: 'range', min: 0.01, max: 0.25, step: 0.01 },
      defaultValue: 0.12,
      description: 'Dynamically adjust OKLCH chroma on sample element',
    },
  },
};

export default meta;
type Story = StoryObj;

export const AllColorRamps: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2.5rem; width: 100%; max-width: 900px;">
      ${COLOR_FAMILIES.map(
        (family) => html`
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <h3 style="font-family: var(--font-alt); font-size: var(--step-125); text-transform: capitalize; margin: 0;">
                ${family} ${family === 'neutral' ? '(Midnight — Brand Core)' : ''}
              </h3>
              <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                --color-${family}-*
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); gap: 0.5rem;">
              ${COLOR_STEPS.map((step) => {
                const tokenName = `color-${family}-${step}`;
                const token = COLOR_TOKENS[tokenName];
                const bg = `var(--color-${family}-${step}, ${token?.$value || '#ccc'})`;
                const textColor = step >= 500 ? '#fff' : '#000';

                return html`
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      border-radius: var(--radius-100);
                      overflow: hidden;
                      border: 1px solid var(--surface-border);
                      background: var(--surface-bg-1);
                    "
                  >
                    <div
                      style="
                        height: 54px;
                        background: ${bg};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: ${textColor};
                        font-family: var(--font-mono);
                        font-size: var(--step-75);
                        font-weight: 600;
                        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                      "
                    >
                      ${step}
                    </div>
                    <div style="padding: 0.375rem; font-family: var(--font-mono); font-size: 0.65rem; text-align: center; color: var(--text-fg-2);">
                      ${token?.$value.split(' ')[0].replace('oklch(', '') || ''}
                    </div>
                  </div>
                `;
              })}
            </div>
          </div>
        `
      )}
    </div>
  `,
};

export const LiveColorTweaker: Story = {
  args: {
    previewLightness: 0.38,
    previewChroma: 0.12,
  },
  render: (args) => {
    const customOklch = `oklch(${args.previewLightness} ${args.previewChroma} 245)`;

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; width: 100%;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Live OKLCH Token Synthesizer
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
            Adjust the sliders in the Storybook <strong>Controls</strong> panel below to calibrate lightness and chroma live.
          </p>
        </div>

        <div
          style="
            padding: 2rem;
            border-radius: var(--radius-250);
            background: ${customOklch};
            color: ${args.previewLightness < 0.55 ? '#ffffff' : '#000000'};
            box-shadow: var(--elevation-medium);
            transition: all var(--duration-100) var(--ease-out);
            text-align: center;
          "
        >
          <div style="font-family: var(--font-mono); font-size: var(--step-110); font-weight: 700;">
            ${customOklch}
          </div>
          <div style="font-size: var(--step-80); opacity: 0.9; margin-top: 0.5rem;">
            Synthesized Live Preview Surface
          </div>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center; font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
          <span>Lightness: ${args.previewLightness}</span>
          <span>·</span>
          <span>Chroma: ${args.previewChroma}</span>
          <span>·</span>
          <span>Hue: 245° (Cobalt)</span>
        </div>
      </div>
    `;
  },
};

export const OpacityStateLayers: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 700px; width: 100%;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Opacity & State Layers
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Global opacity tokens co-located in <code>colors.css</code> governing interactive states (hover at 10%, active at 15%, disabled at 40%).
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem;">
        ${[0, 5, 10, 15, 20, 40, 60, 80, 100].map(
          (op) => html`
            <div
              style="
                padding: 1rem;
                border-radius: var(--radius-100);
                border: 1px solid var(--surface-border);
                background: var(--surface-bg-1);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
              "
            >
              <div
                style="
                  width: 50px;
                  height: 50px;
                  border-radius: var(--radius-50);
                  background: var(--text-fg-1);
                  opacity: var(--opacity-${op});
                  border: 1px dashed var(--surface-border);
                "
              ></div>
              <span style="font-family: var(--font-mono); font-size: var(--step-75); font-weight: 600;">
                --opacity-${op}
              </span>
              <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                ${op / 100}
              </span>
            </div>
          `
        )}
      </div>
    </div>
  `,
};
