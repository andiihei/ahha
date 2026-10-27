/**
 * Extracts CSS custom properties (:root variables) from raw CSS text.
 */
export function extractCssVars(cssText: string): Record<string, string> {
  const clean = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  const rootMatches = [...clean.matchAll(/:root\s*\{([\s\S]*?)\}/g)];
  const cssVars: Record<string, string> = {};

  for (const m of rootMatches) {
    const body = m[1];
    const varMatches = [...body.matchAll(/--([a-zA-Z0-9_-]+)\s*:\s*([\s\S]*?);/g)];
    for (const vm of varMatches) {
      const name = vm[1].trim();
      const val = vm[2].replace(/\s+/g, ' ').trim();
      if (!cssVars[name]) {
        cssVars[name] = val;
      }
    }
  }

  return cssVars;
}
