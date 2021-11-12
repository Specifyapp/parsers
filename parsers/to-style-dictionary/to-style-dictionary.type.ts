import Token from '../../types/tokens/Token';
import { OptionsType } from './to-style-dictionary.parser';

type BasicObject = Record<string, string>;
type RecursiveBasicObject = Record<string, BasicObject | string>;
export type BaseStyleDictionaryTokensFormat = Partial<{
  color: Partial<{
    base: RecursiveBasicObject; // from colors in Specify
    font: RecursiveBasicObject; // from textStyles in Specify
    // gradient: RecursiveBasicObject; Useless until we can add property like direction or position in style dictionary.
    shadow: Record<
      string,
      Partial<{
        blur: RecursiveBasicObject; // from shadows in Specify
        offsetX: RecursiveBasicObject; // from shadows in Specify
        offsetY: RecursiveBasicObject; // from shadows in Specify
        spread: RecursiveBasicObject; // from shadows in Specify
      }>
    >; // from shadows in Specify
    border: RecursiveBasicObject; // from borders in Specify
  }>;
  size: Partial<{
    base: RecursiveBasicObject; // from measurement in Specify
    font: RecursiveBasicObject; // from textStyles in Specify
    border: RecursiveBasicObject; // from borders in Specify
    radius: RecursiveBasicObject; // from borders in Specify
    lineHeight: RecursiveBasicObject; // from textStyles in Specify
    letterSpacing: RecursiveBasicObject; // from textStyles in Specify
    textIndent: RecursiveBasicObject; // from textStyles in Specify
    shadow: Record<
      string,
      Partial<{
        blur: RecursiveBasicObject; // from shadows in Specify
        offsetX: RecursiveBasicObject; // from shadows in Specify
        offsetY: RecursiveBasicObject; // from shadows in Specify
        spread: RecursiveBasicObject; // from shadows in Specify
      }>
    >;
  }>;
  time: Partial<{
    base: RecursiveBasicObject; // from duration in Specify
  }>;
  asset: Partial<{
    font: RecursiveBasicObject;
    icon: RecursiveBasicObject;
    image: RecursiveBasicObject;
  }>;
  opacity: Partial<{
    base: RecursiveBasicObject;
  }>;
  depth: Partial<{
    base: RecursiveBasicObject; // from depth in Specify
  }>;
}>;

export interface StyleDictionaryTokenClass {
  new (tokens: Partial<Token>, options: Array<string>): StyleDictionaryTokenClassInstance;
  // afterStringGenerate?(tailwindTokens: TailwindOutputType, result: string): string;
  // afterGenerate(TailwindTokens: TailwindMappingTypes): TailwindOutputType;
}

export interface StyleDictionaryTokenClassInstance {
  transformedName: string;
  generate(options: OptionsType): Partial<BaseStyleDictionaryTokensFormat>;
}
