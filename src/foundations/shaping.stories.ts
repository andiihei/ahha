import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { SHAPING_TOKENS } from './tokens.js';
import '../components/concentric-demo.js';

const meta: Meta = {
  title: 'Foundations/Shaping',
  parameters: {
    docs: {
      description: {
        component: `
# Shaping & Radii (Layer 1 Foundations)
The AHHA shaping engine governs component silhouettes through three pillars:
1. **Concentric Radii Scale (\`--radius-0\` to \`--radius-300\`, \`--radius-full\`)**: Unified percentage convention (0.5rem / 8px base 100).
2. **The Concentric Law**: Corners are concentric when their arcs share a center point ($R_{inner} = R_{outer} - \\text{gap}$). Handled automatically via \`.u-concentric\`.
3. **Border Widths & Elevation**: Standard stroke widths (1px..4px) and 4-tier natural layered OKLCH elevation shadows.
        `,
      },
    },
  },
  argTypes: {
    governingRadius: {
      name: 'Governing Radius',
      control: { type: 'select' },
      options: ['--radius-150', '--radius-250', '--radius-300'],
      defaultValue: '--radius-300',
      description: 'The outermost governing corner radius for the concentric demo',
    },
    gapToken: {
      name: 'Layer Gap / Inset',
      control: { type: 'select' },
      options: ['--space-50', '--space-100', '--space-200'],
      defaultValue: '--space-100',
      description: 'Spacing between concentric layers',
    },
  },
};

export default meta;
type Story = StoryObj;

export const ConcentricRadiiDemo: Story = {
  args: {
    governingRadius: '--radius-300',
    gapToken: '--space-100',
  },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 800px;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Interactive Concentric Border Radii Specimen
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 0.5rem 0;">
          Three nested layers — Panel, Card, Chip. When concentric switches are ON, inner radii derive via <code>outer radius &minus; gap</code>, guaranteeing shared arc centres. When switched OFF, elements lock to fixed radii.
        </p>
      </div>

      <ads-concentric-demo
        .governingRadius="${args.governingRadius}"
        .gapToken="${args.gapToken}"
      ></ads-concentric-demo>
    </div>
  `,
};

export const RadiiScaleLadder: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 800px;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Corner Radii Scale (8px Base 100)
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Unified rem percentage convention for corner curvature.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem;">
        ${[
          'radius-0',
          'radius-25',
          'radius-50',
          'radius-100',
          'radius-150',
          'radius-250',
          'radius-300',
          'radius-full',
        ].map(
          (rad) => html`
            <div
              style="
                padding: 1.25rem;
                background: var(--surface-bg-1);
                border: 1px solid var(--surface-border);
                border-radius: var(--radius-100);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
              "
            >
              <div
                style="
                  width: 64px;
                  height: 64px;
                  background: var(--action-bg-1);
                  border-radius: var(--${rad});
                  border: 1px solid var(--action-border);
                  transition: border-radius var(--duration-100) var(--ease-out);
                "
              ></div>
              <div style="font-family: var(--font-mono); font-size: var(--step-75); font-weight: 600;">
                --${rad}
              </div>
              <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2); text-align: center;">
                ${SHAPING_TOKENS[rad]?.$value || ''}
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

export const NaturalElevations: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 800px;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Natural Layered OKLCH Elevations
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          Multi-stop shadow spreads using Midnight chromatic tinting for realistic depth.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1.5rem;">
        ${[
          { id: 'elevation-low', name: 'Low', desc: 'Resting cards' },
          { id: 'elevation-medium', name: 'Medium', desc: 'Dropdowns & popovers' },
          { id: 'elevation-high', name: 'High', desc: 'Dialogs & modals' },
          { id: 'elevation-very-high', name: 'Very High', desc: 'Alert banners & full modals' },
        ].map(
          (elev) => html`
            <div
              style="
                padding: 1.5rem;
                border-radius: var(--radius-150);
                background: var(--surface-bg-1);
                border: 1px solid var(--surface-border);
                box-shadow: var(--${elev.id});
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
              "
            >
              <div style="font-family: var(--font-alt); font-size: var(--step-110); font-weight: 600;">
                ${elev.name}
              </div>
              <div style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-1);">
                --${elev.id}
              </div>
              <div style="font-size: var(--step-75); color: var(--text-fg-2);">
                ${elev.desc}
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};
