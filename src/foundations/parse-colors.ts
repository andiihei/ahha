import colorsCss from '../../global/colors.css?raw';
import type { DesignToken } from './token-types.js';

export interface ParsedColorTokens {
  COLOR_FAMILIES: readonly string[];
  COLOR_STEPS: readonly number[];
  COLOR_TOKENS: Record<string, DesignToken<string>>;
}

export function parseColorsCss(cssText: string): ParsedColorTokens {
  // Match all :root { ... } rule bodies
  const rootMatches = [...cssText.matchAll(/:root\s*\{([\s\S]*?)\}/g)];
  const cssVars: Record<string, string> = {};

  for (const match of rootMatches) {
    const lines = match[1].split('\n');
    for (const line of lines) {
      const declMatch = line.match(/^\s*--([\w-]+)\s*:\s*([^;]+);/);
      if (declMatch) {
        cssVars[declMatch[1]] = declMatch[2].trim();
      }
    }
  }

  const families = ['neutral', 'purple', 'green', 'red', 'yellow', 'blue'] as const;
  const steps = [1000, 950, 900, 800, 700, 500, 300, 200, 100, 50, 25] as const;
  const tokens: Record<string, DesignToken<string>> = {};

  const familyDescriptions: Record<string, string> = {
    neutral: 'Midnight brand foundation / canvas',
    purple: 'Purple Rain categorical / accent',
    green: 'Fern success / validated',
    red: 'Cerise error / destructive',
    yellow: 'Marigold warning / cautionary',
    blue: 'Cobalt information / interactive',
  };

  // Populate primitive color family ramps
  for (const family of families) {
    for (const step of steps) {
      const varName = `${family}-${step}`;
      const tokenKey = `color-${family}-${step}`;
      const val = cssVars[varName] || '';
      tokens[tokenKey] = {
        $value: val,
        $type: 'color',
        $description: `${family.charAt(0).toUpperCase() + family.slice(1)} step ${step} (${familyDescriptions[family] || ''})`,
      };
    }
  }

  // Populate opacity tokens
  const opacitySteps = [0, 5, 10, 15, 20, 40, 50, 65, 80, 100] as const;
  for (const op of opacitySteps) {
    const varName = `opacity-${op}`;
    const val = cssVars[varName] ?? (op / 100).toString();
    tokens[varName] = {
      $value: val,
      $type: 'number',
      $description: op === 0 ? 'Fully transparent' : op === 100 ? 'Fully opaque' : `Opacity ${op}%`,
    };
  }

  return {
    COLOR_FAMILIES: families,
    COLOR_STEPS: steps,
    COLOR_TOKENS: tokens,
  };
}

export const { COLOR_FAMILIES, COLOR_STEPS, COLOR_TOKENS } = parseColorsCss(colorsCss);

export type ColorFamily = (typeof COLOR_FAMILIES)[number];
export type ColorStep = (typeof COLOR_STEPS)[number];

