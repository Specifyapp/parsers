import { ColorToken } from '../../../types/tokens/Color';
import { TokensAliasable } from '../link-design-tokens.type';
import { LinkableTokensSignatures } from '../../../types';

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
