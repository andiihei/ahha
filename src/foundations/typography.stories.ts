import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { TYPOGRAPHY_TOKENS } from './tokens.js';

// Configuration constants from global/typography.css
const ROOT_PX = 16;
const MIN_VIEWPORT = 380;
const MAX_VIEWPORT = 1240;
const MIN_BASE = 18.0; // 1.125rem at 380px
const MAX_BASE = 20.0; // 1.25rem at 1240px
const MIN_RATIO = 1.125;
const MAX_RATIO = 1.2;

export interface TypeStepInfo {
  name: string;
  step: number;
  label: string;
  minPx: number;
  maxPx: number;
  currentPx: number;
  currentRem: number;
}

/**
 * Calculates all 12 fluid steps at a specific simulated viewport width
 * and returns the CSS variable overrides to scope on the container.
 */
function getFluidTypeState(width: number) {
  const clampedWidth = Math.max(MIN_VIEWPORT, Math.min(width, MAX_VIEWPORT));
  const progress = (clampedWidth - MIN_VIEWPORT) / (MAX_VIEWPORT - MIN_VIEWPORT);

  const stepsConfig = [
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

  const stepsMap: Record<string, TypeStepInfo> = {};
  const cssOverrides: string[] = [`--_progress: ${progress.toFixed(6)};`];

  stepsConfig.forEach((s) => {
    const minPx = MIN_BASE * Math.pow(MIN_RATIO, s.step);
    const maxPx = MAX_BASE * Math.pow(MAX_RATIO, s.step);
    const currentPx = minPx + progress * (maxPx - minPx);
    const currentRem = currentPx / ROOT_PX;

    stepsMap[s.name] = {
      name: s.name,
      step: s.step,
      label: s.label,
      minPx,
      maxPx,
      currentPx,
      currentRem,
    };

    cssOverrides.push(`--${s.name}: ${currentRem.toFixed(4)}rem;`);
  });

  return {
    progress,
    stepsMap,
    stepsList: stepsConfig.map((s) => stepsMap[s.name]),
    cssVariablesStyle: cssOverrides.join(' '),
  };
}

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: {
    docs: {
      description: {
        component: `
# Typography (Layer 1 Foundations)
The AHHA typography engine marries two systems:
1. **Brand Font Stacks**: Primary workhorse \`IBM Plex Sans\` (\`--font-main\`), editorial display \`Fraunces\` (\`--font-alt\`), and code/data \`IBM Plex Mono\` (\`--font-mono\`).
2. **Utopia Fluid Interpolation Ladder**: Steps scale continuously from 380px viewport @ 18px base up to 1240px viewport @ 20px base using modern CSS \`progress()\` and fallback \`clamp()\`.
3. **Semantic Roles**: \`.heading-*\`, \`.paragraph-*\`, \`.action-*\`, \`.detail-*\`.
4. **Utility Classes**: Font family overrides (\`.u-font-*\`), weights (\`.u-text-regular\`..\`.u-text-bold\`), leading (\`.u-leading-*\`), and case/tracking (\`.u-text-caps\`).
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
    familyOverride: {
      name: 'Font Family Override',
      control: { type: 'select' },
      options: ['none', 'u-font-main', 'u-font-alt', 'u-font-mono'],
      defaultValue: 'none',
      description: 'Utility: override typeface via .u-font-main, .u-font-alt, or .u-font-mono',
    },
    weightOverride: {
      name: 'Font Weight Utility',
      control: { type: 'select' },
      options: ['none', 'u-text-regular', 'u-text-medium', 'u-text-semibold', 'u-text-bold'],
      defaultValue: 'none',
      description: 'Utility: apply weight modifier (.u-text-regular=400, medium=500, semibold=600, bold=700)',
    },
    leadingOverride: {
      name: 'Leading / Line-Height Utility',
      control: { type: 'select' },
      options: ['none', 'u-leading-none', 'u-leading-compact', 'u-leading-relaxed'],
      defaultValue: 'none',
      description: 'Utility: line-height override (.u-leading-none=1, compact=1.25, relaxed=1.5)',
    },
    trackingOverride: {
      name: 'Tracking / Letter-Spacing Utility',
      control: { type: 'select' },
      options: ['none', 'u-tracking-tight', 'u-tracking-none', 'u-tracking-loose', 'u-tracking-extra-loose'],
      defaultValue: 'none',
      description: 'Utility: letter-spacing override (.u-tracking-tight=-0.03em, none=0em, loose=0.05em, extra-loose=0.1em)',
    },
    textCaps: {
      name: 'Caps & Tracking Utility',
      control: { type: 'boolean' },
      defaultValue: false,
      description: 'Utility: apply .u-text-caps (uppercase + loose tracking)',
    },
  },
  args: {
    containerWidth: 1000,
    familyOverride: 'none',
    weightOverride: 'none',
    leadingOverride: 'none',
    trackingOverride: 'none',
    textCaps: false,
  },
};

export default meta;
type Story = StoryObj;

function getAppliedUtilities(args: any) {
  const classes: string[] = [];
  if (args.familyOverride && args.familyOverride !== 'none') classes.push(args.familyOverride);
  if (args.weightOverride && args.weightOverride !== 'none') classes.push(args.weightOverride);
  if (args.leadingOverride && args.leadingOverride !== 'none') classes.push(args.leadingOverride);
  if (args.trackingOverride && args.trackingOverride !== 'none') classes.push(args.trackingOverride);
  if (args.textCaps) classes.push('u-text-caps');
  return classes.join(' ');
}

export const FluidTypeRamp: Story = {
  render: (args) => {
    const width = args.containerWidth || 1000;
    const { progress, stepsList, cssVariablesStyle } = getFluidTypeState(width);
    const utilityClasses = getAppliedUtilities(args);

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 960px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Fluid Type Ramp (Steps 60..350)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Twelve fluid steps scaling continuously between 380px and 1240px from <code>global/typography.css</code>. Drag the Container Width slider in Controls to watch the raw rem and px values recompute in real-time.
          </p>

          <div
            style="
              display: inline-flex;
              align-items: center;
              flex-wrap: wrap;
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
            <span>Simulated Viewport: <strong>${width}px</strong></span>
            <span>·</span>
            <span>Progress: <strong>${Math.round(progress * 100)}%</strong></span>
            ${utilityClasses ? html`<span>·</span><span style="color: var(--color-purple-700);">Active Utilities: <code>${utilityClasses}</code></span>` : ''}
          </div>
        </div>

        <div
          style="
            width: 100%;
            max-width: ${width}px;
            background: var(--surface-bg);
            border: 1px dashed var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            box-sizing: border-box;
            transition: max-width var(--duration-100) var(--ease-out);
            ${cssVariablesStyle}
          "
        >
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${stepsList.map((s) => {
              const currentPx = s.currentPx.toFixed(1);
              const currentRem = s.currentRem.toFixed(4);

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
                    <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                      <span style="font-family: var(--font-mono); font-weight: 600; font-size: var(--step-75); color: var(--text-fg-1);">
                        --${s.name}
                      </span>
                      <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                        now <strong>${currentRem}rem</strong> · <strong>${currentPx}px</strong> (${s.minPx.toFixed(1)}px → ${s.maxPx.toFixed(1)}px)
                      </span>
                    </div>
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                      ${s.label}
                    </span>
                  </div>
                  <div
                    class="${utilityClasses}"
                    style="
                      font-size: var(--${s.name});
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
    const width = args.containerWidth || 1000;
    const { progress, stepsMap, cssVariablesStyle } = getFluidTypeState(width);
    const utilityClasses = getAppliedUtilities(args);

    const headings = [
      {
        role: 'heading-400',
        stepToken: 'step-350',
        font: '--font-alt',
        weight: 'Bold 700',
        leading: 'Leading None (1.0)',
        specimen: 'Autonomous Architecture',
        tag: 'h1',
      },
      {
        role: 'heading-300',
        stepToken: 'step-250',
        font: '--font-alt',
        weight: 'Bold 700',
        leading: 'Leading None (1.0)',
        specimen: 'Adaptive Token Primitives',
        tag: 'h2',
      },
      {
        role: 'heading-200',
        stepToken: 'step-160',
        font: '--font-alt',
        weight: 'Regular 400',
        leading: 'Leading Compact (1.25)',
        specimen: 'Unified Fluid Progression Curve',
        tag: 'h3',
      },
      {
        role: 'heading-150',
        stepToken: 'step-120',
        font: '--font-alt',
        weight: 'SemiBold 600',
        leading: 'Leading Compact (1.25)',
        specimen: 'Card & Section Subsection Header',
        tag: 'h4',
      },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 960px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Heading Roles (Display Voice)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Display family (<code>--font-alt</code>, Fraunces), Tight tracking (<code>--tracking-tight</code>), with optical sizing and calibrated weights. Drag the Container Width slider in Controls to watch headings scale dynamically with live rem/px readouts.
          </p>

          <div
            style="
              display: inline-flex;
              align-items: center;
              flex-wrap: wrap;
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
            <span>Simulated Viewport: <strong>${width}px</strong></span>
            <span>·</span>
            <span>Progress: <strong>${Math.round(progress * 100)}%</strong></span>
            ${utilityClasses ? html`<span>·</span><span style="color: var(--color-purple-700);">Active Utilities: <code>${utilityClasses}</code></span>` : ''}
          </div>
        </div>

        <div
          style="
            width: 100%;
            max-width: ${width}px;
            background: var(--surface-bg);
            border: 1px dashed var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            box-sizing: border-box;
            transition: max-width var(--duration-100) var(--ease-out);
            ${cssVariablesStyle}
          "
        >
          <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            ${headings.map((h) => {
              const info = stepsMap[h.stepToken];
              const curPx = info.currentPx.toFixed(1);
              const curRem = info.currentRem.toFixed(4);

              return html`
                <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                      .${h.role} &middot; --${h.stepToken} &middot; ${h.weight} &middot; ${h.leading}
                    </span>
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--color-purple-700); font-weight: 600;">
                      now ${curRem}rem · ${curPx}px (${info.minPx.toFixed(1)}px → ${info.maxPx.toFixed(1)}px)
                    </span>
                  </div>
                  ${h.tag === 'h1' ? html`<h1 class="${h.role} ${utilityClasses}" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">${h.specimen}</h1>` : ''}
                  ${h.tag === 'h2' ? html`<h2 class="${h.role} ${utilityClasses}" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">${h.specimen}</h2>` : ''}
                  ${h.tag === 'h3' ? html`<h3 class="${h.role} ${utilityClasses}" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">${h.specimen}</h3>` : ''}
                  ${h.tag === 'h4' ? html`<h4 class="${h.role} ${utilityClasses}" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">${h.specimen}</h4>` : ''}
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};

export const Paragraphs: Story = {
  render: (args) => {
    const width = args.containerWidth || 1000;
    const { progress, stepsMap, cssVariablesStyle } = getFluidTypeState(width);
    const utilityClasses = getAppliedUtilities(args);

    const paragraphs = [
      {
        role: 'paragraph-200',
        stepToken: 'step-160',
        font: '--font-alt',
        meta: '.paragraph-200 · --font-alt · --step-160 · Bold 700 · Leading Compact',
        text: 'Lead editorial callout: A design system is not a project; it is an organic, self-calibrating infrastructure that establishes shared understanding.',
      },
      {
        role: 'paragraph-150',
        stepToken: 'step-120',
        font: '--font-alt',
        meta: '.paragraph-150 · --font-alt · --step-120 · Regular 400 · Leading Compact',
        text: 'Sub-lead introduction: Typography bridges cold technical data and human expression, anchoring the brand voice across viewport widths from 380px to 1240px.',
      },
      {
        role: 'paragraph-110',
        stepToken: 'step-100',
        font: '--font-main',
        meta: '.paragraph-110 · --font-main · --step-100 · Regular 400 · Leading Relaxed',
        text: 'Standard longform body: Generous leading provides effortless reading across articles, technical documentation, and complex multi-column layouts without optical fatigue.',
      },
      {
        role: 'paragraph-100',
        stepToken: 'step-80',
        font: '--font-main',
        meta: '.paragraph-100 · --font-main · --step-80 · Regular 400 · Leading Compact',
        text: 'Compact UI body: Optimized for dense dashboards, table cells, modal dialog descriptions, and secondary card content.',
      },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 960px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Paragraph Roles (Prose & Body)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Lead paragraphs (P200, P150) employ the expressive display voice (<code>--font-alt</code>); standard narrative body text (P110, P100) employs the workhorse interface voice (<code>--font-main</code>). Drag the slider to observe fluid resizing and test utility classes.
          </p>

          <div
            style="
              display: inline-flex;
              align-items: center;
              flex-wrap: wrap;
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
            <span>Simulated Viewport: <strong>${width}px</strong></span>
            <span>·</span>
            <span>Progress: <strong>${Math.round(progress * 100)}%</strong></span>
            ${utilityClasses ? html`<span>·</span><span style="color: var(--color-purple-700);">Active Utilities: <code>${utilityClasses}</code></span>` : ''}
          </div>
        </div>

        <div
          style="
            width: 100%;
            max-width: ${width}px;
            background: var(--surface-bg);
            border: 1px dashed var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            box-sizing: border-box;
            transition: max-width var(--duration-100) var(--ease-out);
            ${cssVariablesStyle}
          "
        >
          <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            ${paragraphs.map((p) => {
              const info = stepsMap[p.stepToken];
              const curPx = info.currentPx.toFixed(1);
              const curRem = info.currentRem.toFixed(4);

              return html`
                <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-border);">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
                      ${p.meta}
                    </span>
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--color-purple-700); font-weight: 600;">
                      now ${curRem}rem · ${curPx}px (${info.minPx.toFixed(1)}px → ${info.maxPx.toFixed(1)}px)
                    </span>
                  </div>
                  <p class="${p.role} ${utilityClasses}" style="margin: 0; transition: font-size var(--duration-100) var(--ease-out);">
                    ${p.text}
                  </p>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};

export const Actions: Story = {
  render: (args) => {
    const width = args.containerWidth || 1000;
    const { progress, stepsMap, cssVariablesStyle } = getFluidTypeState(width);
    const utilityClasses = getAppliedUtilities(args);

    const actions = [
      {
        role: 'action-110',
        stepToken: 'step-100',
        label: 'Primary Call to Action',
        buttonText: 'Explore Catalog',
        buttonPadding: '0.75rem 1.5rem',
        primary: true,
      },
      {
        role: 'action-100',
        stepToken: 'step-80',
        label: 'Standard Button Action',
        buttonText: 'Confirm Selection',
        buttonPadding: '0.5rem 1.25rem',
        primary: true,
      },
      {
        role: 'action-75',
        stepToken: 'step-60',
        label: 'Micro Action Label',
        buttonText: 'View Details',
        buttonPadding: '0.35rem 0.85rem',
        primary: false,
      },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 960px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Action Roles (Interactive & Control Typography)
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Interface family (<code>--font-main</code>), Bold weight (700), Compact leading (1.25). Used for buttons, menu triggers, and interactive controls. Observe fluid font scaling and value readouts in real-time.
          </p>

          <div
            style="
              display: inline-flex;
              align-items: center;
              flex-wrap: wrap;
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
            <span>Simulated Viewport: <strong>${width}px</strong></span>
            <span>·</span>
            <span>Progress: <strong>${Math.round(progress * 100)}%</strong></span>
            ${utilityClasses ? html`<span>·</span><span style="color: var(--color-purple-700);">Active Utilities: <code>${utilityClasses}</code></span>` : ''}
          </div>
        </div>

        <div
          style="
            width: 100%;
            max-width: ${width}px;
            background: var(--surface-bg);
            border: 1px dashed var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            box-sizing: border-box;
            transition: max-width var(--duration-100) var(--ease-out);
            ${cssVariablesStyle}
          "
        >
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${actions.map((a) => {
              const info = stepsMap[a.stepToken];
              const curPx = info.currentPx.toFixed(1);
              const curRem = info.currentRem.toFixed(4);

              return html`
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
                  <div>
                    <div style="display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
                      <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                        .${a.role} &middot; --${a.stepToken} &middot; Bold 700
                      </span>
                      <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--color-purple-700); font-weight: 600;">
                        now ${curRem}rem · ${curPx}px (${info.minPx.toFixed(1)}px → ${info.maxPx.toFixed(1)}px)
                      </span>
                    </div>
                    <span class="${a.role} ${utilityClasses}" style="transition: font-size var(--duration-100) var(--ease-out);">${a.label}</span>
                  </div>
                  <button
                    class="${a.role} ${utilityClasses}"
                    style="
                      padding: ${a.buttonPadding};
                      background: ${a.primary ? 'var(--action-bg-1)' : 'var(--surface-bg)'};
                      color: ${a.primary ? 'var(--action-fg-1)' : 'var(--text-fg-1)'};
                      border: 1px solid ${a.primary ? 'var(--action-border)' : 'var(--surface-border)'};
                      border-radius: var(--radius-100);
                      cursor: pointer;
                      transition: font-size var(--duration-100) var(--ease-out);
                    "
                  >
                    ${a.buttonText}
                  </button>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};

export const Details: Story = {
  render: (args) => {
    const width = args.containerWidth || 1000;
    const { progress, stepsMap, cssVariablesStyle } = getFluidTypeState(width);
    const utilityClasses = getAppliedUtilities(args);

    const details = [
      {
        role: 'detail-100',
        stepToken: 'step-80',
        meta: '.detail-100 · --step-80 · SemiBold 600',
        label: 'Account Identification & Organization Name',
        desc: 'Primary input field label',
      },
      {
        role: 'detail-90',
        stepToken: 'step-70',
        meta: '.detail-90 · --step-70 · SemiBold 600',
        label: 'Active Deployment · Production Cluster (EU-Central-1)',
        desc: 'Secondary status readout',
      },
      {
        role: 'detail-75',
        stepToken: 'step-60',
        meta: '.detail-75 · --step-60 · SemiBold 600',
        label: 'CONFIDENTIAL · INTERNAL COMPLIANCE PROTOCOL',
        desc: 'Micro legal watermark / badge',
      },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 960px;">
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
              flex-wrap: wrap;
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
            <span>Simulated Viewport: <strong>${width}px</strong></span>
            <span>·</span>
            <span>Progress: <strong>${Math.round(progress * 100)}%</strong></span>
            ${utilityClasses ? html`<span>·</span><span style="color: var(--color-purple-700);">Active Utilities: <code>${utilityClasses}</code></span>` : ''}
          </div>
        </div>

        <div
          style="
            width: 100%;
            max-width: ${width}px;
            background: var(--surface-bg);
            border: 1px dashed var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            box-sizing: border-box;
            transition: max-width var(--duration-100) var(--ease-out);
            ${cssVariablesStyle}
          "
        >
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${details.map((d) => {
              const info = stepsMap[d.stepToken];
              const curPx = info.currentPx.toFixed(1);
              const curRem = info.currentRem.toFixed(4);

              return html`
                <div style="display: flex; flex-direction: column; gap: 0.4rem; padding: 1.25rem; border-radius: var(--radius-100); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--text-fg-2);">
                      ${d.meta}
                    </span>
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--color-purple-700); font-weight: 600;">
                      now ${curRem}rem · ${curPx}px (${info.minPx.toFixed(1)}px → ${info.maxPx.toFixed(1)}px)
                    </span>
                  </div>
                  <label class="${d.role} ${utilityClasses}" style="color: var(--text-fg-1); transition: font-size var(--duration-100) var(--ease-out);">
                    ${d.label}
                  </label>
                  <span style="font-size: var(--step-70); color: var(--text-fg-2);">${d.desc}</span>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};

export const FontStacks: Story = {
  render: (args) => {
    const width = args.containerWidth || 1000;
    const { progress, stepsMap, cssVariablesStyle } = getFluidTypeState(width);
    const utilityClasses = getAppliedUtilities(args);

    const stacks = [
      {
        token: '--font-main',
        stepToken: 'step-140',
        name: 'IBM Plex Sans',
        desc: 'The primary interface and structural workhorse. Engineered for maximum legibility at compact body sizes, form inputs, and system navigation.',
        fontFamily: 'var(--font-main)',
      },
      {
        token: '--font-alt',
        stepToken: 'step-160',
        name: 'Fraunces (Variable Display)',
        desc: 'The expressive editorial voice. Features variable optical sizing, softness, and wonk axes, delivering a warm human touch to section headlines and brand logotypes.',
        fontFamily: 'var(--font-alt)',
      },
      {
        token: '--font-mono',
        stepToken: 'step-120',
        name: 'IBM Plex Mono',
        desc: 'The precision data layer. Used for token values, code blocks, inspection readouts, geometry coordinates, and financial metrics.',
        fontFamily: 'var(--font-mono)',
      },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 960px;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Font Stacks & Brand Packs
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0 0 1rem 0;">
            Three brand-pack family tokens decouple font selection from component classes and utility roles. Drag the container width slider in Controls to preview responsive typography and test utility classes.
          </p>

          <div
            style="
              display: inline-flex;
              align-items: center;
              flex-wrap: wrap;
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
            <span>Simulated Viewport: <strong>${width}px</strong></span>
            <span>·</span>
            <span>Progress: <strong>${Math.round(progress * 100)}%</strong></span>
            ${utilityClasses ? html`<span>·</span><span style="color: var(--color-purple-700);">Active Utilities: <code>${utilityClasses}</code></span>` : ''}
          </div>
        </div>

        <div
          style="
            width: 100%;
            max-width: ${width}px;
            background: var(--surface-bg);
            border: 1px dashed var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            box-sizing: border-box;
            transition: max-width var(--duration-100) var(--ease-out);
            ${cssVariablesStyle}
          "
        >
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${stacks.map((st) => {
              const info = stepsMap[st.stepToken];
              const curPx = info.currentPx.toFixed(1);
              const curRem = info.currentRem.toFixed(4);

              return html`
                <div style="padding: 1.5rem; border-radius: var(--radius-150); border: 1px solid var(--surface-border); background: var(--surface-bg-1);">
                  <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem;">
                    <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">${st.token}</span>
                    <span style="font-family: var(--font-mono); font-size: var(--step-60); color: var(--color-purple-700); font-weight: 600;">
                      heading step: ${curRem}rem · ${curPx}px (${info.minPx.toFixed(1)}px → ${info.maxPx.toFixed(1)}px)
                    </span>
                  </div>
                  <h4 class="${utilityClasses}" style="font-family: ${st.fontFamily}; font-size: var(--${st.stepToken}); margin: 0.5rem 0; transition: font-size var(--duration-100) var(--ease-out);">
                    ${st.name}
                  </h4>
                  <p class="${utilityClasses}" style="font-family: ${st.fontFamily}; font-size: var(--step-90, var(--step-100)); color: var(--text-fg-2); margin: 0; line-height: 1.5; transition: font-size var(--duration-100) var(--ease-out);">
                    ${st.desc}
                  </p>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  },
};
