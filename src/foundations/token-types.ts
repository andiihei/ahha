/**
 * W3C Design Tokens Community Group (DTCG) & Style Dictionary Token Types
 */

export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'composite';

export interface DesignToken<T = string | number | object> {
  $value: T;
  $type?: TokenType;
  $description?: string;
  $extensions?: {
    ahha?: {
      category?: string;
      tier?: 'layer-1' | 'layer-2' | 'layer-3';
      unit?: string;
      formula?: string;
      contrastScore?: number;
      apcaScore?: number;
      family?: string;
      step?: number | string;
    };
    'style-dictionary'?: {
      outputReferences?: boolean;
    };
    figma?: {
      collection?: string;
      mode?: string;
      scopes?: string[];
      hiddenFromPublishing?: boolean;
    };
  };
}

export type DesignTokenGroup = {
  [key: string]: DesignToken | DesignTokenGroup | string | undefined;
  $description?: string;
  $type?: TokenType;
};

export interface TokenCategorySummary {
  id: string;
  name: string;
  description: string;
  count: number;
  tokens: Record<string, DesignToken>;
}

export type ExportFormat = 'w3c' | 'style-dictionary' | 'figma-tokens';
