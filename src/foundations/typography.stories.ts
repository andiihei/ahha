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
    containerWidth: {
      name: 'Container / Viewport Width',
      control: { type: 'range', min: 380, max: 1440, step: 20 },
      defaultValue: 1000,
      description: 'Simulate responsive container width to observe fluid typography breathing (min supported: 380px)',
    },
  },
  args: {
    containerWidth: 1000,
  },
};

export default meta;
type Story = StoryObj;

export const FluidTypeRamp: Story = {
  argTypes: {
    containerWidth: {
      name: 'Container / Viewport Width',
      control: { type: 'range', min: 380, max: 1440, step: 20 },
      defaultValue: 1000,
      description: 'Simulate responsive container width to observe fluid typography breathing (min supported: 380px)',
    },
  },
  args: {
    containerWidth: 1000,
  },
  render: (args) => {
    const rootPx = 16;
    const progress = Math.min(Math.max(((args.containerWidth || 1000) - 380) / (1240 - 380), 0), 1);

    // Exact steps from global/typography.css: min at 380px (18px base @ 1.125), max at 1240px (20px base @ 1.2)
    const typeSteps = [
      { name: 'step-350', step: 8, label: 'Monumental banner headline' },
      { name: 'step-300', step: 7, label: 'Super-display hero' },
      { name: 'step-250', step: 6, label: 'Display hero headline' },
      { name: 'step-200', step: 5, label: 'H1 page title' },
      { name: 'step-180', step: 4, label: 'H2 major section heading' },
      { name: 'step-160', step: 3, label: 'H3 subsection header' },
      { name: 'step-140', step: 2, label: 'H4 section title' },
      { name: 'step-120', step: 1, label: 'Lead paragraph / subtitle' },
      { name: 'step-100', step: 0, label: 'Base paragraph body text' },
      { name: 'step-80', step: -1, label: 'Secondary text / helper text' },
      { name: 'step-70', step: -2, label: 'Micro action / caption' },
      { name: 'step-60', step: -3, label: 'Sub-detail / micro legal copy' },
    ];

    const minBase = 18.0;
    const maxBase = 20.0;
    const minRatio = 1.125;
    const maxRatio = 1.2;

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Fluid Type Ramp (Steps 60..350)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Twelve fluid steps scaling continuously between 380px and 1240px from <code>global/typography.css</code>. Drag the container slider in Controls to watch type sizes interpolate live.
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
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${typeSteps.map((s) => {
              const yMin = minBase * Math.pow(minRatio, s.step);
              const yMax = maxBase * Math.pow(maxRatio, s.step);
              const currentPx = (yMin + progress * (yMax - yMin)).toFixed(1);
              const currentRem = (parseFloat(currentPx) / rootPx).toFixed(4);

              return html`
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--surface-border);
                  "
                >
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;">
                    <div style="display: flex; align-items: center; gap: 0.6rem;">
                      <span style="font-family: var(--font-mono); font-weight: 600; font-size: var(--step-75); color: var(--text-fg-1);">
                        --${s.name}
                      </span>
                      <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                        ${currentRem}rem · ${currentPx}px (${yMin.toFixed(1)}px → ${yMax.toFixed(1)}px)
                      </span>
                    </div>
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                      ${s.label}
                    </span>
                  </div>
                  <div
                    style="
                      font-size: ${currentPx}px;
                      font-family: var(--font-main);
                      font-weight: 500;
                      line-height: 1.2;
                      transition: font-size var(--duration-100) var(--ease-out);
                    "
                  >
                    Design Systems & Fluid Typography
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

export const Headings: Story = {
  render: (args) => {
    const progress = Math.min(Math.max(((args.containerWidth || 1000) - 380) / (1240 - 380), 0), 1);

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Heading Roles (Display Voice)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Display family (<code>--font-alt</code>, Fraunces), Tight tracking (<code>--tracking-tight</code>), with optical sizing and calibrated weights. Drag the container width slider in Controls to watch headings scale.
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
          <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .heading-400 &middot; --step-350 &middot; Bold 700 &middot; Leading None
                </span>
              </div>
              <h1 class="heading-400" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Autonomous Architecture
              </h1>
            </div>

            <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .heading-300 &middot; --step-250 &middot; Bold 700 &middot; Leading None
                </span>
              </div>
              <h2 class="heading-300" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Adaptive Token Primitives
              </h2>
            </div>

            <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .heading-200 &middot; --step-160 &middot; Regular 400 &middot; Leading Compact
                </span>
              </div>
              <h3 class="heading-200" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Unified Fluid Progression Curve
              </h3>
            </div>

            <div style="padding-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .heading-150 &middot; --step-120 &middot; SemiBold 600 &middot; Leading Compact
                </span>
              </div>
              <h4 class="heading-150" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Card & Section Subsection Header
              </h4>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

export const Paragraphs: Story = {
  render: (args) => {
    const progress = Math.min(Math.max(((args.containerWidth || 1000) - 380) / (1240 - 380), 0), 1);

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Paragraph Roles (Prose & Body)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Lead paragraphs (P200, P150) employ the expressive display voice (<code>--font-alt</code>); standard narrative body text (P110, P100) employs the workhorse interface voice (<code>--font-main</code>). Drag the slider to observe fluid resizing.
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
          <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .paragraph-200 &middot; --font-alt &middot; --step-160 &middot; Bold 700 &middot; Leading Compact
                </span>
              </div>
              <p class="paragraph-200" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Lead editorial callout: A design system is not a project; it is an organic, self-calibrating infrastructure that establishes shared understanding.
              </p>
            </div>

            <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .paragraph-150 &middot; --font-alt &middot; --step-120 &middot; Regular 400 &middot; Leading Compact
                </span>
              </div>
              <p class="paragraph-150" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Sub-lead introduction: Typography bridges cold technical data and human expression, anchoring the brand voice across viewport widths from 380px to 1240px.
              </p>
            </div>

            <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .paragraph-110 &middot; --font-main &middot; --step-100 &middot; Regular 400 &middot; Leading Relaxed
                </span>
              </div>
              <p class="paragraph-110" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Standard longform body: Generous leading provides effortless reading across articles, technical documentation, and complex multi-column layouts without optical fatigue.
              </p>
            </div>

            <div style="padding-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                  .paragraph-100 &middot; --font-main &middot; --step-80 &middot; Regular 400 &middot; Leading Compact
                </span>
              </div>
              <p class="paragraph-100" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                Compact UI body: Optimized for dense dashboards, table cells, modal dialog descriptions, and secondary card content.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

export const Actions: Story = {
  render: (args) => {
    const progress = Math.min(Math.max(((args.containerWidth || 1000) - 380) / (1240 - 380), 0), 1);

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Action Roles (Interactive & Control Typography)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Interface family (<code>--font-main</code>), Bold weight (700), Compact leading (1.25). Used for buttons, menu triggers, and interactive controls.
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
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <div>
                <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2); margin-bottom: 0.25rem;">
                  .action-110 &middot; --step-100 &middot; Bold 700
                </div>
                <span class="action-110" style="transition: font-size var(--duration-100) var(--ease-out);">Primary Call to Action</span>
              </div>
              <button class="action-110" style="padding: 0.75rem 1.5rem; background: var(--action-bg-1); color: var(--action-fg-1); border: 1px solid var(--action-border); border-radius: var(--radius-100); cursor: pointer; transition: font-size var(--duration-100) var(--ease-out);">
                Explore Catalog
              </button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <div>
                <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2); margin-bottom: 0.25rem;">
                  .action-100 &middot; --step-80 &middot; Bold 700
                </div>
                <span class="action-100" style="transition: font-size var(--duration-100) var(--ease-out);">Standard Button Action</span>
              </div>
              <button class="action-100" style="padding: 0.5rem 1.25rem; background: var(--action-bg-1); color: var(--action-fg-1); border: 1px solid var(--action-border); border-radius: var(--radius-100); cursor: pointer; transition: font-size var(--duration-100) var(--ease-out);">
                Confirm Selection
              </button>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <div>
                <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2); margin-bottom: 0.25rem;">
                  .action-75 &middot; --step-60 &middot; Bold 700
                </div>
                <span class="action-75" style="transition: font-size var(--duration-100) var(--ease-out);">Micro Action Label</span>
              </div>
              <button class="action-75" style="padding: 0.35rem 0.85rem; background: var(--surface-bg); color: var(--text-fg-1); border: 1px solid var(--surface-border); border-radius: var(--radius-100); cursor: pointer; transition: font-size var(--duration-100) var(--ease-out);">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

export const Details: Story = {
  render: (args) => {
    const progress = Math.min(Math.max(((args.containerWidth || 1000) - 380) / (1240 - 380), 0), 1);

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Detail Roles (Labels, Captions & Data)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Interface family (<code>--font-main</code>), SemiBold weight (600), Compact leading (1.25). Used for form labels, badges, captions, and micro status indicators. Drag the slider to observe fluid scaling.
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
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 0.4rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                .detail-100 &middot; --step-80 &middot; SemiBold 600
              </div>
              <label class="detail-100" style="color: var(--text-fg-1); transition: font-size var(--duration-100) var(--ease-out);">
                Account Identification & Organization Name
              </label>
              <span style="font-size: var(--step-75); color: var(--text-fg-2);">Primary input field label</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.4rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                .detail-90 &middot; --step-70 &middot; SemiBold 600
              </div>
              <span class="detail-90" style="color: var(--text-fg-1); transition: font-size var(--duration-100) var(--ease-out);">
                Active Deployment &middot; Production Cluster (EU-Central-1)
              </span>
              <span style="font-size: var(--step-70); color: var(--text-fg-2);">Secondary status readout</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.4rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <div style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                .detail-75 &middot; --step-60 &middot; SemiBold 600
              </div>
              <span class="detail-75" style="color: var(--text-fg-2); text-transform: uppercase; letter-spacing: 0.05em; transition: font-size var(--duration-100) var(--ease-out);">
                CONFIDENTIAL &middot; INTERNAL COMPLIANCE PROTOCOL
              </span>
              <span style="font-size: var(--step-60); color: var(--text-fg-2);">Micro legal watermark / badge</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

export const FontStacks: Story = {
  render: (args) => {
    const progress = Math.min(Math.max(((args.containerWidth || 1000) - 380) / (1240 - 380), 0), 1);

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Font Stacks & Brand Packs
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Three brand-pack family tokens decouple font selection from component classes and utility roles. Drag the container width slider in Controls to preview responsive typography.
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
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="padding: 1.5rem; border-radius: var(--radius-150); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">--font-main</span>
              <h4 style="font-family: var(--font-main); font-size: var(--step-140); margin: 0.5rem 0; transition: font-size var(--duration-100) var(--ease-out);">IBM Plex Sans</h4>
              <p style="font-family: var(--font-main); font-size: var(--step-90); color: var(--text-fg-2); margin: 0; line-height: 1.5; transition: font-size var(--duration-100) var(--ease-out);">
                The primary interface and structural workhorse. Engineered for maximum legibility at compact body sizes, form inputs, and system navigation.
              </p>
            </div>

            <div style="padding: 1.5rem; border-radius: var(--radius-150); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">--font-alt</span>
              <h4 style="font-family: var(--font-alt); font-size: var(--step-175); margin: 0.5rem 0; transition: font-size var(--duration-100) var(--ease-out);">Fraunces (Variable Display)</h4>
              <p style="font-family: var(--font-alt); font-size: var(--step-100); color: var(--text-fg-2); margin: 0; line-height: 1.5; transition: font-size var(--duration-100) var(--ease-out);">
                The expressive editorial voice. Features variable optical sizing, softness, and wonk axes, delivering a warm human touch to section headlines and brand logotypes.
              </p>
            </div>

            <div style="padding: 1.5rem; border-radius: var(--radius-150); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
              <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">--font-mono</span>
              <h4 style="font-family: var(--font-mono); font-size: var(--step-125); margin: 0.5rem 0; transition: font-size var(--duration-100) var(--ease-out);">IBM Plex Mono</h4>
              <p style="font-family: var(--font-mono); font-size: var(--step-80); color: var(--text-fg-2); margin: 0; line-height: 1.5; transition: font-size var(--duration-100) var(--ease-out);">
                The precision data layer. Used for token values, code blocks, inspection readouts, geometry coordinates, and financial metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};
