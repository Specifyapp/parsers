import { MeasurementToken } from '../../../types';
import { Indexes } from '../to-theme-ui.parser';
import { Utils } from './index';
import { MeasurementMapping } from '../to-theme-ui.type';

interface ThemeUiSizes extends Partial<Record<MeasurementMapping, any>> {
  sizes?: Record<string, string>;
}

export class Measurement extends MeasurementToken {
  transformedName: string;
  constructor(token: Partial<MeasurementToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(): ThemeUiSizes {
    const result = {
      sizes: {
        [this.transformedName]: `${this.value.measure}${this.value.unit}`,
      },
    };
    Indexes.Instance.add('sizes', this.id, this.transformedName);
    return result;
  }

  static afterGenerate(tokens: ThemeUiSizes) {
    if (tokens.sizes) tokens.sizes = Utils.sortObject(tokens.sizes);
    return tokens;
  }
}
