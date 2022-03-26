import * as _ from 'lodash';
import { OptionsType } from '../to-theme-ui.parser';

export const parseFloatIfString = (value: string | number) => {
  return typeof value === 'string' ? parseFloat(value) : value;
};

export const sortObject = (obj: Record<string, string | number>) => {
  return Object.entries(obj)
    .sort(([, a], [, b]) => parseFloatIfString(a) - parseFloatIfString(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
};

export const deduplicateAndSortList = (list: Array<string | number>) => {
  return [...new Set(list)].sort((a, b) => parseFloatIfString(a) - parseFloatIfString(b));
};

export const formatName = (
  name: string,
  format: NonNullable<OptionsType>['formatName'] = 'camelCase',
) => {
  return _[format](name);
};
