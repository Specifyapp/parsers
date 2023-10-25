import { FormatName } from '../to-tailwind.type';
import { getNameFormatterFunction } from './getNameFormatterFunction';

export function getClassNameAsCSSVariable(str: string, format: FormatName = 'camelCase') {
  const transformNameFn = getNameFormatterFunction(format);
  const formatted = transformNameFn(str);

  return `var(--${formatted.replace('/', '')})`;
}
