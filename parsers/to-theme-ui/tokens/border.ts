import { BorderToken } from '../../../types';
import { Indexes, OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';
import { BorderMapping, ThemeUiTypes } from '../to-theme-ui.type';

interface ThemeUiBorder extends Partial<Record<BorderMapping, any>> {
  border?: Record<string, any>;
  borderStyles?: Record<string, BorderToken['value']['type']>;
  borderWidths?: Record<string, string>;
  radii?: Record<string, number>;
}

interface ThemeUiBorderVariant {
  borderWidth?: string | number;
  borderColor?: string;
  borderRadius?: string | number;
  borderStyle?: Border['value']['type'];
}

export class Border extends BorderToken {
  transformedName: string;
  constructor(token: Partial<BorderToken>, transformedNameFn: Function) {
    super(token);
    this.transformedName = transformedNameFn(token.name);
  }

  generate(): ThemeUiBorder {
    const { type, width, radii } = this.value;
    const { measure, unit } = width.value;
    const style = type.toLowerCase();
    const result: ThemeUiBorder = {
      borderWidths: {
        [this.transformedName]: `${measure}${unit}`,
      },
    };

    if (style && style !== 'none') {
      result.borderStyles = {
        [this.transformedName]: style as BorderToken['value']['type'],
      };
    }

    if (radii && radii.value) {
      result.radii = {
        [this.transformedName]: radii?.value.measure,
      };
    }

    return result;
  }

  static generateVariants(
    themeUiTokens: Partial<Record<ThemeUiTypes, any>>,
    borders: Array<BorderToken>,
    options: OptionsType,
    transformNameFn: Function,
  ) {
    themeUiTokens.border = {};

    borders.forEach(spToken => {
      const variantValue: ThemeUiBorderVariant = {};
      if (spToken.value.color) {
        variantValue.borderColor =
          spToken.value.color &&
          'id' in spToken.value.color &&
          Indexes.Instance.list.colors?.[spToken.value.color.id]
            ? (Indexes.Instance.list.colors[spToken.value.color.id] as string)
            : tinycolor(spToken.value.color.value).toString(
                options?.formatTokens?.colorFormat?.format || 'rgb',
              );
      }

      if (spToken.value.width) {
        variantValue.borderWidth =
          spToken.value.width &&
          'id' in spToken.value.width &&
          Indexes.Instance.list.sizes?.[spToken.value.width.id]
            ? Indexes.Instance.list.sizes[spToken.value.width.id]
            : `${spToken.value.width.value.measure}${spToken.value.width.value.unit}`;
      }

      if (spToken.value.radii) {
        variantValue.borderRadius =
          spToken.value.radii &&
          'id' in spToken.value.radii &&
          Indexes.Instance.list.sizes?.[spToken.value.radii.id]
            ? Indexes.Instance.list.sizes[spToken.value.radii.id]
            : `${spToken.value.radii.value.measure}${spToken.value.radii.value.unit}`;
      }

      if (spToken.value.type) {
        variantValue.borderStyle = spToken.value.type;
      }

      themeUiTokens.border[transformNameFn(spToken.name)] = variantValue;
    });
  }
}
