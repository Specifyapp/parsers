import { FontToken } from '../../../types';
import { Utils } from './index';
import { FontMapping } from '../to-theme-ui.type';
import { Indexes } from '../to-theme-ui.parser';

interface ThemeUiFont extends Partial<Record<FontMapping, any>> {
  fonts?: Record<string, string>;
  fontWeights?: Record<string, string | number>;
}

export class Font extends FontToken {
  transformedName: string;
  constructor(token: Partial<FontToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }

  static afterGenerate(tokens: ThemeUiFont) {
    tokens.fonts = Utils.sortObject(tokens.fonts!);
    return tokens;
  }

  generate(): ThemeUiFont {
    const result: ThemeUiFont = {
      fonts: {
        [this.transformedName]: this.name,
      },
    };
    result.fontWeights = { [this.transformedName]: this.value.fontWeight };
    Indexes.Instance.add('fontWeights', this.id, this.transformedName, this.value.fontWeight);
    Indexes.Instance.add('fonts', this.id, this.transformedName);
    return result;
  }
}
