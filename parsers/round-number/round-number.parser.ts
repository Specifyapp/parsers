import { LibsType } from '../global-libs';
import listPathsByPattern from '../../libs/list-paths-by-pattern';

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>; // default []
      precision?: number; // default 0
      mode?: 'down' | 'up' | 'auto'; // default auto
    };

const defaultOptions = { keys: [], precision: 0, mode: 'auto' };

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return tokens.map(token => {
    mergedOptions.keys.forEach(pattern => {
      const paths = listPathsByPattern(token, pattern);
      paths.forEach(selector => {
        const originalValue = _.get(token, selector);

        const roundFunction =
          mergedOptions.mode === 'auto'
            ? Math.round
            : mergedOptions.mode === 'up'
            ? Math.ceil
            : Math.floor;

        const factor = Math.pow(10, mergedOptions.precision);
        _.set(token, selector, roundFunction(originalValue * factor) / factor);
      });
    });

    return token;
  });
}
