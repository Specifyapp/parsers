import { FontToken } from '../../../types/tokens/Font';

export class Font extends FontToken {
  constructor(token: Partial<FontToken>) {
    super(token);
  }
  toReactNative() {
    return `'${this.value.fontPostScriptName}'`;
  }
}
