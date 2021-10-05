import { FontToken } from '../../../types';

export class Font extends FontToken {
  constructor(token: Partial<FontToken>) {
    super(token);
  }
  toReactNative() {
    return `'${this.value.fontPostScriptName}'`;
  }
}
