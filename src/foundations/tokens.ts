import type { DesignToken, DesignTokenGroup, TokenCategorySummary, ExportFormat } from './token-types.js';

/**
 * AHHA Layer 1 Design Language Token Registry
 * Structured according to the W3C Design Tokens Community Group (DTCG) specification.
 */

import {
  COLOR_FAMILIES,
  COLOR_STEPS,
  COLOR_TOKENS,
  type ColorFamily,
  type ColorStep,
} from './parse-colors.js';

export { COLOR_FAMILIES, COLOR_STEPS, COLOR_TOKENS, type ColorFamily, type ColorStep };

// ==========================================
// 2. TYPOGRAPHY
// ==========================================
export const TYPOGRAPHY_TOKENS: Record<string, DesignToken<string>> = {
  // Font Stacks
  'font-main': { $value: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', $type: 'fontFamily', $description: 'Primary workhorse typeface for UI and body text' },
  'font-alt': { $value: '"Fraunces", Georgia, serif', $type: 'fontFamily', $description: 'Expressive editorial display typeface with variable optical size, softness, and wonk' },
  'font-mono': { $value: '"IBM Plex Mono", Menlo, Consolas, monospace', $type: 'fontFamily', $description: 'Precision monospaced font for code, data tokens, and readouts' },

  // Fluid Steps (Utopia curve from 380px @ 18px base to 1240px @ 20px base)
  'step-60': { $value: 'clamp(0.7234rem, 0.8196rem + -0.1242vw, 0.7901rem)', $type: 'dimension', $description: 'Sub-detail / micro legal copy (fluid 12.6px to 11.6px)' },
  'step-70': { $value: 'clamp(0.8681rem, 0.8981rem + -0.0388vw, 0.8889rem)', $type: 'dimension', $description: 'Micro action / caption (fluid 14.2px to 13.9px)' },
  'step-80': { $value: 'clamp(1.0000rem, 0.9816rem + 0.0775vw, 1.0417rem)', $type: 'dimension', $description: 'Secondary text / helper text (fluid 16px to 16.7px)' },
  'step-100': { $value: 'clamp(1.1250rem, 1.0698rem + 0.2326vw, 1.2500rem)', $type: 'dimension', $description: 'Base paragraph body text (fluid 18px to 20px)' },
  'step-120': { $value: 'clamp(1.2656rem, 1.1621rem + 0.4360vw, 1.5000rem)', $type: 'dimension', $description: 'Lead paragraph / subtitle (fluid 20.25px to 24px)' },
  'step-140': { $value: 'clamp(1.4238rem, 1.2576rem + 0.6999vw, 1.8000rem)', $type: 'dimension', $description: 'H4 section title (fluid 22.8px to 28.8px)' },
  'step-160': { $value: 'clamp(1.6018rem, 1.3552rem + 1.0385vw, 2.1600rem)', $type: 'dimension', $description: 'H3 subsection header (fluid 25.6px to 34.6px)' },
  'step-180': { $value: 'clamp(1.8020rem, 1.4530rem + 1.4697vw, 2.5920rem)', $type: 'dimension', $description: 'H2 major section heading (fluid 28.8px to 41.5px)' },
  'step-200': { $value: 'clamp(2.0273rem, 1.5487rem + 2.0151vw, 3.1104rem)', $type: 'dimension', $description: 'H1 page title (fluid 32.4px to 49.8px)' },
  'step-250': { $value: 'clamp(2.2807rem, 1.6392rem + 2.7010vw, 3.7325rem)', $type: 'dimension', $description: 'Display hero headline (fluid 36.5px to 59.7px)' },
  'step-300': { $value: 'clamp(2.5658rem, 1.7204rem + 3.5594vw, 4.4790rem)', $type: 'dimension', $description: 'Super-display hero (fluid 41px to 71.7px)' },
  'step-350': { $value: 'clamp(2.8865rem, 1.7870rem + 4.6293vw, 5.3748rem)', $type: 'dimension', $description: 'Monumental banner headline (fluid 46.2px to 86px)' },
};

// ==========================================
// 3. SPACE
// ==========================================
export const SPACE_TOKENS: Record<string, DesignToken<string>> = {
  // Fluid Spacing Scale (Macro layout) - matched to global/space.css (380px floor)
  'space-10': { $value: 'clamp(0.1250rem, 0.1250rem + 0vw, 0.1250rem)', $type: 'dimension', $description: 'Fluid 2px constant (0.125rem)' },
  'space-30': { $value: 'clamp(0.2500rem, 0.2224rem + 0.1163vw, 0.3125rem)', $type: 'dimension', $description: 'Fluid 4px to 5px (0.25rem - 0.3125rem)' },
  'space-50': { $value: 'clamp(0.5625rem, 0.5349rem + 0.1163vw, 0.6250rem)', $type: 'dimension', $description: 'Fluid 9px to 10px (0.5625rem - 0.625rem)' },
  'space-60': { $value: 'clamp(0.6875rem, 0.6599rem + 0.1163vw, 0.7500rem)', $type: 'dimension', $description: 'Fluid 11px to 12px (0.6875rem - 0.75rem)' },
  'space-70': { $value: 'clamp(0.8125rem, 0.7849rem + 0.1163vw, 0.8750rem)', $type: 'dimension', $description: 'Fluid 13px to 14px (0.8125rem - 0.875rem)' },
  'space-80': { $value: 'clamp(0.8750rem, 0.8198rem + 0.2326vw, 1.0000rem)', $type: 'dimension', $description: 'Fluid 14px to 16px (0.875rem - 1rem)' },
  'space-100': { $value: 'clamp(1.1250rem, 1.0698rem + 0.2326vw, 1.2500rem)', $type: 'dimension', $description: 'Base fluid spacing step (fluid 18px to 20px)' },
  'space-125': { $value: 'clamp(1.3750rem, 1.2922rem + 0.3488vw, 1.5625rem)', $type: 'dimension', $description: 'Fluid 22px to 25px (1.375rem - 1.5625rem)' },
  'space-150': { $value: 'clamp(1.6875rem, 1.6047rem + 0.3488vw, 1.8750rem)', $type: 'dimension', $description: 'Fluid 27px to 30px (1.6875rem - 1.875rem)' },
  'space-200': { $value: 'clamp(2.2500rem, 2.1395rem + 0.4651vw, 2.5000rem)', $type: 'dimension', $description: 'Fluid 36px to 40px (2.25rem - 2.5rem)' },
  'space-300': { $value: 'clamp(3.3750rem, 3.2093rem + 0.6977vw, 3.7500rem)', $type: 'dimension', $description: 'Fluid 54px to 60px (3.375rem - 3.75rem)' },
  'space-400': { $value: 'clamp(4.5000rem, 4.2791rem + 0.9302vw, 5.0000rem)', $type: 'dimension', $description: 'Fluid 72px to 80px (4.5rem - 5rem)' },
  'space-500': { $value: 'clamp(5.6250rem, 5.3488rem + 1.1628vw, 6.2500rem)', $type: 'dimension', $description: 'Fluid 90px to 100px (5.625rem - 6.25rem)' },

  // Static Spacing Scale (Micro components) - matched to global/space.css
  'space-static-10': { $value: '0.125rem', $type: 'dimension', $description: 'Static 2px (0.125rem)' },
  'space-static-30': { $value: '0.375rem', $type: 'dimension', $description: 'Static 6px (0.375rem)' },
  'space-static-50': { $value: '0.625rem', $type: 'dimension', $description: 'Static 10px (0.625rem)' },
  'space-static-60': { $value: '0.75rem', $type: 'dimension', $description: 'Static 12px (0.75rem)' },
  'space-static-70': { $value: '0.875rem', $type: 'dimension', $description: 'Static 14px (0.875rem)' },
  'space-static-80': { $value: '1rem', $type: 'dimension', $description: 'Static 16px (1rem)' },
  'space-static-100': { $value: '1.25rem', $type: 'dimension', $description: 'Static 20px (1.25rem)' },
  'space-static-125': { $value: '1.5625rem', $type: 'dimension', $description: 'Static 25px (1.5625rem)' },
  'space-static-150': { $value: '1.875rem', $type: 'dimension', $description: 'Static 30px (1.875rem)' },
  'space-static-200': { $value: '2.5rem', $type: 'dimension', $description: 'Static 40px (2.5rem)' },
  'space-static-300': { $value: '3.75rem', $type: 'dimension', $description: 'Static 60px (3.75rem)' },
  'space-static-400': { $value: '5rem', $type: 'dimension', $description: 'Static 80px (5rem)' },
  'space-static-500': { $value: '6.25rem', $type: 'dimension', $description: 'Static 100px (6.25rem)' },
};

// ==========================================
// 4. SHAPING (RADII, BORDERS, ELEVATION)
// ==========================================
export const SHAPING_TOKENS: Record<string, DesignToken<string>> = {
  // Corner Radii (concentric scale: 8px base 100)
  'radius-0': { $value: '0rem', $type: 'dimension', $description: 'Sharp square corner (0px)' },
  'radius-25': { $value: '0.125rem', $type: 'dimension', $description: 'Subtle corner rounding (2px)' },
  'radius-50': { $value: '0.25rem', $type: 'dimension', $description: 'Compact badge / tag radius (4px)' },
  'radius-100': { $value: '0.5rem', $type: 'dimension', $description: 'Base interactive element radius (8px)' },
  'radius-150': { $value: '0.75rem', $type: 'dimension', $description: 'Small card / button cluster radius (12px)' },
  'radius-250': { $value: '1.25rem', $type: 'dimension', $description: 'Medium container / card radius (20px)' },
  'radius-300': { $value: '1.5rem', $type: 'dimension', $description: 'Large surface / modal governing radius (24px)' },
  'radius-full': { $value: '9999px', $type: 'dimension', $description: 'Pill sentinel radius for rounded buttons and toggles' },

  // Border Widths
  'border-width-0': { $value: '0rem', $type: 'dimension', $description: 'No border (0px)' },
  'border-width-100': { $value: '0.0625rem', $type: 'dimension', $description: 'Standard hairline border (1px)' },
  'border-width-200': { $value: '0.125rem', $type: 'dimension', $description: 'Emphasis / focus ring border (2px)' },
  'border-width-400': { $value: '0.25rem', $type: 'dimension', $description: 'Heavy structural accent border (4px)' },

  // Elevation Shadows (Natural layered OKLCH shadows)
  'elevation-low': {
    $value: '0 1px 2px oklch(0.18 0.015 270 / 0.04), 0 2px 4px oklch(0.18 0.015 270 / 0.04)',
    $type: 'shadow',
    $description: 'Low elevation for resting cards and subtle containers'
  },
  'elevation-medium': {
    $value: '0 2px 4px oklch(0.18 0.015 270 / 0.04), 0 4px 8px oklch(0.18 0.015 270 / 0.06), 0 8px 16px oklch(0.18 0.015 270 / 0.04)',
    $type: 'shadow',
    $description: 'Medium elevation for floating dropdowns, popovers, and hovered cards'
  },
  'elevation-high': {
    $value: '0 4px 8px oklch(0.18 0.015 270 / 0.04), 0 8px 16px oklch(0.18 0.015 270 / 0.08), 0 16px 32px oklch(0.18 0.015 270 / 0.06)',
    $type: 'shadow',
    $description: 'High elevation for dialogs, modals, and sticky drawer overlays'
  },
  'elevation-very-high': {
    $value: '0 8px 16px oklch(0.18 0.015 270 / 0.06), 0 16px 32px oklch(0.18 0.015 270 / 0.10), 0 32px 64px oklch(0.18 0.015 270 / 0.08)',
    $type: 'shadow',
    $description: 'Very high elevation for alert banners and full-screen modal overlays'
  },
};

// ==========================================
// 5. MOTION
// ==========================================
export const MOTION_TOKENS: Record<string, DesignToken<string>> = {
  // Durations
  'duration-0': { $value: '0ms', $type: 'duration', $description: 'Instant state change / reduced motion fallback' },
  'duration-50': { $value: '75ms', $type: 'duration', $description: 'Micro-interactions (toggle flick, button press)' },
  'duration-100': { $value: '150ms', $type: 'duration', $description: 'Standard element transitions (hover, fade)' },
  'duration-200': { $value: '250ms', $type: 'duration', $description: 'Complex UI motions (dropdown expansion, accordion)' },
  'duration-300': { $value: '350ms', $type: 'duration', $description: 'Layout shifts and off-canvas drawers' },
  'duration-400': { $value: '500ms', $type: 'duration', $description: 'Deliberate choreography and full-page transitions' },

  // Easings
  'ease-standard': { $value: 'cubic-bezier(0.2, 0, 0, 1)', $type: 'cubicBezier', $description: 'Natural deceleration curve for general UI motions' },
  'ease-in': { $value: 'cubic-bezier(0.3, 0, 1, 1)', $type: 'cubicBezier', $description: 'Accelerating curve for elements exiting the viewport' },
  'ease-out': { $value: 'cubic-bezier(0, 0, 0.2, 1)', $type: 'cubicBezier', $description: 'Decelerating curve for elements entering the viewport' },
  'ease-in-out': { $value: 'cubic-bezier(0.4, 0, 0.2, 1)', $type: 'cubicBezier', $description: 'Symmetric easing for elements moving within the screen' },
  'ease-emphasized': { $value: 'cubic-bezier(0.2, 0, 0, 1.2)', $type: 'cubicBezier', $description: 'Emphasized overshoot curve for playful or punchy micro-interactions' },
};

// ==========================================
// 6. GRID
// ==========================================
export const GRID_TOKENS: Record<string, DesignToken<string | number>> = {
  'grid-columns': { $value: 12, $type: 'number', $description: '12-column responsive layout system' },
  'grid-max-width': { $value: '92.50rem', $type: 'dimension', $description: 'Maximum width container limit (1480px at 16px root)' },
  'grid-gutter': { $value: 'var(--space-100-200)', $type: 'dimension', $description: 'Fluid layout gutter between columns' },
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
