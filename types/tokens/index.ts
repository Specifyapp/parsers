import { BitmapToken, BitmapValue } from './Bitmap';
import { BorderToken, BorderValue } from './Border';
import { ColorToken, ColorValue } from './Color';
import { DurationToken, DurationValue } from './Duration';
import { FontToken, FontValue } from './Font';
import { GradientToken, GradientValue } from './Gradient';
import { MeasurementToken, MeasurementValue } from './Measurement';
import { OpacityToken, OpacityValue } from './Opacity';
import { ShadowToken, ShadowValue } from './Shadow';
import { TextStyleToken, TextStyleValue } from './TextStyle';
import { VectorToken, VectorValue } from './Vector';
import { DepthToken, DepthValue } from './Depth';

export type Token =
  | BorderToken
  | ColorToken
  | DurationToken
  | FontToken
  | GradientToken
  | MeasurementToken
  | OpacityToken
  | ShadowToken
  | TextStyleToken
  | VectorToken
  | DepthToken
  | BitmapToken;

export * from './Token';
export * from './Bitmap';
export * from './Border';
export * from './Color';
export * from './Duration';
export * from './Font';
export * from './Gradient';
export * from './Measurement';
export * from './Opacity';
export * from './Shadow';
export * from './TextStyle';
export * from './Vector';
export * from './Depth';

export type TokensValues =
  | BitmapValue
  | BorderValue
  | ColorValue
  | DurationValue
  | FontValue
  | GradientValue
  | MeasurementValue
  | OpacityValue
  | ShadowValue
  | TextStyleValue
  | VectorValue
  | DepthValue;
