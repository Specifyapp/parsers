import { FontToken } from '../../../types';

export class Font extends FontToken {
  constructor(token: Partial<FontToken>) {
    super(token);
  }
  toJss() {
    return `'${this.value.fontPostScriptName}'`;
  }
}
