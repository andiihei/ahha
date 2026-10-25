import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { MOTION_TOKENS } from './tokens.js';

const meta: Meta = {
  title: 'Foundations/Motion',
  parameters: {
    docs: {
      description: {
        component: `
# Motion & Animation (Layer 1 Foundations)
The AHHA motion system defines temporal dynamics through:
1. **Polysemic Durations (\`--duration-0\` to \`--duration-400\`)**: Scales from instant micro-feedback (75ms) to deliberate layout transitions (500ms).
2. **Cubic-Bezier Easings**: Standard deceleration, exit acceleration, and emphasized overshoot curves.
3. **Reduced Motion Contract**: Under \`@media (prefers-reduced-motion: reduce)\`, all transitions collapse to \`--duration-0\` instantly.
        `,
      },
    },
  },
  argTypes: {
    selectedDuration: {
      name: 'Animation Duration',
      control: { type: 'select' },
      options: ['--duration-50', '--duration-100', '--duration-200', '--duration-300', '--duration-400'],
      defaultValue: '--duration-200',
    },
    selectedEasing: {
      name: 'Easing Curve',
      control: { type: 'select' },
      options: ['--ease-standard', '--ease-in', '--ease-out', '--ease-in-out', '--ease-emphasized'],
      defaultValue: '--ease-standard',
    },
  },
};

export default meta;
type Story = StoryObj;

export const InteractiveMotionRunner: Story = {
  args: {
    selectedDuration: '--duration-200',
    selectedEasing: '--ease-standard',
  },
  render: (args) => {
    const handleRunAnimation = (e: MouseEvent) => {
      const target = (e.currentTarget as HTMLElement).closest('.motion-card')?.querySelector('.animated-ball') as HTMLElement;
      if (!target) return;
      target.style.transition = 'none';
      target.style.transform = 'translateX(0)';
      requestAnimationFrame(() => {
        target.style.transition = `transform var(${args.selectedDuration}) var(${args.selectedEasing})`;
        target.style.transform = 'translateX(260px)';
      });
    };

    return html`
      <div class="motion-card" style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 650px; width: 100%;">
        <div>
          <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
            Interactive Motion Playground
          </h3>
          <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
            Select different durations and easing curves in <strong>Controls</strong>, then click <strong>Play Transition</strong> to observe physics.
          </p>
        </div>

        <div
          style="
            height: 120px;
            background: var(--surface-bg-1);
            border: 1px solid var(--surface-border);
            border-radius: var(--radius-150);
            padding: 1.5rem;
            position: relative;
            display: flex;
            align-items: center;
          "
        >
          <div
            class="animated-ball"
            style="
              width: 50px;
              height: 50px;
              border-radius: var(--radius-full);
              background: var(--action-bg-1);
              color: var(--action-fg-1);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: var(--elevation-medium);
              cursor: pointer;
            "
          >
            ●
          </div>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <button
            type="button"
            class="ads-button ads-button--primary"
            style="
              background: var(--action-bg-1);
              color: var(--action-fg-1);
              border: 0;
              border-radius: var(--radius-100);
              padding: 0.6rem 1.25rem;
              font-family: var(--font-main);
              font-weight: 600;
              cursor: pointer;
            "
            @click="${handleRunAnimation}"
          >
            Play Transition
          </button>
          <span style="font-family: var(--font-mono); font-size: var(--step-75); color: var(--text-fg-2);">
            var(${args.selectedDuration}) · var(${args.selectedEasing})
          </span>
        </div>
      </div>
    `;
  },
};

export const DurationAndEasingCatalog: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; width: 100%; max-width: 800px;">
      <div>
        <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
          Durations & Easings Matrix
        </h3>
        <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
          All durations and mathematical cubic-bezier easing definitions in the design language.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div style="padding: 1.5rem; background: var(--surface-bg-1); border: 1px solid var(--surface-border); border-radius: var(--radius-150);">
          <h4 style="font-family: var(--font-alt); margin: 0 0 1rem 0;">Durations</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${['duration-0', 'duration-50', 'duration-100', 'duration-200', 'duration-300', 'duration-400'].map(
              (dur) => html`
                <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: var(--step-75);">
                  <span style="color: var(--text-fg-1);">--${dur}</span>
                  <span style="color: var(--text-fg-2);">${MOTION_TOKENS[dur]?.$value}</span>
                </div>
              `
            )}
          </div>
        </div>

        <div style="padding: 1.5rem; background: var(--surface-bg-1); border: 1px solid var(--surface-border); border-radius: var(--radius-150);">
          <h4 style="font-family: var(--font-alt); margin: 0 0 1rem 0;">Easings</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${['ease-standard', 'ease-in', 'ease-out', 'ease-in-out', 'ease-emphasized'].map(
              (ease) => html`
                <div style="display: flex; flex-direction: column; gap: 0.2rem; font-family: var(--font-mono); font-size: var(--step-75);">
                  <span style="color: var(--text-fg-1); font-weight: 600;">--${ease}</span>
                  <span style="color: var(--text-fg-2); font-size: var(--step-60);">${MOTION_TOKENS[ease]?.$value}</span>
                </div>
              `
            )}
          </div>
        </div>
      </div>
    </div>
  `,
};
