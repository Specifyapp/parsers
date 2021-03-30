import { ColorToken, LinkableTokensSignatures } from '../../../types';
import { TokensAliasable } from '../link-design-tokens.type';

export class Color extends ColorToken implements TokensAliasable {
  constructor(token: Partial<ColorToken>) {
    super(token);
  }
  getSignature(): Partial<LinkableTokensSignatures> {
    return {
      color: {
        [this.computeSignature(JSON.stringify(this.value))]: this.id!,
      },
    };
  }
}
