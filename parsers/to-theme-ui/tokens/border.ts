import { BorderToken } from '../../../types';
import { Indexes, OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';
import { ThemeUiBorder, ThemeUiBorderVariant, ThemeUiKeys } from '../to-theme-ui.type';
import { formatName } from './index';
import * as Belt from '@mobily/ts-belt';

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
  themeUiTokens: ThemeUiBorder,
  borders: Array<BorderToken>,
  options: OptionsType,
) => {
  return Belt.D.merge(themeUiTokens, {
    border: Belt.A.reduce(borders, {}, (acc, border) => {
      const variantValue: ThemeUiBorderVariant = {};

      if (border.value.color) {
        variantValue.borderColor =
          border.value.color &&
          'id' in border.value.color &&
          Indexes.Instance.list.colors?.[border.value.color.id]
            ? (Indexes.Instance.list.colors[border.value.color.id] as string)
            : tinycolor(border.value.color.value).toString(
                options?.formatTokens?.colorFormat?.format || 'rgb',
              );
      }

      if (border.value.width) {
        variantValue.borderWidth =
          border.value.width &&
          'id' in border.value.width &&
          Indexes.Instance.list.sizes?.[border.value.width.id]
            ? Indexes.Instance.list.sizes[border.value.width.id]
            : `${border.value.width.value.measure}${border.value.width.value.unit}`;
      }

      if (border.value.radii) {
        variantValue.borderRadius =
          border.value.radii &&
          'id' in border.value.radii &&
          Indexes.Instance.list.sizes?.[border.value.radii.id]
            ? Indexes.Instance.list.sizes[border.value.radii.id]
            : `${border.value.radii.value.measure}${border.value.radii.value.unit}`;
      }

      if (border.value.type) {
        variantValue.borderStyle = border.value.type;
      }

      return Belt.D.merge(acc, { [formatName(border.name, options?.formatName)]: variantValue });
    }),
  });
  // borders.forEach(spToken => {
  //   const variantValue: ThemeUiBorderVariant = {};
  //   if (spToken.value.color) {
  //     variantValue.borderColor =
  //       spToken.value.color &&
  //       'id' in spToken.value.color &&
  //       Indexes.Instance.list.colors?.[spToken.value.color.id]
  //         ? (Indexes.Instance.list.colors[spToken.value.color.id] as string)
  //         : tinycolor(spToken.value.color.value).toString(
  //             options?.formatTokens?.colorFormat?.format || 'rgb',
  //           );
  //   }
  //
  //   if (spToken.value.width) {
  //     variantValue.borderWidth =
  //       spToken.value.width &&
  //       'id' in spToken.value.width &&
  //       Indexes.Instance.list.sizes?.[spToken.value.width.id]
  //         ? Indexes.Instance.list.sizes[spToken.value.width.id]
  //         : `${spToken.value.width.value.measure}${spToken.value.width.value.unit}`;
  //   }
  //
  //   if (spToken.value.radii) {
  //     variantValue.borderRadius =
  //       spToken.value.radii &&
  //       'id' in spToken.value.radii &&
  //       Indexes.Instance.list.sizes?.[spToken.value.radii.id]
  //         ? Indexes.Instance.list.sizes[spToken.value.radii.id]
  //         : `${spToken.value.radii.value.measure}${spToken.value.radii.value.unit}`;
  //   }
  //
  //   if (spToken.value.type) {
  //     variantValue.borderStyle = spToken.value.type;
  //   }
  //
  //   themeUiTokens.border[transformNameFn(spToken.name)] = variantValue;
  // });
};
