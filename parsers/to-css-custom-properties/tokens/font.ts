import { FontToken } from '../../../types';

export class Font extends FontToken {
  constructor(token: Partial<FontToken>) {
    super(token);
  }
  toCss() {
    return `${this.value.fontPostScriptName}`;
  }
}
