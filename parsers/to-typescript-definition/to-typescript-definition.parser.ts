import { IToken, TokensType } from '../../types';
import { LibsType } from '../global-libs';

const DEFAULT_FORMAT = 'kebabCase';
type format = 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase' | 'none';

export type OutputDataType = string;
export type InputDataType = Array<Pick<IToken, 'name' | 'type'> & Record<string, any>>;
export type OptionsType =
  | Partial<{
      formatName: format;
      typesNamesMapping: Partial<
        {
          [k in TokensType]: string;
        }
      >;
    }>
  | undefined;

type groupedByType = Partial<{ [k in TokensType]: string[] }>;

export default async function toTypescriptDefinition(
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  const applyFormat = (str: string, fn?: format) => {
    if (fn && fn !== 'none') return _[fn](str);
    return str.includes(' ') || str.includes('\n') || str.includes('/') ? JSON.stringify(str) : str;
  };

  const grouped = tokens.reduce<groupedByType>((acc, current) => {
    if (!acc[current.type])
      return {
        ...acc,
        [current.type]: [current.name],
      };
    else {
      return {
        ...acc,
        [current.type]: [...(acc[current.type] as string[]), current.name],
      };
    }
  }, {});

  return Object.entries(grouped).reduce<string>((acc, [key, values]) => {
    const name = options?.typesNamesMapping?.[key as TokensType] ?? key;

    return `${acc}export type ${name} = ${values
      .map(v => `'${applyFormat(v, options?.formatName ?? DEFAULT_FORMAT)}'`)
      .join(' | ')}\n\n`;
  }, '');
}
