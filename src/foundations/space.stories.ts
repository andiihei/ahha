import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { SPACE_TOKENS } from './tokens.js';

const meta: Meta = {
  title: 'Foundations/Space',
  parameters: {
    docs: {
      description: {
        component: `
# Spacing Scales (Layer 1 Foundations)
AHHA establishes a clear division of responsibility between two spatial domains:
1. **Fluid Spacing Ladder (\`--space-10\` to \`--space-500\`)**: Fluid Utopia scales calculated from viewport progression. Reserved exclusively for **macro layout** (page containers, section gaps, hero paddings).
2. **Static Spacing Ladder (\`--space-static-10\` to \`--space-static-500\`)**: Frozen rem values anchored to a 20px base. Reserved for **micro components** (button paddings, toggle insets, icon offsets) to prevent distortion when resizing.
        `,
      },
    },
  },
  argTypes: {
    selectedSpace: {
      name: 'Sample Spacing Token',
      control: { type: 'select' },
      options: [
        '--space-25',
        '--space-50',
        '--space-75',
        '--space-100',
        '--space-150',
        '--space-200',
        '--space-250',
        '--space-300',
      ],
      defaultValue: '--space-100',
      description: 'Test container padding live',
    },
  },
};

export default meta;
type Story = StoryObj;

export const FluidSpacingLadder: Story = {
  argTypes: {
    containerWidth: {
      name: 'Container / Viewport Width',
      control: { type: 'range', min: 360, max: 1440, step: 20 },
      defaultValue: 1000,
      description: 'Simulate responsive container width to observe fluid expansion',
    },
  },
  args: {
    containerWidth: 1000,
  },
  render: (args) => {
    const rootPx = 16;
    const progress = Math.min(Math.max((args.containerWidth - 360) / (1240 - 360), 0), 1);

    const steps = [
      { name: '10', min: 1, max: 1 },
      { name: '20', min: 2, max: 2 },
      { name: '25', min: 3, max: 4 },
      { name: '50', min: 9, max: 10 },
      { name: '60', min: 11, max: 12 },
      { name: '75', min: 13, max: 15 },
      { name: '100', min: 18, max: 20 },
      { name: '125', min: 22, max: 25 },
      { name: '150', min: 27, max: 31 },
      { name: '200', min: 36, max: 40 },
      { name: '250', min: 44, max: 50 },
      { name: '300', min: 54, max: 62 },
      { name: '400', min: 72, max: 80 },
      { name: '500', min: 90, max: 100 },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Fluid Spacing Scale (Macro Layout)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Thirteen steps scaling continuously between 360px and 1240px. The bars take the authentic specimen styling: <strong>pale Neutral fill with 1px border edges on the left and right</strong>. Drag the container slider in Controls to watch the bars breathe.
          </p>

          <div
            style="
              display: inline-flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.5rem 1rem;
              background: var(--surface-bg-1);
              border: 1px solid var(--surface-border);
              border-radius: var(--radius-100);
              font-family: var(--font-mono);
              font-size: var(--step-75);
              margin-bottom: 1rem;
            "
          >
            <span>Simulated Viewport: <strong>${args.containerWidth}px</strong></span>
            <span>·</span>
            <span>Progress: <strong>${Math.round(progress * 100)}%</strong></span>
          </div>
        </div>

        <div
          style="
            width: 100%;
            max-width: ${args.containerWidth}px;
            background: var(--surface-bg);
            border: 1px dashed var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            box-sizing: border-box;
            transition: max-width var(--duration-100) var(--ease-out);
          "
        >
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${steps.map((s) => {
              const currentPx = Math.round(s.min + (s.max - s.min) * progress);
              const currentRem = (currentPx / rootPx).toFixed(4);

              return html`
                <div
                  style="
                    display: grid;
                    grid-template-columns: 14rem 1fr;
                    gap: 1.25rem;
                    align-items: center;
                    padding-block: 4px;
                    border-bottom: 1px solid color-mix(in oklch, var(--surface-border) 40%, transparent);
                  "
                >
                  <div style="display: flex; flex-direction: column; font-size: var(--step-75);">
                    <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-fg-1);">
                      --space-${s.name}
                    </span>
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                      now ${currentRem}rem · ${currentPx}px
                    </span>
                  </div>

                  <div style="min-width: 0; display: flex; align-items: center;">
                    <div
                      style="
                        height: 16px;
                        width: ${currentPx}px;
                        background: var(--neutral-100);
                        border-left: 1px solid var(--neutral-700);
                        border-right: 1px solid var(--neutral-700);
                        border-radius: 0;
                        min-width: 2px;
                        box-sizing: border-box;
                        transition: width var(--duration-100) var(--ease-out);
                      "
                      title="--space-${s.name}: ${currentRem}rem (${currentPx}px)"
                    ></div>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};

export const StaticMicroSpacing: Story = {
  render: () => {
    const staticSteps = [
      { name: '10', rem: '0.0625rem', px: 1 },
      { name: '20', rem: '0.125rem', px: 2 },
      { name: '25', rem: '0.25rem', px: 4 },
      { name: '50', rem: '0.5rem', px: 8 },
      { name: '75', rem: '0.75rem', px: 12 },
      { name: '100', rem: '1.25rem', px: 20 },
      { name: '150', rem: '1.875rem', px: 30 },
      { name: '200', rem: '2.5rem', px: 40 },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 850px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Static Spacing Scale (Micro Components)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
            Frozen dimensional units anchored to a 20px base, ensuring buttons, toggles, and form controls stay invariant. Styled in Cerise (pale red fill with 1px dark red left/right borders).
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${staticSteps.map(
            (s) => html`
              <div
                style="
                  display: grid;
                  grid-template-columns: 14rem 1fr;
                  gap: 1.25rem;
                  align-items: center;
                  padding-block: 4px;
                  border-bottom: 1px solid color-mix(in oklch, var(--surface-border) 40%, transparent);
                "
              >
                <div style="display: flex; flex-direction: column; font-size: var(--step-75);">
                  <span style="font-family: var(--font-mono); font-weight: 600; color: var(--text-fg-1);">
                    --space-static-${s.name}
                  </span>
                  <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                    ${s.rem} · ${s.px}px — fixed
                  </span>
                </div>

                <div style="min-width: 0; display: flex; align-items: center;">
                  <div
                    style="
                      height: 16px;
                      width: ${s.px}px;
                      background: var(--red-100);
                      border-left: 1px solid var(--red-700);
                      border-right: 1px solid var(--red-700);
                      border-radius: 0;
                      min-width: 1px;
                      box-sizing: border-box;
                    "
                    title="--space-static-${s.name}: ${s.rem} (${s.px}px)"
                  ></div>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  },
};

export const InteractiveSpacingPreview: Story = {
  args: {
    selectedSpace: '--space-100',
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 650px; width: 100%;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Interactive Spacing Box Preview
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Select different spacing tokens in Storybook <strong>Controls</strong> to preview padding dynamics.
        </p>
      </div>

      <div
        style="
          background: color-mix(in oklch, var(--action-bg-1) 15%, transparent);
          border: 1px dashed var(--action-border);
          border-radius: var(--radius-150);
          padding: var(${args.selectedSpace});
          transition: padding var(--duration-200) var(--ease-out);
        "
      >
        <div
          style="
            background: var(--surface-bg-1);
            border: 1px solid var(--surface-border);
            border-radius: var(--radius-100);
            padding: var(--space-static-100);
            text-align: center;
          "
        >
          <div style="font-family: var(--font-mono); font-size: var(--step-80); font-weight: 600;">
            Padding: var(${args.selectedSpace})
          </div>
          <div style="font-size: var(--step-75); color: var(--text-fg-2); margin-top: 0.25rem;">
            Content area inside dynamic spatial padding
          </div>
        </div>
      </div>
    </div>
  `,
};
