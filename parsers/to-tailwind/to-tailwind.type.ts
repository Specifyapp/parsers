import { InputDataType, OptionsType } from './to-tailwind.parser';
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

export type TailwindType =
  | 'colors'
  | 'spacing'
  | 'borderRadius'
  | 'borderWidth'
  | 'boxShadow'
  | 'opacity'
  | 'borderColor'
  | 'borderOpacity'
  | 'zIndex'
  | 'fontWeight'
  | 'letterSpacing'
  | 'lineHeight'
  | 'fontFamily'
  | 'fontSize'
  | 'textColor'
  | 'textOpacity'
  | 'transitionDuration'
  | 'backgroundImage';

export type DepthMapping = {
  zIndex?: Record<string, string>;
};
export type MeasurementMapping = {
  spacing?: Record<string, string>;
};
export type OpacityMapping = {
  opacity?: Record<string, string>;
};
export type ShadowMapping = {
  boxShadow?: Record<string, string>;
};

export type TextStyleMapping = {
  fontSize?: Record<string, string>;
  fontWeight?: Record<string, number>;
  letterSpacing?: Record<string, string>;
  lineHeight?: Record<string, string>;
  textColor?: Record<string, string>;
  textOpacity?: Record<string, string>;
  fontFamily?: Record<string, Array<string>>;
};
export type BorderMapping = {
  borderRadius?: Record<string, string>;
  borderColor?: Record<string, string>;
  borderOpacity?: Record<string, string>;
  borderWidth?: Record<string, string>;
};
export type DurationMapping = {
  transitionDuration?: Record<string, string>;
};
export type ColorMapping = {
  colors?: Record<string, string>;
};
export type GradientMappingBeforeWrapper = {
  backgroundImage?: Record<string, string>;
};
export type GradientMapping = {
  backgroundImage?: (theme: string) => Record<string, string>;
};

export type TailwindMappingTypes = DepthMapping &
  MeasurementMapping &
  OpacityMapping &
  ShadowMapping &
  TextStyleMapping &
  BorderMapping &
  DurationMapping &
  ColorMapping &
  GradientMappingBeforeWrapper;

export type TailwindOutputType = DepthMapping &
  MeasurementMapping &
  OpacityMapping &
  ShadowMapping &
  TextStyleMapping &
  BorderMapping &
  DurationMapping &
  ColorMapping &
  GradientMapping;

export interface TailwindTokenClass {
  new (tokens: Partial<Token>, transformNameFn: Function): TailwindTokenClassInstance;
  tailwindKeys?: Array<TailwindType>;
  afterStringGenerate?(tailwindTokens: TailwindOutputType, result: string): string;
  afterGenerate(TailwindTokens: TailwindMappingTypes): TailwindOutputType;
}

export interface TailwindTokenClassInstance {
  transformedName: string;
  generate(options: OptionsType, spTokens: InputDataType): Partial<Record<TailwindType, any>>;
}
