import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import {
  ALL_CATEGORIES,
  ALL_TOKENS,
  exportW3CTokens,
  exportStyleDictionary,
  exportFigmaTokensDraft,
} from './tokens.js';

const meta: Meta = {
  title: 'Foundations/Token Export',
  parameters: {
    docs: {
      description: {
        component: `
# Token Export Engine (Machine-Readable Data)
As defined in **Strategy Pillar 1 ("Tokens become data, not just CSS")**, this engine serializes all Layer 1 tokens into:
1. **W3C Design Tokens Community Group (DTCG)** standard JSON.
2. **Style Dictionary V4** schema for multi-platform compilation (iOS, Android, Web).
3. **Figma Variables (Draft)** schema for collections, modes, and scopes.

Use the controls below to choose the format and scope, copy to clipboard, or download directly.
        `,
      },
    },
  },
  argTypes: {
    exportFormat: {
      name: 'Export Format',
      control: { type: 'select' },
      options: ['w3c', 'style-dictionary', 'figma-tokens'],
      defaultValue: 'w3c',
      description: 'The target token serialization schema',
    },
    categoryFilter: {
      name: 'Category Scope',
      control: { type: 'select' },
      options: ['all', 'colors', 'typography', 'space', 'shaping', 'motion', 'grid'],
      defaultValue: 'all',
      description: 'Filter exported tokens by functional layer category',
    },
  },
};

export default meta;
type Story = StoryObj;

export const ExportViewer: Story = {
  args: {
    exportFormat: 'w3c',
    categoryFilter: 'all',
  },
  render: (args) => {
    const filter = args.categoryFilter === 'all' ? undefined : args.categoryFilter;
    let jsonString = '';

    if (args.exportFormat === 'style-dictionary') {
      jsonString = exportStyleDictionary(filter);
    } else if (args.exportFormat === 'figma-tokens') {
      jsonString = exportFigmaTokensDraft(filter);
    } else {
      jsonString = exportW3CTokens(filter);
    }

    const tokenCount = filter
      ? ALL_CATEGORIES.find((c) => c.id === filter)?.count || 0
      : Object.keys(ALL_TOKENS).length;

    const handleCopy = () => {
      navigator.clipboard.writeText(jsonString);
      const copyBtn = document.getElementById('export-copy-btn');
      if (copyBtn) {
        const orig = copyBtn.textContent;
        copyBtn.textContent = 'Copied to Clipboard!';
        setTimeout(() => {
          copyBtn.textContent = orig;
        }, 2000);
      }
    };

    const handleDownload = () => {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ahha-tokens-${args.exportFormat}-${args.categoryFilter}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return html`
      <div style="display: flex; flex-direction: column; gap: 1.5rem; width: 100%; max-width: 900px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-family: var(--font-alt); font-size: var(--step-125); margin: 0 0 0.5rem 0;">
              Live Token Serializer
            </h3>
            <p style="font-size: var(--step-80); color: var(--text-fg-2); margin: 0;">
              Serializing <strong>${tokenCount} tokens</strong> in <code>${args.exportFormat}</code> format.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button
              type="button"
              id="export-copy-btn"
              class="ads-button ads-button--secondary"
              style="
                background: var(--surface-bg-1);
                color: var(--text-fg-1);
                border: 1px solid var(--surface-border);
                border-radius: var(--radius-100);
                padding: 0.5rem 1rem;
                font-family: var(--font-mono);
                font-size: var(--step-75);
                font-weight: 600;
                cursor: pointer;
              "
              @click="${handleCopy}"
            >
              Copy JSON
            </button>
            <button
              type="button"
              class="ads-button ads-button--primary"
              style="
                background: var(--action-bg-1);
                color: var(--action-fg-1);
                border: 0;
                border-radius: var(--radius-100);
                padding: 0.5rem 1rem;
                font-family: var(--font-mono);
                font-size: var(--step-75);
                font-weight: 600;
                cursor: pointer;
              "
              @click="${handleDownload}"
            >
              Download .json
            </button>
          </div>
        </div>

        <div
          style="
            background: var(--surface-bg-1);
            border: 1px solid var(--surface-border);
            border-radius: var(--radius-150);
            overflow: hidden;
            box-shadow: var(--elevation-low);
          "
        >
          <div
            style="
              padding: 0.75rem 1.25rem;
              background: color-mix(in oklch, var(--surface-bg-1) 80%, var(--surface-border));
              border-bottom: 1px solid var(--surface-border);
              display: flex;
              justify-content: space-between;
              font-family: var(--font-mono);
              font-size: var(--step-75);
              color: var(--text-fg-2);
            "
          >
            <span>Schema: ${args.exportFormat.toUpperCase()}</span>
            <span>Encoding: UTF-8 JSON</span>
          </div>

          <pre
            style="
              margin: 0;
              padding: 1.5rem;
              font-family: var(--font-mono);
              font-size: var(--step-75);
              color: var(--text-fg-1);
              max-height: 480px;
              overflow-y: auto;
              line-height: 1.45;
              background: transparent;
            "
          ><code>${jsonString}</code></pre>
        </div>
      </div>
    `;
  },
};
