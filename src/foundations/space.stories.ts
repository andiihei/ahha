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
  argTypes: {
    // Padding controls
    enablePadding: {
      name: 'Enable Padding',
      control: { type: 'boolean' },
      defaultValue: true,
      description: 'Apply spacing as inner container padding',
    },
    paddingSpace: {
      name: 'Padding Token',
      control: { type: 'select' },
      options: [
        '--space-25',
        '--space-50',
        '--space-60',
        '--space-75',
        '--space-100',
        '--space-125',
        '--space-150',
        '--space-200',
        '--space-250',
        '--space-300',
      ],
      defaultValue: '--space-100',
      description: 'Spacing token applied to container padding',
    },
    // Margin controls
    enableMargin: {
      name: 'Enable Margin',
      control: { type: 'boolean' },
      defaultValue: false,
      description: 'Apply spacing as outer margin around the container',
    },
    marginSpace: {
      name: 'Margin Token',
      control: { type: 'select' },
      options: [
        '--space-25',
        '--space-50',
        '--space-60',
        '--space-75',
        '--space-100',
        '--space-125',
        '--space-150',
        '--space-200',
        '--space-250',
        '--space-300',
      ],
      defaultValue: '--space-150',
      description: 'Spacing token applied to container margin',
    },
    // Gap controls
    enableGap: {
      name: 'Enable Gap',
      control: { type: 'boolean' },
      defaultValue: true,
      description: 'Apply spacing as flex gap between items',
    },
    gapSpace: {
      name: 'Gap Token',
      control: { type: 'select' },
      options: [
        '--space-25',
        '--space-50',
        '--space-60',
        '--space-75',
        '--space-100',
        '--space-125',
        '--space-150',
        '--space-200',
        '--space-250',
        '--space-300',
      ],
      defaultValue: '--space-50',
      description: 'Spacing token applied to flex gap between items',
    },
    itemType: {
      name: 'Item Element Type',
      control: { type: 'select' },
      options: ['shapes', 'icons', 'text', 'badges'],
      defaultValue: 'shapes',
      description: 'Type of elements rendered inside the gap preview',
    },
  },
  args: {
    enablePadding: true,
    paddingSpace: '--space-100',
    enableMargin: false,
    marginSpace: '--space-150',
    enableGap: true,
    gapSpace: '--space-50',
    itemType: 'shapes',
  },
  render: (args) => {
    const padToken = args.paddingSpace || '--space-100';
    const marToken = args.marginSpace || '--space-150';
    const gapToken = args.gapSpace || '--space-50';

    const paddingStyle = args.enablePadding ? `var(${padToken})` : '0px';
    const marginStyle = args.enableMargin ? `var(${marToken})` : '0px';
    const gapStyle = args.enableGap ? `var(${gapToken})` : '0px';

    const items = [1, 2, 3, 4, 5];

    const renderItemContent = (idx: number) => {
      switch (args.itemType) {
        case 'icons':
          return html`
            <div
              style="
                width: 48px;
                height: 48px;
                background: var(--surface-bg-1);
                border: 1px solid var(--surface-border);
                border-radius: var(--radius-100);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--action-fg-1);
                font-family: var(--font-mono);
                font-size: var(--step-80);
                flex: none;
              "
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${idx === 1 ? html`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>` : ''}
                ${idx === 2 ? html`<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline>` : ''}
                ${idx === 3 ? html`<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>` : ''}
                ${idx === 4 ? html`<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>` : ''}
                ${idx === 5 ? html`<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>` : ''}
              </svg>
            </div>
          `;
        case 'text':
          return html`
            <div
              style="
                padding: 0.5rem 0.85rem;
                background: var(--surface-bg-1);
                border: 1px solid var(--surface-border);
                border-radius: var(--radius-100);
                font-family: var(--font-main);
                font-size: var(--step-75);
                color: var(--text-fg-1);
                white-space: nowrap;
              "
            >
              Paragraph Item #${idx}
            </div>
          `;
        case 'badges':
          return html`
            <div
              style="
                padding: 0.25rem 0.75rem;
                background: var(--action-bg-1);
                color: var(--action-fg-1);
                border-radius: var(--radius-full);
                font-family: var(--font-mono);
                font-size: var(--step-70);
                font-weight: 600;
                white-space: nowrap;
              "
            >
              Tag ${idx}
            </div>
          `;
        case 'shapes':
        default:
          return html`
            <div
              style="
                width: 52px;
                height: 52px;
                background: var(--action-bg-1);
                border: 1px solid var(--action-border);
                border-radius: ${idx % 2 === 0 ? 'var(--radius-100)' : 'var(--radius-full)'};
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--action-fg-1);
                font-family: var(--font-mono);
                font-size: var(--step-75);
                font-weight: 700;
                flex: none;
              "
            >
              #${idx}
            </div>
          `;
      }
    };

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 820px; width: 100%;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Interactive Spacing Dynamics (Padding, Margin & Gaps)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Customize independent spacing tokens for <strong>margin</strong>, <strong>padding</strong>, and <strong>flex gap</strong>. Toggle controls in the Storybook panel to test spatial combinations across 5 dynamic items.
          </p>

          <div
            style="
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem 1rem;
              font-family: var(--font-mono);
              font-size: var(--step-75);
              padding: 0.75rem 1.25rem;
              background: var(--surface-bg-1);
              border: 1px solid var(--surface-border);
              border-radius: var(--radius-100);
            "
          >
            <span>
              Padding:
              <strong style="color: ${args.enablePadding ? 'var(--green-700, green)' : 'var(--text-fg-2)'};">
                ${args.enablePadding ? `ON (${padToken})` : 'OFF'}
              </strong>
            </span>
            <span>·</span>
            <span>
              Margin:
              <strong style="color: ${args.enableMargin ? 'var(--green-700, green)' : 'var(--text-fg-2)'};">
                ${args.enableMargin ? `ON (${marToken})` : 'OFF'}
              </strong>
            </span>
            <span>·</span>
            <span>
              Gap:
              <strong style="color: ${args.enableGap ? 'var(--green-700, green)' : 'var(--text-fg-2)'};">
                ${args.enableGap ? `ON (${gapToken})` : 'OFF'}
              </strong>
            </span>
            <span>·</span>
            <span>Items: <strong>5 (${args.itemType})</strong></span>
          </div>
        </div>

        <!-- Outer Boundary Area to visualize Margins -->
        <div
          style="
            background: color-mix(in oklch, var(--yellow-500, orange) 10%, transparent);
            border: 1px dashed var(--yellow-700, orange);
            border-radius: var(--radius-250);
            position: relative;
            box-sizing: border-box;
          "
        >
          <div
            style="
              position: absolute;
              top: 0.25rem;
              left: 0.5rem;
              font-family: var(--font-mono);
              font-size: var(--step-60);
              color: var(--yellow-700, orange);
            "
          >
            ${args.enableMargin ? `Outer Margin Zone: var(${marToken})` : 'Outer Margin: 0px (disabled)'}
          </div>

          <!-- Main Container applying Margin and Padding -->
          <div
            style="
              margin: ${marginStyle};
              padding: ${paddingStyle};
              background: color-mix(in oklch, var(--action-bg-1) 12%, transparent);
              border: 1.5px solid var(--action-border);
              border-radius: var(--radius-150);
              box-sizing: border-box;
              transition: all var(--duration-200) var(--ease-out);
            "
          >
            <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--action-fg-1); margin-bottom: 0.5rem;">
              ${args.enablePadding ? `Inner Padding Zone: var(${padToken})` : 'Inner Padding: 0px (disabled)'}
            </div>

            <!-- Content Flex Row with Gap and 5 Items -->
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: ${gapStyle};
                background: var(--surface-bg);
                border: 1px solid var(--surface-border);
                border-radius: var(--radius-100);
                padding: 1rem;
                transition: gap var(--duration-200) var(--ease-out);
              "
            >
              ${items.map((idx) => renderItemContent(idx))}
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

