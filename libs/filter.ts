import { AtLeast, TokensType, TokenTypeFromTokenTypeName } from '../types';

export function filter<T extends TokensType>(
  tokens: Array<AtLeast<{ type: TokensType }>>,
  type: T,
) {
  return tokens.filter(token => token.type === type) as Array<TokenTypeFromTokenTypeName<T>>;
}
