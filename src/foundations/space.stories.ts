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
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 850px;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Fluid Spacing Scale (Macro Layout)
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Tokens expand fluidly as the viewport scales from 360px up to 1240px.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${[
          'space-10',
          'space-20',
          'space-25',
          'space-50',
          'space-60',
          'space-75',
          'space-100',
          'space-125',
          'space-150',
          'space-200',
          'space-250',
          'space-300',
          'space-400',
          'space-500',
        ].map(
          (step) => html`
            <div
              style="
                display: grid;
                grid-template-columns: 10rem 1fr;
                gap: 1rem;
                align-items: center;
              "
            >
              <div style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-1);">
                --${step}
              </div>
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div
                  style="
                    height: 24px;
                    width: var(--${step});
                    background: var(--action-bg-1);
                    border-radius: var(--radius-50);
                    min-width: 2px;
                    transition: width var(--duration-100) var(--ease-out);
                  "
                ></div>
                <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                  ${SPACE_TOKENS[step]?.$description || ''}
                </span>
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

export const StaticMicroSpacing: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 850px;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Static Spacing Scale (Micro Components)
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Frozen dimensional units anchored to a 20px base, ensuring buttons, toggles, and form controls stay invariant.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${[
          'space-static-10',
          'space-static-20',
          'space-static-25',
          'space-static-50',
          'space-static-75',
          'space-static-100',
          'space-static-150',
          'space-static-200',
        ].map(
          (step) => html`
            <div
              style="
                display: grid;
                grid-template-columns: 12rem 1fr;
                gap: 1rem;
                align-items: center;
              "
            >
              <div style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-1);">
                --${step}
              </div>
              <div style="display: flex; align-items: center; gap: 1rem;">
                <div
                  style="
                    height: 24px;
                    width: var(--${step});
                    background: color-mix(in oklch, var(--action-bg-1) 70%, transparent);
                    border-radius: var(--radius-50);
                    min-width: 1px;
                  "
                ></div>
                <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                  ${SPACE_TOKENS[step]?.$description || ''} (${SPACE_TOKENS[step]?.$value || ''})
                </span>
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
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
