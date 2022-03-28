import { DepthToken } from '../../../types/tokens/Depth';

export class Depth extends DepthToken {
  constructor(token: Partial<DepthToken>) {
    super(token);
  }

  private shadowHelper(elevation: number) {
    return {
      elevation,
      shadowOpacity: 0.0015 * elevation + 0.18,
      shadowRadius: 0.54 * elevation,
      shadowOffset: {
        width: 0.6 * elevation,
        height: 0.6 * elevation,
      },
    };
  }

  toReactNative() {
    return JSON.stringify(this.shadowHelper(this.value.depth));
  }
}
