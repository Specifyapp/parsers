import { MeasurementToken } from '../../../types';
import { Utils } from './index';
import { MeasurementMapping, TailwindMappingTypes } from '../to-tailwind.type';

export class Measurement extends MeasurementToken {
  transformedName: string;
  constructor(token: Partial<MeasurementToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(): MeasurementMapping {
    return {
      spacing: {
        [this.transformedName]: `${this.value.measure}${this.value.unit}`,
      },
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.spacing) tokens.spacing = Utils.sortObject(tokens.spacing!);
    return tokens;
  }
}
