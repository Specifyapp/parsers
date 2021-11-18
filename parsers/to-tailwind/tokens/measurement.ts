import { MeasurementToken } from '../../../types';
import { Utils } from './index';
import { MeasurementMapping, TailwindMappingTypes } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';

export class Measurement extends MeasurementToken {
  token: Partial<MeasurementToken>;
  constructor(token: Partial<MeasurementToken>, transformNameFn: Function) {
    super(token);
    this.token = { ...token, name: transformNameFn(token.name) };
  }
  generate(options: OptionsType): MeasurementMapping {
    const keyName = Utils.getTemplatedTokenName(this.token, options?.renameKeys?.spacing);
    return {
      spacing: {
        [keyName]: `${this.value.measure}${this.value.unit}`,
      },
    };
  }

  static afterGenerate(tokens: TailwindMappingTypes) {
    if (tokens.spacing) tokens.spacing = Utils.sortObject(tokens.spacing!);
    return tokens;
  }
}
