import { FontToken } from '@specifyapp/types';

export class Font extends FontToken {
  constructor() {
    super();
  }

  toCss() {
    return `${this.value.fontPostScriptName}`;
  }
}
