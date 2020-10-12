import { OpacityToken } from '../../../types';
import { FormatTokenType } from '../to-jss.parser';

export class Opacity extends OpacityToken {
  constructor(token: Partial<OpacityToken>) {
    super(token);
  }
  toJss({ opacityFormat = 'string' }: FormatTokenType) {
    const value = this.value.opacity / 100;
    return opacityFormat === 'number' ? value : `'${value}'`;
  }
}
