import { ColorToken, GradientToken, LinkableTokensSignatures } from '../../../types';
import { TokensGroupedByType } from '../link-design-tokens.type';

export class Gradient extends GradientToken {
  constructor(token: Partial<GradientToken>) {
    super(token);
  }

  compute(indexes: LinkableTokensSignatures, tokensGroupedByType: TokensGroupedByType) {
    if (indexes.color) {
      this.value.gradients = this.value.gradients.map(gradient => {
        gradient.colors = gradient.colors.map(step => {
          step.color = this.match<
            ColorToken,
            GradientToken['value']['gradients'][0]['colors'][0]['color']['value']
          >(step.color.value, indexes.color, tokensGroupedByType.color);
          return step;
        });
        return gradient;
      });
    }
    return this.value;
  }
}
