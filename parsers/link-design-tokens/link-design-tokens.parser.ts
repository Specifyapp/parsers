import { IToken, LinkableTokensSignatures, TokensType } from '../../types';
import { LinkDesignTokenClass } from './link-design-tokens.type';
import * as _ from 'lodash';
import * as TokensClass from './tokens';

export type InputDataType = Array<IToken>;
export type OutputDataType = InputDataType;
export type OptionsType = {};

function getClassByType(type: string): LinkDesignTokenClass | undefined {
  const tokenClassName = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  return (<any>TokensClass)[tokenClassName];
}

export default async function (tokens: InputDataType): Promise<OutputDataType> {
  try {
    const tokensGroupedByType = _.groupBy(tokens, 'type') as Record<TokensType, InputDataType>;
    const types = Object.keys(tokensGroupedByType) as Array<TokensType>;

    // create indexes dictionary
    const indexes = types.reduce((indexes, type) => {
      const tokenHandler = getClassByType(type);
      if (!tokenHandler) return indexes;
      tokensGroupedByType[type].forEach(token => {
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
          ...tokensGroupedByType[type].map(token => {
            const instance = new tokenHandler(token);
            if (!instance.compute) return token;
            token.value = instance.compute(indexes, tokensGroupedByType);
            return token;
          }),
        );
      } else {
        acc.concat(tokensGroupedByType[type]);
      }
      return acc;
    }, [] as Array<IToken>);
  } catch (err) {
    throw err;
  }
}
