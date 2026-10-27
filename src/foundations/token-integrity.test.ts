import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractCssVars } from './css-parser.js';
import {
  ALL_TOKENS,
  TYPOGRAPHY_TOKENS,
  SPACE_TOKENS,
  SHAPING_TOKENS,
  MOTION_TOKENS,
  GRID_TOKENS,
} from './tokens.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const globalDir = path.resolve(rootDir, 'global');
const srcDir = path.resolve(rootDir, 'src');

describe('Design System Canonical Token Integrity', () => {
  it('all design tokens have non-empty values and valid DTCG types', () => {
    const tokens = Object.entries(ALL_TOKENS);
    expect(tokens.length).toBeGreaterThan(100);

    for (const [key, token] of tokens) {
      if (String(token.$value).length === 0) {
        console.log('Empty token found:', key, token);
      }
      expect(token.$value, `Token "${key}" has undefined or empty $value`).toBeDefined();
      expect(String(token.$value).length, `Token "${key}" has empty value`).toBeGreaterThan(0);
      expect(token.$type, `Token "${key}" missing $type`).toBeDefined();
    }
  });

  it('typography tokens match canonical global/typography.css exactly', () => {
    const typoCss = fs.readFileSync(path.join(globalDir, 'typography.css'), 'utf-8');
    const vars = extractCssVars(typoCss);

    expect(TYPOGRAPHY_TOKENS['font-main'].$value).toBe(vars['font-main']);
    expect(TYPOGRAPHY_TOKENS['font-alt'].$value).toBe(vars['font-alt']);
    expect(TYPOGRAPHY_TOKENS['font-mono'].$value).toBe(vars['font-mono']);

    const steps = ['60', '70', '80', '100', '120', '140', '160', '180', '200', '250', '300', '350'];
    for (const s of steps) {
      expect(TYPOGRAPHY_TOKENS[`step-${s}`].$value).toBe(vars[`step-${s}`]);
    }
  });

  it('motion tokens match canonical global/motion.css exactly', () => {
    const motionCss = fs.readFileSync(path.join(globalDir, 'motion.css'), 'utf-8');
    const vars = extractCssVars(motionCss);

    expect(MOTION_TOKENS['duration-100'].$value).toBe(vars['duration-100']);
    expect(MOTION_TOKENS['ease-out'].$value).toBe(vars['ease-out']);
  });

  it('shaping tokens match canonical global/shaping.css exactly', () => {
    const shapingCss = fs.readFileSync(path.join(globalDir, 'shaping.css'), 'utf-8');
    const vars = extractCssVars(shapingCss);

    expect(SHAPING_TOKENS['radius-100'].$value).toBe(vars['radius-100']);
    expect(SHAPING_TOKENS['border-width-100'].$value).toBe(vars['border-width-100']);
    expect(SHAPING_TOKENS['elevation-low'].$value).toBe(vars['elevation-low']);
  });

  it('space tokens match canonical global/space.css exactly', () => {
    const spaceCss = fs.readFileSync(path.join(globalDir, 'space.css'), 'utf-8');
    const vars = extractCssVars(spaceCss);

    expect(SPACE_TOKENS['space-100'].$value).toBe(vars['space-100']);
    expect(SPACE_TOKENS['space-static-100'].$value).toBe(vars['space-static-100']);
  });
});

describe('Storybook Story & Component Token Compliance Guard', () => {
  function getAllFiles(dir: string, ext: string[]): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, ext));
      } else if (ext.some((e) => entry.name.endsWith(e))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const storyAndComponentFiles = getAllFiles(srcDir, ['.stories.ts', '.ts']).filter(
    (f) => !f.endsWith('.test.ts') && !f.endsWith('vite-env.d.ts')
  );

  it('prohibits hardcoding raw font-family strings in stories and components (use var(--font-*) or utility classes)', () => {
    const prohibitedFontFamilies = [
      /font-family:\s*['"]?IBM Plex Sans['"]?/i,
      /font-family:\s*['"]?Fraunces['"]?/i,
      /font-family:\s*['"]?IBM Plex Mono['"]?/i,
    ];

    const violations: string[] = [];

    for (const file of storyAndComponentFiles) {
      // Exclude token definitions/parsers
      if (file.includes('parse-') || file.endsWith('tokens.ts') || file.endsWith('token-types.ts')) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Skip comment lines
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

        for (const pattern of prohibitedFontFamilies) {
          if (pattern.test(line)) {
            violations.push(
              `${path.relative(rootDir, file)}:${index + 1} - "${line.trim()}" (violates token rule: use var(--font-*) or .u-font-* instead of hardcoding font family)`
            );
          }
        }
      });
    }

    expect(violations, `Found hardcoded font families:\n${violations.join('\n')}`).toEqual([]);
  });

  it('prohibits hardcoding raw hex/rgb colors in component inline templates (use CSS variables)', () => {
    // Prohibit hex colors in inline style attributes in components and stories
    const inlineHexColorPattern = /style=["'][^"']*#([0-9a-fA-F]{3,8})[^"']*["']/;
    const violations: string[] = [];

    for (const file of storyAndComponentFiles) {
      // Allow token export viewer story which renders color swatches or token JSON
      if (file.includes('token-export') || file.includes('parse-') || file.endsWith('tokens.ts')) {
        continue;
      }

      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Skip comment lines
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

        if (inlineHexColorPattern.test(line)) {
          violations.push(
            `${path.relative(rootDir, file)}:${index + 1} - "${line.trim()}" (violates token rule: use CSS custom properties var(--...) instead of raw hex colors)`
          );
        }
      });
    }

    expect(violations, `Found hardcoded inline hex colors:\n${violations.join('\n')}`).toEqual([]);
  });
});
