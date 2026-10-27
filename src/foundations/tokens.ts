import type { DesignToken, DesignTokenGroup, TokenCategorySummary, ExportFormat } from './token-types.js';

/**
 * AHHA Layer 1 Design Language Token Registry
 * Structured according to the W3C Design Tokens Community Group (DTCG) specification.
 *
 * CANONICAL SOURCE OF TRUTH:
 * All token values are parsed directly from the canonical CSS declarations in `global/*.css`.
 * There are NO manually duplicated token values in TypeScript.
 */

import {
  COLOR_FAMILIES,
  COLOR_STEPS,
  COLOR_TOKENS,
  TYPOGRAPHY_TOKENS,
  SPACE_TOKENS,
  SHAPING_TOKENS,
  MOTION_TOKENS,
  GRID_TOKENS,
  type ColorFamily,
  type ColorStep,
} from './parse-tokens.js';

export {
  COLOR_FAMILIES,
  COLOR_STEPS,
  COLOR_TOKENS,
  TYPOGRAPHY_TOKENS,
  SPACE_TOKENS,
  SHAPING_TOKENS,
  MOTION_TOKENS,
  GRID_TOKENS,
  type ColorFamily,
  type ColorStep,
};

// ==========================================
// CATEGORY REGISTRY
// ==========================================
export const ALL_CATEGORIES: TokenCategorySummary[] = [
  {
    id: 'colors',
    name: 'Colors & Opacity',
    description: 'Layer 1 OKLCH primitive ramps (6 families × 11 luminance steps) and global opacity state layers.',
    count: Object.keys(COLOR_TOKENS).length,
    tokens: COLOR_TOKENS,
  },
  {
    id: 'typography',
    name: 'Typography',
    description: 'Font families (IBM Plex Sans, Fraunces, IBM Plex Mono) and Utopia fluid type scale steps.',
    count: Object.keys(TYPOGRAPHY_TOKENS).length,
    tokens: TYPOGRAPHY_TOKENS,
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Utopia fluid spacing scale, fluid pairs, and frozen static micro-component spacing.',
    count: Object.keys(SPACE_TOKENS).length,
    tokens: SPACE_TOKENS,
  },
  {
    id: 'shaping',
    name: 'Shaping & Radii',
    description: 'Concentric radii scale, standard border widths, and natural layered OKLCH elevation shadows.',
    count: Object.keys(SHAPING_TOKENS).length,
    tokens: SHAPING_TOKENS,
  },
  {
    id: 'motion',
    name: 'Motion',
    description: 'Polysemic animation durations and cubic-bezier easing curves with reduced-motion support.',
    count: Object.keys(MOTION_TOKENS).length,
    tokens: MOTION_TOKENS,
  },
  {
    id: 'grid',
    name: 'Grid & Layout',
    description: '12-column grid geometry, container constraints, and fluid layout gutters.',
    count: Object.keys(GRID_TOKENS).length,
    tokens: GRID_TOKENS,
  },
];

export const ALL_TOKENS: Record<string, DesignToken<any>> = {
  ...COLOR_TOKENS,
  ...TYPOGRAPHY_TOKENS,
  ...SPACE_TOKENS,
  ...SHAPING_TOKENS,
  ...MOTION_TOKENS,
  ...GRID_TOKENS,
};

// ==========================================
// EXPORTERS
// ==========================================

/**
 * Exports tokens in the official W3C Design Tokens Community Group (DTCG) JSON format.
 */
export function exportW3CTokens(categoryFilter?: string): string {
  const root: DesignTokenGroup = {
    $description: 'AHHA Design System — Layer 1 Design Language Foundations (W3C DTCG Format)',
  };

  const categories = categoryFilter
    ? ALL_CATEGORIES.filter((c) => c.id === categoryFilter)
    : ALL_CATEGORIES;

  for (const cat of categories) {
    const group: DesignTokenGroup = {
      $description: cat.description,
    };

    for (const [key, token] of Object.entries(cat.tokens)) {
      group[key] = {
        $value: token.$value,
        $type: token.$type,
        $description: token.$description,
      };
    }

    root[cat.id] = group;
  }

  return JSON.stringify(root, null, 2);
}

/**
 * Exports tokens in the Style Dictionary V4 JSON format.
 */
export function exportStyleDictionary(categoryFilter?: string): string {
  const root: Record<string, any> = {};

  const categories = categoryFilter
    ? ALL_CATEGORIES.filter((c) => c.id === categoryFilter)
    : ALL_CATEGORIES;

  for (const cat of categories) {
    root[cat.id] = {};
    for (const [key, token] of Object.entries(cat.tokens)) {
      root[cat.id][key] = {
        value: token.$value,
        type: token.$type,
        comment: token.$description,
      };
    }
  }

  return JSON.stringify(root, null, 2);
}

/**
 * Draft export structure for Figma Variables (Collections, Modes, and Scopes).
 */
export function exportFigmaTokensDraft(categoryFilter?: string): string {
  const figmaPayload = {
    version: '1.0',
    metadata: {
      generator: 'AHHA Design System Token Exporter',
      date: new Date().toISOString(),
    },
    collections: [
      {
        name: 'AHHA Foundations (Layer 1)',
        modes: ['Default'],
        variableCount: Object.keys(ALL_TOKENS).length,
        variables: Object.entries(
          categoryFilter
            ? ALL_CATEGORIES.find((c) => c.id === categoryFilter)?.tokens || {}
            : ALL_TOKENS
        ).map(([key, token]) => ({
          name: key,
          type: mapToFigmaVariableType(token.$type),
          value: token.$value,
          description: token.$description,
          scopes: ['ALL_SCOPES'],
        })),
      },
    ],
  };

  return JSON.stringify(figmaPayload, null, 2);
}

function mapToFigmaVariableType(type?: string): string {
  switch (type) {
    case 'color':
      return 'COLOR';
    case 'dimension':
    case 'number':
    case 'duration':
      return 'FLOAT';
    case 'fontFamily':
    case 'cubicBezier':
    case 'shadow':
    default:
      return 'STRING';
  }
}
