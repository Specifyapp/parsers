import tokens from './fixtures/seeds.json';
import { ExtractTokenByType, Token, TokensType } from '../types';
import * as Belt from '@mobily/ts-belt';
export const seeds = <A extends TokensType>(types?: Array<A>): Array<ExtractTokenByType<A>> => {
  return (tokens as Array<Token>).filter((token): token is ExtractTokenByType<A> =>
    types ? Belt.A.includes<TokensType>(types, token.type) : true,
  );
};
