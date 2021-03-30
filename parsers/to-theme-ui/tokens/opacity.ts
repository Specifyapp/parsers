import { OpacityToken } from '../../../types';
import { OptionsType } from '../to-theme-ui.parser';
import { Utils } from './index';
import { OpacityMapping } from '../to-theme-ui.type';

interface ThemeUiOpacities extends Partial<Record<OpacityMapping, any>> {
  opacities: Array<string | number>;
}

export class Opacity extends OpacityToken {
  transformedName: string;
  constructor(token: Partial<OpacityToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }
  generate(options: OptionsType): ThemeUiOpacities {
    let opacity: number | string = this.value.opacity;
    const opacityType = options?.formatTokens?.opacityFormat?.type || 'number';
    const opacityUnit = options?.formatTokens?.opacityFormat?.unit || 'none';
    if (opacityUnit === 'percent') {
      opacity = `${opacity}%`;
    } else if (opacityType === 'string') {
      opacity = `${opacity / 100}`;
    } else {
      opacity = opacity / 100;
    }
    return { opacities: [opacity] };
  }

  static afterGenerate(tokens: ThemeUiOpacities) {
    if (tokens.opacities) tokens.opacities = Utils.deduplicateAndSortList(tokens.opacities);
    return tokens;
  }
}
