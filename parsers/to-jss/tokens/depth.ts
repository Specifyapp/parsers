import { DepthToken } from '../../../types';
import { FormatTokenType } from '../to-jss.parser';

export class Depth extends DepthToken {
  constructor(token: Partial<DepthToken>) {
    super(token);
  }

  toJss({ depthFormat = 'string' }: FormatTokenType) {
    return depthFormat === 'number' ? this.value.depth : `'${this.value.depth}'`;
  }
}
