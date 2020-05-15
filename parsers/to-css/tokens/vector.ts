import { VectorToken } from '@specifyapp/types';

export class Vector extends VectorToken {
  constructor() {
    super();
  }

  toCss() {
    return JSON.stringify(this.value.url);
  }
}
