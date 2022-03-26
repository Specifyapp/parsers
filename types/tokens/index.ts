// VALUES

export type BorderValue = {
  color: ColorToken | { value: ColorValue };
  type:
    | 'none'
    | 'hidden'
    | 'dotted'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset';
  align?: string;
  dashes?: (MeasurementToken | { value: MeasurementValue })[];
  radii?: MeasurementToken | { value: MeasurementValue };
  rectangleCornerRadii?: (MeasurementToken | { value: MeasurementValue })[];
  width: MeasurementToken | { value: MeasurementValue };
};

export type BitmapValue = {
  url: string;
  format?: string;
  dimension?: number;
  fileName?: string;
};

export type ColorValue = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type DepthValue = {
  depth: number;
};

export type DurationValue = {
  duration: number;
  unit: string;
};

export type FontValue = {
  fontFamily: string;
  fontFileMissing?: boolean;
  fontPostScriptName: string;
  fontWeight: number;
  format?: 'woff2' | 'woff' | 'otf' | 'ttf' | 'eot';
  isItalic?: boolean;
  provider?: 'Custom font' | 'Google Fonts';
  url?: string;
};

export type GradientStep = {
  type: string;
  color: ColorToken | { value: ColorValue };
  position: number;
};

export type Gradient = { angle: string; colors: GradientStep[] };
export type GradientValue = { gradients: Gradient[] };

export type MeasurementValue = { measure: number; unit: string };
export type OpacityValue = { opacity: number };

export type Shadow = {
  blur: { value: MeasurementValue } | MeasurementToken;
  color: { value: ColorValue } | ColorToken;
  isInner: boolean;
  offsetX: { value: MeasurementValue } | MeasurementToken;
  offsetY: { value: MeasurementValue } | MeasurementToken;
  spread?: { value: MeasurementValue } | MeasurementToken;
};

export type ShadowValue = Shadow[];

export type TextTransformValue =
  | 'none'
  | 'capitalize'
  | 'uppercase'
  | 'lowercase'
  | 'full-width'
  | 'full-size-kana';

export type FontVariantValue =
  | 'normal'
  | 'none'
  | 'small-caps'
  | 'all-small-caps'
  | 'petite-caps'
  | 'all-petite-caps'
  | 'unicase'
  | 'titling-caps'
  | 'common-ligatures'
  | 'no-common-ligatures'
  | 'discretionary-ligatures'
  | 'no-discretionary-ligatures'
  | 'historical-ligatures'
  | 'no-historical-ligatures'
  | 'contextual'
  | 'no-contextual'
  | 'ordinal'
  | 'slashed-zero'
  | 'lining-nums'
  | 'proportional-nums'
  | 'tabular-nums'
  | 'diagonal-fractions'
  | 'stacked-fractions'
  | 'oldstyle-nums';

export type TextDecorationValue =
  | 'none'
  | 'underline'
  | 'overline'
  | 'line-through'
  | 'dashed'
  | 'wavy';

export type TextAlignValue =
  | 'initial'
  | 'left'
  | 'right'
  | 'center'
  | 'justify'
  | 'start'
  | 'end'
  | 'justify-all'
  | 'match-parent';

export type VerticalAlignValue =
  | 'initial'
  | 'baseline'
  | 'sub'
  | 'super'
  | 'text-top'
  | 'text-bottom'
  | 'middle'
  | 'top'
  | 'bottom'
  | 'center';

export type TextStyleValue = {
  color?: ColorToken | { value: ColorValue };
  font: FontToken | { value: FontValue };
  fontSize: MeasurementToken | { value: MeasurementValue };
  fontVariant?: FontVariantValue[];
  letterSpacing?: MeasurementToken | { value: MeasurementValue };
  lineHeight: MeasurementToken | { value: MeasurementValue };
  textAlign?: { horizontal?: TextAlignValue; vertical?: VerticalAlignValue };
  textDecoration?: TextDecorationValue[];
  textIndent?: MeasurementToken | { value: MeasurementValue };
  textTransform?: TextTransformValue;
};

type VectorValue = {
  url?: string;
  content?: string;
  format?: string;
  fileName?: string;
};

// TOKEN GENERIC (HAS A BAD NAME)

type TokenG<Type, Value> = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  value: Value;
  meta: Record<any, any>;
  type: Type;
  originId: string;
  sourceId: string;
  repositoryId: string;
};

// TOKEN TYPES

export type BitmapToken = TokenG<'bitmap', BitmapValue>;
export type BorderToken = TokenG<'border', BorderValue>;
export type ColorToken = TokenG<'color', ColorValue>;
export type DepthToken = TokenG<'depth', DepthValue>;
export type DurationToken = TokenG<'duration', DurationValue>;
export type FontToken = TokenG<'font', FontValue>;
export type GradientToken = TokenG<'gradient', GradientValue>;
export type MeasurementToken = TokenG<'measurement', MeasurementValue>;
export type OpacityToken = TokenG<'opacity', OpacityValue>;
export type ShadowToken = TokenG<'shadow', ShadowValue>;
export type TextStyleToken = TokenG<'textStyle', TextStyleValue>;
export type VectorToken = TokenG<'vector', VectorValue>;

export type AssetTokensType = BitmapToken | FontToken | VectorToken;
export type DesignTokensType = Exclude<Token, AssetTokensType>;

export type TokenTypeFromTokenTypeName<T extends TokensType> = T extends 'color'
  ? ColorToken
  : T extends 'bitmap'
  ? BitmapToken
  : T extends 'border'
  ? BorderToken
  : T extends 'depth'
  ? DepthToken
  : T extends 'duration'
  ? DurationToken
  : T extends 'font'
  ? FontToken
  : T extends 'gradient'
  ? GradientToken
  : T extends 'measurement'
  ? MeasurementToken
  : T extends 'opacity'
  ? OpacityToken
  : T extends 'shadow'
  ? ShadowToken
  : T extends 'textStyle'
  ? TextStyleToken
  : T extends 'vector'
  ? VectorToken
  : never;

// THE GRAAL

export type Token =
  | BitmapToken
  | BorderToken
  | ColorToken
  | DepthToken
  | DurationToken
  | FontToken
  | GradientToken
  | MeasurementToken
  | OpacityToken
  | ShadowToken
  | TextStyleToken
  | VectorToken;

export type TokensType = Token['type'];
export type TokensValues = Token['value'];
