import { BorderToken } from '../../../types';
import { Indexes, OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';
import { BorderMapping, ThemeUiTypes } from '../to-theme-ui.type';
import { formatName } from './index';

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
  borderStyle?: BorderToken['value']['type'];
}

export const generate = <T extends Pick<BorderToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  const { type, width, radii } = token.value;
  const { measure, unit } = width.value;
  const style = type.toLowerCase();
  const result: ThemeUiBorder = {
    borderWidths: {
      [name]: `${measure}${unit}`,
    },
  };

  if (style && style !== 'none') {
    result.borderStyles = {
      [name]: style as BorderToken['value']['type'],
    };
  }

  if (radii && radii.value) {
    result.radii = {
      [name]: radii?.value.measure,
    };
  }

  return result;
};

export const generateVariants = (
  themeUiTokens: Partial<Record<ThemeUiTypes, any>>,
  borders: Array<BorderToken>,
  options: OptionsType,
  transformNameFn: Function,
) => {
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
};
