import { BorderToken } from '../../types';

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

export type DepthMapping = 'zIndices';
export type MeasurementMapping = 'sizes' | 'space' | 'radii';
export type OpacityMapping = 'opacities';
export type ShadowMapping = 'shadows';
export type FontMapping = 'fonts' | 'fontWeights';
export type TextStyleMapping = 'fontSizes' | 'fontWeights' | 'letterSpacings' | 'lineHeights';
export type BorderMapping = 'borderStyles' | 'borderWidths';
export type DurationMapping = 'durations';
export type ColorMapping = 'colors';
export type GradientMapping = 'gradient';
export type VariantMapping = 'text' | 'border';

export type ThemeUiKeys =
  | DepthMapping
  | MeasurementMapping
  | OpacityMapping
  | ShadowMapping
  | FontMapping
  | DurationMapping
  | TextStyleMapping
  | BorderMapping
  | ColorMapping
  | GradientMapping
  | VariantMapping;

export type ThemeUiConfig = Partial<Record<ThemeUiKeys, any>>;
export type ThemeUiIndexes = Partial<Record<ThemeUiKeys, Record<string, string | number>>>;

export interface ThemeUiBorder {
  border?: Record<string, any>;
  borderStyles?: Record<string, BorderToken['value']['type']>;
  borderWidths?: Record<string, string>;
  radii?: Record<string, number>;
}

export interface ThemeUiColor {
  colors?: Record<string, string>;
}

export interface ThemeUiDepth {
  zIndices?: Record<string, number>;
}

export interface ThemeUiDuration {
  durations?: Record<string, number | string>;
}

export interface ThemeUiFont {
  fonts?: Record<string, string>;
  fontWeights?: Record<string, string | number>;
}

export interface ThemeUiGradient {
  gradients?: Record<string, string>;
}

export interface ThemeUiSizes {
  sizes?: Record<string, string>;
}

export interface ThemeUiOpacities {
  opacities?: Array<string | number>;
}

export interface ThemeUiShadow {
  shadows?: Record<string, string>;
}

export interface ThemeUiTextStyle {
  fontSizes?: Array<number | string>;
  letterSpacings?: Record<string, number | string>;
  lineHeights?: Record<string, number | string>;
  fontWeights?: Record<string, string | number>;
}

export interface ThemeUiTextStyle {
  fontSizes?: Array<number | string>;
  letterSpacings?: Record<string, number | string>;
  lineHeights?: Record<string, number | string>;
  fontWeights?: Record<string, string | number>;
}

export interface ThemeUiBorderVariant {
  borderWidth?: string | number;
  borderColor?: string;
  borderRadius?: string | number;
  borderStyle?: BorderToken['value']['type'];
}

// export interface ThemeUiTextStyleVariant {
//   borderWidth?: string | number;
//   borderColor?: string;
//   borderRadius?: string | number;
//   borderStyle?: BorderToken['value']['type'];
// }

export type ThemeUiObjectUnion =
  | ThemeUiBorder
  | ThemeUiColor
  | ThemeUiDepth
  | ThemeUiDuration
  | ThemeUiFont
  | ThemeUiGradient
  | ThemeUiSizes
  | ThemeUiOpacities
  | ThemeUiShadow
  | ThemeUiTextStyle;

export type ThemeUiObject = ThemeUiBorder &
  ThemeUiColor &
  ThemeUiDepth &
  ThemeUiDuration &
  ThemeUiFont &
  ThemeUiGradient &
  ThemeUiSizes &
  ThemeUiOpacities &
  ThemeUiShadow &
  ThemeUiTextStyle;
