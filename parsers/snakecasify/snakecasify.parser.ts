import { Token, AllowedFieldsWithType } from '@specifyapp/types';
import { is } from 'typescript-is';
import { defaultLibraryType } from '../global-libs';
import { getTypeExpectation } from '@specifyapp/get-expectation';

type ParserContext = {
  tokens: Array<Partial<Pick<Token, AllowedFieldsWithType<Token, string>>>>;
  options: null | {
    keys?: Array<AllowedFieldsWithType<Token, string>>;
  };
};

const parserName: string = 'snakecasify';

export default async function (
  tokens: ParserContext['tokens'],
  options: ParserContext['options'] = { keys: ['name'] },
  { _ }: defaultLibraryType,
): Promise<Array<Partial<Token>> | Error> {
  // if (!is<ParserContext['tokens']>(tokens)) {
  //   return Promise.reject({
  //     parser: parserName,
  //     message: 'Bad input value: tokens',
  //     actual: tokens,
  //     expected: getTypeExpectation<ParserContext['tokens']>(),
  //   });
  // }

  if (!is<ParserContext['options']>(options)) {
    return Promise.reject({
      parser: parserName,
      message: 'Bad input value: options',
      actual: options,
      expected: getTypeExpectation<ParserContext['options']>(),
    });
  }
  return tokens.map(token => {
    options.keys.forEach(key => {
      if (token[key]) token[key] = _.snakeCase(token[key]);
    });
    return token;
  });
}
