import { DepthToken } from '@specifyapp/types';

export class Depth extends DepthToken {
  constructor() {
    super();
  }

  toCss() {
    return JSON.stringify(this.value.depth);
  }
}
