import { FormatName } from '../to-tailwind.type';
import { LibsType } from '../../global-libs';

let formatterFn: ((a: string) => string) | null = null;

export function initFormatterFunction(_: LibsType['_'], format: FormatName = 'camelCase') {
  formatterFn = _[format];
}

export function getNameFormatterFunction() {
  if (!formatterFn) {
    throw new Error('Formatter function is not initialized');
  }
  return formatterFn;
}
