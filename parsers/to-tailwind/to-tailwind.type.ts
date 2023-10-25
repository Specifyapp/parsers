import { InputDataType, OptionsType } from './to-tailwind.parser';
import Token from '../../types/tokens/Token';
import { RecursiveRecord } from '../../types';

export type ColorsFormat =
  | 'raw'
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
  zIndex?: RecursiveRecord<string>;
};
export type MeasurementMapping = {
  spacing?: RecursiveRecord<string>;
};
export type OpacityMapping = {
  opacity?: RecursiveRecord<string>;
};
export type ShadowMapping = {
  boxShadow?: RecursiveRecord<string>;
};

export type TextStyleMapping = {
  fontSize?: RecursiveRecord<string>;
  fontWeight?: RecursiveRecord<number>;
  letterSpacing?: RecursiveRecord<string>;
  lineHeight?: RecursiveRecord<string>;
  textColor?: RecursiveRecord<string>;
  textOpacity?: RecursiveRecord<string>;
  fontFamily?: RecursiveRecord<Array<string>>;
};
export type BorderMapping = {
  borderRadius?: RecursiveRecord<string>;
  borderColor?: RecursiveRecord<string>;
  borderOpacity?: RecursiveRecord<string>;
  borderWidth?: RecursiveRecord<string>;
};
export type DurationMapping = {
  transitionDuration?: RecursiveRecord<string>;
};
export type ColorMapping = {
  colors?: RecursiveRecord<string>;
};
export type GradientMappingBeforeWrapper = {
  backgroundImage?: RecursiveRecord<string>;
};
export type GradientMapping = {
  backgroundImage?: (theme: string) => RecursiveRecord<string>;
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
  new (tokens: Partial<Token>): TailwindTokenClassInstance;
  tailwindKeys?: Array<TailwindType>;
  afterGenerate(TailwindTokens: TailwindMappingTypes): TailwindOutputType;
}

export interface TailwindTokenClassInstance {
  transformedName: string;
  generate(options: OptionsType, spTokens: InputDataType): Partial<Record<TailwindType, any>>;
}

export const formatNameArray = ['camelCase', 'kebabCase', 'snakeCase', 'pascalCase'] as const;
export type FormatName = typeof formatNameArray[number];
