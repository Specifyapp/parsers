import * as _ from 'lodash';

import { FormatName } from '../to-tailwind.type';

export function getNameFormatterFunction(format: FormatName = 'camelCase') {
  return _[format];
}
