import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './concentric-demo.js';
import type { AdsConcentricDemo } from './concentric-demo.js';

const meta: Meta<AdsConcentricDemo> = {
  title: 'Components/Concentric Demo',
  component: 'ads-concentric-demo',
  parameters: {
    docs: {
      description: {
        component: `
# <ads-concentric-demo>
Encapsulated interactive demonstration of the **Concentric Corner Radius Law**:
$$\\text{Outer Radius} = \\text{Inner Radius} + \\text{Gap}$$
Equivalently:
$$\\text{Nested Radius} = \\max(0, \\text{Governing Radius} - \\text{Total Inset})$$

Features per-layer concentric toggling, fixed radius overrides, fluid gap selection, and real-time arc centre geometric validation.
        `,
      },
    },
  },
  argTypes: {
    governingRadius: {
      control: 'select',
      options: ['--radius-150', '--radius-250', '--radius-300'],
      defaultValue: '--radius-300',
    },
    gapToken: {
      control: 'select',
      options: ['--space-50', '--space-100', '--space-200'],
      defaultValue: '--space-100',
    },
  },
};

export default meta;
type Story = StoryObj<AdsConcentricDemo>;

export const Default: Story = {
  args: {
    governingRadius: '--radius-300',
    gapToken: '--space-100',
  },
  render: (args) => html`
    <ads-concentric-demo
      .governingRadius="${args.governingRadius}"
      .gapToken="${args.gapToken}"
    ></ads-concentric-demo>
  `,
};
