import { DepthToken } from '@specifyapp/types';

export class Depth extends DepthToken {
  constructor(token: Partial<DepthToken>) {
    super(token);
  }

  toCss() {
    return JSON.stringify(this.value.depth);
  }
}
