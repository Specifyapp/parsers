import { BitmapValue, FontValue, TokensType, TokensValues, VectorValue } from '../../types';
import { OptionsType } from './to-scss-map.parser';

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

export type ToScssMapTokenType = Exclude<TokensType, 'vector' | 'bitmap' | 'font'> | 'borderRadius';
export type ScssMapHandlerType = {
  run: (
    value: Exclude<TokensValues, BitmapValue | VectorValue | FontValue>,
    options: OptionsType,
  ) => any;
  sort: (list: Record<string, any>) => any;
  name: ToScssMapTokenType;
};
