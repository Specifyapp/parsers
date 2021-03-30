import Token, { TokenInterface } from './Token';
import { ColorToken, ColorValue } from './Color';
import { MeasurementToken, MeasurementValue } from './Measurement';
import { TokensType } from './index';

export interface BorderValue {
  color:
    | ColorToken
    | {
        value: ColorValue;
      };
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
  width:
    | MeasurementToken
    | {
        value: MeasurementValue;
      };
  align?: string;
  radii?:
    | MeasurementToken
    | {
        value: MeasurementValue;
      };
  rectangleCornerRadii?: Array<
    | MeasurementToken
    | {
        value: MeasurementValue;
      }
  >;
  dashes?: Array<
    | MeasurementToken
    | {
        value: MeasurementValue;
      }
  >;
}

export class BorderToken extends Token implements TokenInterface {
  type: TokensType = 'border';
  value: BorderValue;

  constructor(element: Partial<BorderToken>) {
    super(element);
    this.value = element.value!;
  }
}
