import tinycolor from 'tinycolor2';
import { GradientToken } from '../../../types';
import {
  GradientMappingBeforeWrapper,
  TailwindMappingTypes,
  TailwindType,
} from '../to-tailwind.type';
import * as os from 'os';

export class Gradient extends GradientToken {
  transformedName: string;
  static tailwindKeys: Array<TailwindType> = ['backgroundImage'];
  constructor(token: Partial<GradientToken>, transformNameFn: Function) {
    super(token);
    this.transformedName = transformNameFn(token.name);
  }

  generate(): GradientMappingBeforeWrapper {
    return {
      backgroundImage: {
        [this.transformedName]: this.value.gradients
          .map(gradient => {
            return `linear-gradient(${gradient.angle}, ${gradient.colors
              .map(
                ({ color, position }) => `${tinycolor(color.value).toString('hex')} ${position}%`,
              )
              .join(', ')})`;
          })
          .join(', '),
      },
    };
  }

  static afterStringGenerate(tailwindTokens: TailwindMappingTypes, str: string): string {
    return `
      ${str.slice(0, -1)}${Object.keys(tailwindTokens).length > 1 ? ',' : ''}
      ${os.EOL}
      backgroundImage: theme => (${JSON.stringify(tailwindTokens.backgroundImage)})
      ${os.EOL}
      }`;
  }
}
