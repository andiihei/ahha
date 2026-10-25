import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { TYPOGRAPHY_TOKENS } from './tokens.js';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: {
    docs: {
      description: {
        component: `
# Typography (Layer 1 Foundations)
The AHHA typography engine marries two systems:
1. **Brand Font Stacks**: Primary workhorse \`IBM Plex Sans\` (\`--font-main\`), editorial display \`Fraunces\` (\`--font-alt\`), and code/data \`IBM Plex Mono\` (\`--font-mono\`).
2. **Utopia Fluid Interpolation Ladder**: Steps scale continuously from 360px viewport @ 18px base up to 1240px viewport @ 20px base using modern CSS \`progress()\` and fallback \`clamp()\`.
3. **Semantic Roles**: \`.heading-*\`, \`.paragraph-*\`, \`.action-*\`, \`.detail-*\`.
        `,
      },
    },
  },
  argTypes: {
    previewText: {
      name: 'Sample Preview Text',
      control: { type: 'text' },
      defaultValue: 'The quick brown fox jumps over the lazy dog',
      description: 'Editable preview text',
    },
    sampleStep: {
      name: 'Selected Fluid Step',
      control: {
        type: 'select',
      },
      options: [
        '--step-60',
        '--step-75',
        '--step-80',
        '--step-90',
        '--step-100',
        '--step-110',
        '--step-125',
        '--step-140',
        '--step-150',
        '--step-175',
        '--step-200',
        '--step-250',
        '--step-300',
        '--step-350',
      ],
      defaultValue: '--step-150',
      description: 'Select step token to preview live',
    },
  },
};

export default meta;
type Story = StoryObj;

export const FluidScaleLadder: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 900px;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Utopia Fluid Scale Ladder (Steps 60..350)
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Resize your browser window to observe continuous fluid typography breathing between 360px and 1240px.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        ${[
          'step-350',
          'step-300',
          'step-250',
          'step-200',
          'step-175',
          'step-150',
          'step-140',
          'step-125',
          'step-110',
          'step-100',
          'step-90',
          'step-80',
          'step-75',
          'step-60',
        ].map(
          (step) => html`
            <div
              style="
                display: flex;
                flex-direction: column;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--surface-border);
              "
            >
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  --${step}
                </span>
                <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                  ${TYPOGRAPHY_TOKENS[step]?.$description || ''}
                </span>
              </div>
              <div style="font-size: var(--${step}); font-family: var(--font-main); font-weight: 500; line-height: 1.2;">
                Design Systems & Fluid Typography
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

export const BrandFontStacks: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 800px;">
      <div style="padding: 1.5rem; border-radius: var(--radius-150); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
        <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">--font-main</span>
        <h4 style="font-family: var(--font-main); font-size: var(--step-140); margin: 0.5rem 0;">IBM Plex Sans</h4>
        <p style="font-family: var(--font-main); font-size: var(--step-90); color: var(--text-fg-2); margin: 0; line-height: 1.5;">
          The primary interface and structural workhorse. Engineered for maximum legibility at compact body sizes, form inputs, and system navigation.
        </p>
      </div>

      <div style="padding: 1.5rem; border-radius: var(--radius-150); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
        <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">--font-alt</span>
        <h4 style="font-family: var(--font-alt); font-size: var(--step-175); margin: 0.5rem 0;">Fraunces (Variable Display)</h4>
        <p style="font-family: var(--font-alt); font-size: var(--step-100); color: var(--text-fg-2); margin: 0; line-height: 1.5;">
          The expressive editorial voice. Features variable optical sizing, softness, and wonk axes, delivering a warm human touch to section headlines and brand logotypes.
        </p>
      </div>

      <div style="padding: 1.5rem; border-radius: var(--radius-150); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
        <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">--font-mono</span>
        <h4 style="font-family: var(--font-mono); font-size: var(--step-125); margin: 0.5rem 0;">IBM Plex Mono</h4>
        <p style="font-family: var(--font-mono); font-size: var(--step-80); color: var(--text-fg-2); margin: 0; line-height: 1.5;">
          The precision data layer. Used for token values, code blocks, inspection readouts, geometry coordinates, and financial metrics.
        </p>
      </div>
    </div>
  `,
};

export const LiveTypographyTester: Story = {
  args: {
    previewText: 'Design is intelligence made visible.',
    sampleStep: '--step-150',
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 700px; width: 100%;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Interactive Typography Tester
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Change the sample text and fluid step in Storybook <strong>Controls</strong> below.
        </p>
      </div>

      <div
        style="
          padding: 2rem;
          border-radius: var(--radius-150);
          border: 1px solid var(--surface-border);
          background: var(--surface-bg-1);
          box-shadow: var(--elevation-low);
        "
      >
        <div style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2); margin-bottom: 0.75rem;">
          Applied Token: <strong>${args.sampleStep}</strong>
        </div>
        <div
          style="
            font-size: var(${args.sampleStep});
            font-family: var(--font-main);
            color: var(--text-fg-1);
            line-height: 1.25;
            word-break: break-word;
          "
        >
          ${args.previewText}
        </div>
      </div>
    </div>
  `,
};
