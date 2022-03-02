import {
  ColorToken,
  LinkableTokensSignatures,
  MeasurementToken,
  ShadowToken,
} from '../../../types';
import { TokensGroupedByType } from '../link-design-tokens.type';

export class Shadow extends ShadowToken {
  constructor(token: Partial<ShadowToken>) {
    super(token);
  }

  compute(indexes: LinkableTokensSignatures, tokensGroupedByType: TokensGroupedByType) {
    if (indexes.color) {
      this.value = this.value.map(shadow => {
        shadow.color = this.match<ColorToken, ShadowToken['value'][0]['color']['value']>(
          shadow.color.value,
          indexes.color,
          tokensGroupedByType.color,
        );
        return shadow;
      });
    }

    if (indexes.measurement) {
      this.value = this.value.map(shadow => {
        (
          ['offsetX', 'offsetY', 'blur', 'spread'] as Array<
            'offsetX' | 'offsetY' | 'blur' | 'spread'
          >
        ).forEach(key => {
          if (shadow[key]) {
            shadow[key] = this.match<
              MeasurementToken,
              NonNullable<ShadowToken['value'][0][typeof key]>['value']
            >(shadow[key]!.value, indexes.measurement, tokensGroupedByType.measurement);
          }
        });
        return shadow;
      });
    }

    return this.value;
  }
}
