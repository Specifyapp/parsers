import {
  BorderToken,
  ColorToken,
  LinkableTokensSignatures,
  MeasurementToken,
} from '../../../types';
import { TokensGroupedByType } from '../link-design-tokens.type';

export class Border extends BorderToken {
  constructor(token: Partial<BorderToken>) {
    super(token);
  }

  compute(indexes: LinkableTokensSignatures, tokensGroupedByType: TokensGroupedByType) {
    if (indexes.color) {
      if (this.value.color) {
        this.value.color =
          this.match<ColorToken, Border['value']['color']['value']>(
            this.value.color.value,
            indexes.color,
            tokensGroupedByType.color,
          ) || this.value.color;
      }
    }

    if (indexes.measurement) {
      if (this.value.width) {
        this.value.width = this.match<MeasurementToken, Border['value']['width']['value']>(
          this.value.width.value,
          indexes.measurement,
          tokensGroupedByType.measurement,
        );
      }

      if (this.value.radii && 'value' in this.value.radii) {
        this.value.radii = this.match<
          MeasurementToken,
          NonNullable<Border['value']['radii']>['value']
        >(this.value.radii.value, indexes.measurement, tokensGroupedByType.measurement);
      }

      if (this.value.rectangleCornerRadii) {
        this.value.rectangleCornerRadii = this.value.rectangleCornerRadii.map(
          rectangleCornerRadii => {
            return this.match<
              MeasurementToken,
              NonNullable<Border['value']['rectangleCornerRadii']>[0]['value']
            >(rectangleCornerRadii.value, indexes.measurement, tokensGroupedByType.measurement);
          },
        );
      }

      if (this.value.dashes) {
        this.value.dashes = this.value.dashes.map(dash => {
          return this.match<MeasurementToken, NonNullable<Border['value']['dashes']>[0]['value']>(
            dash.value,
            indexes.measurement,
            tokensGroupedByType.measurement,
          );
        });
      }
    }
    return this.value;
  }
}
