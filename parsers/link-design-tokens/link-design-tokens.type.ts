import { ColorToken } from '../../types/tokens/Color';
import { MeasurementToken } from '../../types/tokens/Measurement';
import { LinkableTokensSignatures, Token, TokensValues } from '../../types';

export interface TokensGroupedByType {
  color: Array<ColorToken>;
  measurement: Array<MeasurementToken>;
}

export interface TokensAliasable {
  getSignature(): Partial<LinkableTokensSignatures>;
}

export interface LinkDesignTokenClassInstance extends Partial<TokensAliasable> {
  compute?(
    indexes: LinkableTokensSignatures,
    tokensGroupedByType: _.Dictionary<[Token, ...Token[]]>,
  ): TokensValues;
}

export interface LinkDesignTokenClass {
  new (tokens: Partial<Token>): LinkDesignTokenClassInstance;
}
