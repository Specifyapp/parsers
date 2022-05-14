import { DepthToken } from '../../../types';

export class Depth extends DepthToken {
  constructor(token: Partial<DepthToken>) {
    super(token);
  }

  toScss() {
    return JSON.stringify(this.value.depth);
  }
}
