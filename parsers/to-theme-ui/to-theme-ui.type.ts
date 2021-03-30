import { InputDataType, OptionsType } from './to-theme-ui.parser';
import Token from '../../types/tokens/Token';

export type ColorsFormat =
  | 'rgb'
  | 'prgb'
  | 'hex'
  | 'hex6'
  | 'hex3'
  | 'hex4'
  | 'hex8'
  | 'name'
  | 'hsl'
  | 'hsv';

export type ThemeUiType =
  | 'borderStyles'
  | 'borderWidths'
  | 'colors'
  | 'fonts'
  | 'fontSizes'
  | 'fontWeights'
  | 'letterSpacings'
  | 'lineHeights'
  | 'opacities'
  | 'durations'
  | 'radii'
  | 'shadows'
  | 'sizes'
  | 'space'
  | 'transitions'
  | 'zIndices'
  | 'gradient'
  | 'border'
  | 'text';

export type DepthMapping = 'zIndices';
export type MeasurementMapping = 'sizes' | 'space' | 'radii';
export type OpacityMapping = 'opacities';
export type ShadowMapping = 'shadows';
export type FontMapping = 'fonts';
export type TextStyleMapping = 'fontSizes' | 'fontWeights' | 'letterSpacings' | 'lineHeights';
export type BorderMapping = 'borderStyles' | 'borderWidths';
export type DurationMapping = 'durations';
export type ColorMapping = 'colors';
export type GradientMapping = 'gradient';
export type VariantMapping = 'text' | 'border';

export type ThemeUiTypes =
  | DepthMapping
  | MeasurementMapping
  | OpacityMapping
  | ShadowMapping
  | FontMapping
  | TextStyleMapping
  | BorderMapping
  | ColorMapping
  | GradientMapping
  | VariantMapping;

export type ThemeUiConfig = Partial<Record<ThemeUiType, any>>;
export type ThemeUiIndexes = Partial<Record<ThemeUiType, Record<string, string | number>>>;
export interface ThemeUiTokenClass {
  new (tokens: Partial<Token>, transformNameFn: Function): ThemeUiTokenClassInstance;
  afterGenerate?(themeUiTokens: Record<ThemeUiTypes, object>): Record<ThemeUiTypes, object>;
  generateVariants?(
    themeUiTokens: Partial<Record<ThemeUiTypes, object>>,
    tokens: InputDataType,
    options: OptionsType,
    transformNameFn: Function,
  ): Record<ThemeUiTypes, any>;
}

export interface ThemeUiTokenClassInstance {
  transformedName: string;
  generate(options: OptionsType, spTokens: InputDataType): Partial<Record<ThemeUiTypes, any>>;
}
