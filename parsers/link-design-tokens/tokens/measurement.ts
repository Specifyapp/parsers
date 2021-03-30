import { LinkableTokensSignatures, MeasurementToken } from '../../../types';
import { TokensAliasable } from '../link-design-tokens.type';

export class Measurement extends MeasurementToken implements TokensAliasable {
  constructor(token: Partial<MeasurementToken>) {
    super(token);
  }
  getSignature(): Partial<LinkableTokensSignatures> {
    return {
      measurement: {
        [this.computeSignature(JSON.stringify(this.value))]: this.id!,
      },
    };
  }
}
