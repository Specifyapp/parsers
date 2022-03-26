import listPathsByPattern from '../../libs/list-paths-by-pattern';
import { get, set } from 'lodash';

export type InputDataType = Array<Record<string, any>>;
export type OptionsType =
  | undefined
  | {
      keys: Array<string>; // default []
      precision?: number; // default 0
      mode?: 'down' | 'up' | 'auto'; // default auto
    };

const defaultOptions = { keys: [], precision: 0, mode: 'auto' };

export async function roundNumber<T extends InputDataType>(tokens: T, options: OptionsType) {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return tokens.map(token => {
    mergedOptions.keys.forEach(pattern => {
      const paths = listPathsByPattern(token, pattern);
      paths.forEach(selector => {
        const originalValue = get(token, selector);

        const roundFunction =
          mergedOptions.mode === 'auto'
            ? Math.round
            : mergedOptions.mode === 'up'
            ? Math.ceil
            : Math.floor;

        const factor = Math.pow(10, mergedOptions.precision);
        set(token, selector, roundFunction(originalValue * factor) / factor);
      });
    });

    return token;
  });
}
