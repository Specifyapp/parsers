import { TextStyleToken } from '../../../types/tokens/TextStyle';
import { TokensGroupedByType } from '../link-design-tokens.type';
import { LinkableTokensSignatures } from '../../../types';
import { ColorToken } from '../../../types/tokens/Color';
import { MeasurementToken } from '../../../types/tokens/Measurement';

export class TextStyle extends TextStyleToken {
  constructor(token: Partial<TextStyleToken>) {
    super(token);
  }

  compute(indexes: LinkableTokensSignatures, tokensGroupedByType: TokensGroupedByType) {
    if (indexes.color && this.value.color) {
      this.value.color = this.match<
        ColorToken,
        NonNullable<TextStyleToken['value']['color']>['value']
      >(this.value.color.value, indexes.color, tokensGroupedByType.color);
    }

    if (indexes.measurement) {
      (
        ['fontSize', 'textIndent', 'letterSpacing', 'lineHeight'] as Array<
          'fontSize' | 'textIndent' | 'letterSpacing' | 'lineHeight'
        >
      ).forEach(key => {
        if (this.value[key]) {
          this.value[key] = this.match<
            MeasurementToken,
            NonNullable<TextStyle['value'][typeof key]>['value']
          >(this.value[key]!.value, indexes.measurement, tokensGroupedByType.measurement);
        }
      });
    }

    return this.value;
  }
}
