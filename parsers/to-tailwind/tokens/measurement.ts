import { MeasurementToken } from '../../../types';
import { Utils } from './index';
import { MeasurementMapping, TailwindMappingTypes } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';

export class Measurement extends MeasurementToken {
  token: Partial<MeasurementToken>;
  constructor(token: Partial<MeasurementToken>) {
    super(token);
    this.token = token;
  }
  generate(options: OptionsType): MeasurementMapping {
    return {
      spacing: Utils.go<ConstructorParameters<typeof MeasurementToken>[0]>(
        this.token,
        options,
        'spacing',
        `${this.value.measure}${this.value.unit}`,
      ),
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.spacing) tokens.spacing = Utils.sortObjectByValue(tokens.spacing!);
    return tokens;
  }
}
