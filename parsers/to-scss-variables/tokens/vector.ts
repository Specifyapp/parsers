import { VectorToken } from '../../../types';

export class Vector extends VectorToken {
  constructor(token: Partial<VectorToken>) {
    super(token);
  }

  toScss() {
    return JSON.stringify(this.value.url);
  }
}
