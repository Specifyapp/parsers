import { GradientValue } from '../../../types';
import tinycolor from 'tinycolor2';
import { OptionsType } from '../to-scss-map.parser';
import { sortObjectByKey } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

const handler: ScssMapHandlerType = {
  name: 'gradient',
  run: (value, options: OptionsType) => {
    const { gradients } = value as GradientValue;
    return gradients
      .map(gradient => {
        return `linear-gradient(${gradient.angle}, ${gradient.colors
          .map(
            ({ color, position }) =>
              `${tinycolor(color.value).toString(
                options?.formatTokens?.color?.format || 'rgb',
              )} ${position}%`,
          )
          .join(', ')})`;
      })
      .join(', ');
  },
  sort(list: Record<string, any>) {
    return sortObjectByKey(list);
  },
};

export default handler;
