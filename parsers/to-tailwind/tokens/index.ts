import { Token } from '../../../types';
import Template from '../../../libs/template';
import * as _ from 'lodash';
import { pascalCase } from 'lodash';
import { getNameFormatterFunction } from '../utils/getNameFormatterFunction';
import { TailwindType } from '../to-tailwind.type';
import { OptionsType } from '../to-tailwind.parser';
import { getClassNameAsCSSVariable } from '../utils/getClassNameAsCSSVariable';

export * from './color';
export * from './gradient';
export * from './shadow';
export * from './textStyle';
export * from './opacity';
export * from './depth';
export * from './duration';
export * from './border';
export * from './measurement';

export abstract class Utils {
  static parseFloatIfString(value: string | number) {
    return typeof value === 'string' ? parseFloat(value) : value;
  }

  static sortObjectByValue<T>(obj: T) {
    return Object.entries(obj)
      .sort(([, a], [, b]) => this.parseFloatIfString(a) - this.parseFloatIfString(b))
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  }

  static getTemplatedTokenName(token: Partial<Token>, template: string | undefined) {
    if (template) {
      const templateInstance = new Template(template);
      return templateInstance.render(token);
    }
    return token.name!;
  }

  static getValue(key: string, value: unknown, options: OptionsType) {
    if (options?.formatConfig?.useVariables) {
      return getClassNameAsCSSVariable(String(key), options.formatName);
    }

    return value
  }

  static go<T>(token: T, options: OptionsType, tailwindKey: TailwindType, value: unknown) {
    const keyName = this.getTemplatedTokenName(token, options?.renameKeys?.[tailwindKey]);
    const keys = [...(options?.splitBy ? keyName.split(new RegExp(options.splitBy)) : [keyName])];

    const key = keys.map(k => getNameFormatterFunction(options?.formatName)(k)).join('.');
    const val = Utils.getValue(key, value, options);

    return _.setWith({}, key, val, Object);
  }
}
