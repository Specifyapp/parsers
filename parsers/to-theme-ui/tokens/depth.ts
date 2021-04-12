import { DepthToken } from '../../../types';
import { DepthMapping } from '../to-theme-ui.type';
import { Utils } from './index';

interface ThemeUiDepth extends Partial<Record<DepthMapping, any>> {
  zIndices: Record<string, number>;
}

export class Depth extends DepthToken {
  transformedName: string;
  constructor(token: Partial<DepthToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }

  generate(): ThemeUiDepth {
    return {
      zIndices: {
        [this.transformedName]: this.value.depth,
      },
    };
  }

  static afterGenerate(tokens: ThemeUiDepth) {
    tokens.zIndices = Utils.sortObject(tokens.zIndices);
    return tokens;
  }
}
