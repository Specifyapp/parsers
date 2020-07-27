import { VectorToken } from '@specifyapp/types';

export class Vector extends VectorToken {
  constructor(token: Partial<VectorToken>) {
    super(token);
  }

  toCss() {
    return JSON.stringify(this.value.url);
  }
}
