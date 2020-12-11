import { LibsType } from '../global-libs';
import { extname } from 'path';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>;
      excludeFileExtension?: boolean;
    };

export default async function (
  tokens: InputDataType,
  options: OptionsType = { keys: ['name'] },
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  try {
    return tokens.map(token => {
      options.keys.forEach(key => {
        if (_.has(token, key)) {
          if (options.excludeFileExtension) {
            const tokenExtension = extname(_.get(token, key));
            const tokenName = _.get(token, key).replace(tokenExtension, '');
            return _.set(
              token,
              key,
              `${_.flow(_.camelCase, _.upperFirst)(tokenName)}${tokenExtension}`,
            );
          }
          return _.set(token, key, _.flow(_.camelCase, _.upperFirst)(_.get(token, key)));
        }
      });
      return token;
    });
  } catch (err) {
    throw err;
  }
}
