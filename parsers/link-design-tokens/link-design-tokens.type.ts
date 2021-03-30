import { IToken } from '../../types';
import {
  ColorToken,
  LinkableTokensSignatures,
  MeasurementToken,
  TokensType,
  TokensValues,
} from '../../types';

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
    tokensGroupedByType: Record<TokensType, Array<IToken>>,
  ): TokensValues;
}

export interface LinkDesignTokenClass {
  new (tokens: Partial<IToken>): LinkDesignTokenClassInstance;
}
