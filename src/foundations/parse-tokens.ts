import colorsCss from '../../global/colors.css?raw';
import typographyCss from '../../global/typography.css?raw';
import spaceCss from '../../global/space.css?raw';
import shapingCss from '../../global/shaping.css?raw';
import motionCss from '../../global/motion.css?raw';
import gridCss from '../../global/grid.css?raw';

import { extractCssVars } from './css-parser.js';
import { parseColorsCss } from './parse-colors.js';
import type { DesignToken } from './token-types.js';

export const { COLOR_FAMILIES, COLOR_STEPS, COLOR_TOKENS } = parseColorsCss(colorsCss);
export type { ColorFamily, ColorStep } from './parse-colors.js';

// ==========================================
// 2. TYPOGRAPHY TOKENS (parsed from global/typography.css)
// ==========================================
export function parseTypographyTokens(cssText: string): Record<string, DesignToken<string | number>> {
  const vars = extractCssVars(cssText);
  const tokens: Record<string, DesignToken<string | number>> = {};

  // Font Stacks
  tokens['font-main'] = {
    $value: vars['font-main'] || '"IBM Plex Sans", sans-serif',
    $type: 'fontFamily',
    $description: 'Primary workhorse typeface for UI and body text',
  };
  tokens['font-alt'] = {
    $value: vars['font-alt'] || '"Fraunces", serif',
    $type: 'fontFamily',
    $description: 'Expressive editorial display typeface with variable optical size, softness, and wonk',
  };
  tokens['font-mono'] = {
    $value: vars['font-mono'] || '"IBM Plex Mono", monospace',
    $type: 'fontFamily',
    $description: 'Precision monospaced font for code, data tokens, and readouts',
  };

  // Fluid Steps (Utopia curve from 380px @ 18px base to 1240px @ 20px base)
  const stepDescriptions: Record<string, string> = {
    'step-60': 'Sub-detail / micro legal copy (fluid 12.6px to 11.6px)',
    'step-70': 'Micro action / caption (fluid 14.2px to 13.9px)',
    'step-80': 'Secondary text / helper text (fluid 16px to 16.7px)',
    'step-100': 'Base paragraph body text (fluid 18px to 20px)',
    'step-120': 'Lead paragraph / subtitle (fluid 20.25px to 24px)',
    'step-140': 'H4 section title (fluid 22.8px to 28.8px)',
    'step-160': 'H3 subsection header (fluid 25.6px to 34.6px)',
    'step-180': 'H2 major section heading (fluid 28.8px to 41.5px)',
    'step-200': 'H1 page title (fluid 32.4px to 49.8px)',
    'step-250': 'Display hero headline (fluid 36.5px to 59.7px)',
    'step-300': 'Super-display hero (fluid 41px to 71.7px)',
    'step-350': 'Monumental banner headline (fluid 46.2px to 86px)',
  };

  const steps = ['60', '70', '80', '100', '120', '140', '160', '180', '200', '250', '300', '350'];
  for (const step of steps) {
    const key = `step-${step}`;
    tokens[key] = {
      $value: vars[key] || '',
      $type: 'dimension',
      $description: stepDescriptions[key] || `Fluid typography step ${step}`,
    };
  }

  // Leading
  const leadings = ['none', 'compact', 'relaxed'];
  for (const l of leadings) {
    const key = `leading-${l}`;
    if (vars[key]) {
      tokens[key] = {
        $value: Number(vars[key]) || vars[key],
        $type: 'number',
        $description: `Line height ${l}`,
      };
    }
  }

  // Tracking
  const trackings = ['tight', 'none', 'loose', 'extra-loose'];
  for (const t of trackings) {
    const key = `tracking-${t}`;
    if (vars[key]) {
      tokens[key] = {
        $value: vars[key],
        $type: 'dimension',
        $description: `Letter spacing ${t}`,
      };
    }
  }

  return tokens;
}

export const TYPOGRAPHY_TOKENS = parseTypographyTokens(typographyCss);

// ==========================================
// 3. SPACE TOKENS (parsed from global/space.css)
// ==========================================
export function parseSpaceTokens(cssText: string): Record<string, DesignToken<string>> {
  const vars = extractCssVars(cssText);
  const tokens: Record<string, DesignToken<string>> = {};

  // Fluid Steps
  const fluidSteps = ['10', '30', '50', '60', '70', '80', '100', '125', '150', '200', '300', '400', '500'];
  for (const s of fluidSteps) {
    const key = `space-${s}`;
    tokens[key] = {
      $value: vars[key] || '',
      $type: 'dimension',
      $description: `Fluid spacing step ${s}`,
    };
  }

  // One-up Pairs
  const pairs = [
    '10-30', '30-50', '50-60', '60-70', '70-80', '80-100',
    '100-125', '125-150', '150-200', '200-300', '300-400', '400-500'
  ];
  for (const p of pairs) {
    const key = `space-${p}`;
    if (vars[key]) {
      tokens[key] = {
        $value: vars[key],
        $type: 'dimension',
        $description: `Fluid spacing pair ${p}`,
      };
    }
  }

  // Static Scale
  const staticSteps = ['10', '30', '50', '60', '70', '80', '100', '125', '150', '200', '300', '400', '500'];
  for (const s of staticSteps) {
    const key = `space-static-${s}`;
    if (vars[key]) {
      tokens[key] = {
        $value: vars[key],
        $type: 'dimension',
        $description: `Static spacing ${s} (${vars[key]})`,
      };
    }
  }

  return tokens;
}

export const SPACE_TOKENS = parseSpaceTokens(spaceCss);

// ==========================================
// 4. SHAPING TOKENS (parsed from global/shaping.css)
// ==========================================
export function parseShapingTokens(cssText: string): Record<string, DesignToken<string>> {
  const vars = extractCssVars(cssText);
  const tokens: Record<string, DesignToken<string>> = {};

  // Radii
  const radii = ['0', '25', '50', '100', '150', '250', '300', 'full'];
  const radiusDescriptions: Record<string, string> = {
    'radius-0': 'Sharp square corner (0px)',
    'radius-25': 'Subtle corner rounding (2px)',
    'radius-50': 'Compact badge / tag radius (4px)',
    'radius-100': 'Base interactive element radius (8px)',
    'radius-150': 'Small card / button cluster radius (12px)',
    'radius-250': 'Medium container / card radius (20px)',
    'radius-300': 'Large surface / modal governing radius (24px)',
    'radius-full': 'Pill sentinel radius for rounded buttons and toggles',
  };
  for (const r of radii) {
    const key = `radius-${r}`;
    tokens[key] = {
      $value: vars[key] || '',
      $type: 'dimension',
      $description: radiusDescriptions[key] || `Border radius ${r}`,
    };
  }

  // Border Widths
  const widths = ['0', '100', '200', '400'];
  const widthDescriptions: Record<string, string> = {
    'border-width-0': 'No border (0px)',
    'border-width-100': 'Standard hairline border (1px)',
    'border-width-200': 'Emphasis / focus ring border (2px)',
    'border-width-400': 'Heavy structural accent border (4px)',
  };
  for (const w of widths) {
    const key = `border-width-${w}`;
    tokens[key] = {
      $value: vars[key] || '',
      $type: 'dimension',
      $description: widthDescriptions[key] || `Border width ${w}`,
    };
  }

  // Elevations
  const elevations = ['low', 'medium', 'high', 'very-high'];
  const elevationDescriptions: Record<string, string> = {
    'elevation-low': 'Low elevation for resting cards and subtle containers',
    'elevation-medium': 'Medium elevation for floating dropdowns, popovers, and hovered cards',
    'elevation-high': 'High elevation for dialogs, modals, and sticky drawer overlays',
    'elevation-very-high': 'Very high elevation for alert banners and full-screen modal overlays',
  };
  for (const e of elevations) {
    const key = `elevation-${e}`;
    tokens[key] = {
      $value: vars[key] || '',
      $type: 'shadow',
      $description: elevationDescriptions[key] || `Elevation ${e}`,
    };
  }

  return tokens;
}

export const SHAPING_TOKENS = parseShapingTokens(shapingCss);

// ==========================================
// 5. MOTION TOKENS (parsed from global/motion.css)
// ==========================================
export function parseMotionTokens(cssText: string): Record<string, DesignToken<string>> {
  const vars = extractCssVars(cssText);
  const tokens: Record<string, DesignToken<string>> = {};

  // Durations
  const durations = ['0', '25', '50', '75', '100', '150', '200', '300', '400'];
  const durationDescriptions: Record<string, string> = {
    'duration-0': 'Instant state change / reduced motion fallback',
    'duration-25': 'Immediate micro-feedback (50ms)',
    'duration-50': 'Micro-interactions (toggle flick, button press)',
    'duration-75': 'Quick transitions (150ms)',
    'duration-100': 'Standard element transitions (hover, fade)',
    'duration-150': 'Intermediate transitions (300ms)',
    'duration-200': 'Complex UI motions (dropdown expansion, accordion)',
    'duration-300': 'Layout shifts and off-canvas drawers',
    'duration-400': 'Deliberate choreography and full-page transitions',
  };
  for (const d of durations) {
    const key = `duration-${d}`;
    tokens[key] = {
      $value: vars[key] || '',
      $type: 'duration',
      $description: durationDescriptions[key] || `Animation duration ${d}`,
    };
  }

  // Easings
  const easings = ['ease-in', 'ease-out', 'ease-in-out', 'ease-emphasized'];
  const easeDescriptions: Record<string, string> = {
    'ease-in': 'Accelerating curve for elements exiting the viewport',
    'ease-out': 'Decelerating curve for elements entering the viewport',
    'ease-in-out': 'Symmetric easing for elements moving within the screen',
    'ease-emphasized': 'Emphasized curve for large or hero movement',
  };
  for (const ease of easings) {
    tokens[ease] = {
      $value: vars[ease] || '',
      $type: 'cubicBezier',
      $description: easeDescriptions[ease] || `Transition easing ${ease}`,
    };
  }

  if (vars['stagger']) {
    tokens['stagger'] = {
      $value: vars['stagger'],
      $type: 'duration',
      $description: 'Default interval between staggered items',
    };
  }

  return tokens;
}

export const MOTION_TOKENS = parseMotionTokens(motionCss);

// ==========================================
// 6. GRID TOKENS (parsed from global/grid.css)
// ==========================================
export function parseGridTokens(cssText: string): Record<string, DesignToken<string | number>> {
  const vars = extractCssVars(cssText);
  const tokens: Record<string, DesignToken<string | number>> = {};

  tokens['grid-columns'] = {
    $value: vars['grid-columns'] ? Number(vars['grid-columns']) : 12,
    $type: 'number',
    $description: '12-column responsive layout system',
  };
  tokens['grid-max-width'] = {
    $value: vars['grid-max-width'] || '92.50rem',
    $type: 'dimension',
    $description: 'Maximum width container limit (1480px at 16px root)',
  };
  tokens['grid-gutter'] = {
    $value: vars['grid-gutter'] || 'var(--space-100-200)',
    $type: 'dimension',
    $description: 'Fluid layout gutter between columns',
  };

  return tokens;
}

export const GRID_TOKENS = parseGridTokens(gridCss);
