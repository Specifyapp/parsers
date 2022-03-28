import { LinkableTokensSignatures, Token, TokensType } from '../../types';
import { LinkDesignTokenClass } from './link-design-tokens.type';
import * as TokensClass from './tokens';
import { groupBy } from 'lodash';

export type InputDataType = Array<Token>;
export type OptionsType = undefined;

function getClassByType(type: string): LinkDesignTokenClass | undefined {
  const tokenClassName = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  return (<any>TokensClass)[tokenClassName];
}

export async function linkDesignTokens<T extends InputDataType>(tokens: T, options?: OptionsType) {
  try {
    const tokensGroupedByType = groupBy(tokens, 'type');
    const types = Object.keys(tokensGroupedByType) as Array<TokensType>;

    // create indexes dictionary
    const indexes = types.reduce((indexes, type) => {
      const tokenHandler = getClassByType(type);
      if (!tokenHandler) return indexes;
      tokensGroupedByType[type]!.forEach(token => {
        const instance = new tokenHandler(token);
        if (!instance.getSignature) return;
        const signatures = instance.getSignature();
        (Object.keys(signatures) as Array<keyof LinkableTokensSignatures>).forEach(key => {
          indexes[key] = { ...(indexes[key] || {}), ...signatures[key] };
        });
      });
      return indexes;
    }, {} as LinkableTokensSignatures);

    // replace value by matched token
    return types.reduce((acc, type) => {
      const tokenHandler = getClassByType(type);
      if (tokenHandler) {
        acc.push(
          ...tokensGroupedByType[type]!.map(token => {
            const instance = new tokenHandler(token);
            if (!instance.compute) return token;
            token.value = instance.compute(indexes, tokensGroupedByType);
            return token;
          }),
        );
      } else {
        acc.push(...tokensGroupedByType[type]!);
      }
      return acc;
    }, [] as Array<Token>);
  } catch (err) {
    throw err;
  }
}
