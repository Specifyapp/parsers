import { VectorToken } from '../../../types';

export class Vector extends VectorToken {
  constructor(token: Partial<VectorToken>) {
    super(token);
  }

  toJss() {
    return `'${this.value.url}'`;
  }
}
