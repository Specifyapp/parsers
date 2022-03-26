import { MeasurementToken, TextStyleToken } from '../../../types';
import convertMeasurement from '../../../libs/size-manipulation';
import { ThemeUiTypes } from '../to-theme-ui.type';
import { deduplicateAndSortList, formatName, sortObject } from './index';
import { FormatTokenType, Indexes, OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';
import * as Belt from '@mobily/ts-belt';

export interface ThemeUiTextStyle extends Partial<Record<ThemeUiTypes, any>> {
  fontSizes: Array<number | string>;
  letterSpacings?: Record<string, number | string>;
  lineHeights?: Record<string, number | string>;
  fontWeights?: Record<string, string | number>;
}

type ComputeParamsFn = {
  spToken: TextStyleToken;
  themeUiTokens?: Partial<Record<ThemeUiTypes, any>>;
  options?: OptionsType;
};

function getLetterSpacings(token: Pick<TextStyleToken, 'value' | 'name' | 'id'> & object) {
  const ls = token.value.letterSpacing;
  if (ls) return `${ls.value.measure}${ls.value.unit}`;
}
function getLineHeights(token: Pick<TextStyleToken, 'value' | 'name' | 'id'> & object) {
  const lh = token.value.lineHeight;
  if (lh) return `${lh.value.measure}${lh.value.unit}`;
}

function getFontSizes(
  token: Pick<TextStyleToken, 'value' | 'name' | 'id'> & object,
  fontFormat: FormatTokenType['fontSizeFormat'],
) {
  const fontSizeType = fontFormat?.type || 'number';
  const fontSize = token.value.fontSize;
  if (fontFormat?.unit && token.value.fontSize.value.unit !== fontFormat?.unit) {
    token.value.fontSize.value = convertMeasurement(token.value.fontSize.value, fontFormat?.unit);
  }
  return fontSizeType === 'number'
    ? [fontSize.value.measure]
    : [`${fontSize.value.measure}${fontSize.value.unit}`];
}

export const generate = <T extends Pick<TextStyleToken, 'value' | 'name' | 'id'> & object>(
  token: T,
  options: OptionsType,
) => {
  const name = formatName(token.name, options?.formatName);
  let result: ThemeUiTextStyle = {
    fontSizes: getFontSizes(token, options?.formatTokens?.fontSizeFormat),
  };
  const letterSpacing = getLetterSpacings(token);
  if (Belt.G.isNotNullable(letterSpacing)) {
    Belt.D.set(result, 'letterSpacings', { [name]: letterSpacing });
  }

  const lineHeight = getLineHeights(token);
  if (lineHeight) {
    result = Belt.D.set(result, 'lineHeights', { [name]: lineHeight });
  }

  if (options?.variants) {
    if (lineHeight) {
      Indexes.Instance.add('lineHeights', lineHeight, name);
    }
    if (letterSpacing) {
      Indexes.Instance.add('letterSpacings', letterSpacing, name);
    }

    // if (!('id' in token.value.fontSize)) {
    //   const fontSizeToken: Pick<FontToken, 'value' | 'type' | 'name' | 'id'> = {
    //     id: `temp-fontSize-${token.id}`,
    //     name: `temp-fontSize-${token.id}`,
    //     type: 'font',
    //     value: token.value.fontSize.value,
    //   };
    //   allTokens.push(fontSizeToken);
    //   token.value.fontSize = fontSizeToken;
    //   Indexes.Instance.add('fontSizes', fontSizeToken.id, result.fontSizes[0]);
    // }
  }

  return result;
};

export const afterGenerate = (themeUiTokens: Record<ThemeUiTypes, any>) => {
  if (themeUiTokens.fontSizes)
    themeUiTokens.fontSizes = deduplicateAndSortList(themeUiTokens.fontSizes);

  if (themeUiTokens.fontWeights) themeUiTokens.fontWeights = sortObject(themeUiTokens.fontWeights);

  if (themeUiTokens.lineHeights) themeUiTokens.lineHeights = sortObject(themeUiTokens.lineHeights);

  if (themeUiTokens.letterSpacings)
    themeUiTokens.letterSpacings = sortObject(themeUiTokens.letterSpacings);

  return themeUiTokens;
};

// export const generateVariants = (
//   themeUiTokens: Partial<Record<ThemeUiTypes, any>>,
//   textStyles: Array<TextStyleToken>,
//   options: OptionsType,
//   transformNameFn: Function,
// ) => {
//   themeUiTokens.text = {};
//
//   textStyles.forEach(spToken => {
//     const variantValue: Record<string, string | number> = {};
//
//     if (spToken.value.font) {
//       variantValue.fontFamily =
//         'id' in spToken.value?.font && Indexes.Instance.list.fonts?.[spToken.value.font.id]
//           ? Indexes.Instance.list.fonts[spToken.value.font.id]
//           : spToken.value.font.value.fontPostScriptName;
//     }
//
//     if (spToken.value.textTransform) variantValue.textTransform = spToken.value.textTransform;
//
//     if (spToken.value.letterSpacing) {
//       variantValue.letterSpacing = computeLetterSpacing({ spToken });
//     }
//
//     if (spToken.value.lineHeight) {
//       variantValue.lineHeight = computeLineHeight({ spToken });
//     }
//
//     if (spToken.value.textIndent) {
//       variantValue.textIndent = computeTextIndent({ spToken });
//     }
//
//     if (spToken.value.fontSize) {
//       variantValue.fontSize = computeFontSize({ spToken, themeUiTokens });
//     }
//
//     if (spToken.value.font?.value?.fontWeight) {
//       variantValue.fontWeight = computeFontWeight({ spToken });
//     }
//
//     if (spToken.value.color) {
//       variantValue.color = computeColor({ spToken, options });
//     }
//
//     if (spToken.value.textAlign?.horizontal) {
//       variantValue.textAlign = spToken.value.textAlign.horizontal;
//     }
//     if (spToken.value.textAlign?.vertical) {
//       variantValue.verticalAlign = spToken.value.textAlign.vertical;
//     }
//     if (spToken.value.textTransform) {
//       variantValue.textTransform = spToken.value.textTransform;
//     }
//     if (spToken.value.textDecoration) {
//       variantValue.textDecoration = spToken.value.textDecoration.join(' ');
//     }
//     if (spToken.value.fontVariant) {
//       variantValue.fontVariant = spToken.value.fontVariant.join(' ');
//     }
//
//     themeUiTokens.text[transformNameFn(spToken.name)] = variantValue;
//   });
//   return themeUiTokens;
// };

const computeLetterSpacing = ({ spToken }: ComputeParamsFn) => {
  const letterSpacing = `${spToken.value.letterSpacing!.value.measure}${
    spToken.value.letterSpacing!.value.unit
  }`;
  if (Indexes.Instance.list.letterSpacings?.[letterSpacing]) {
    return Indexes.Instance.list.letterSpacings[letterSpacing];
  } else if (
    'id' in spToken.value.letterSpacing! &&
    Indexes.Instance.list.letterSpacings?.[spToken.value.letterSpacing.id]
  ) {
    return Indexes.Instance.list.letterSpacings[spToken.value.letterSpacing.id];
  }
  return letterSpacing;
};

const computeLineHeight = ({ spToken }: ComputeParamsFn) => {
  const lineHeight = `${spToken.value.lineHeight.value.measure}${spToken.value.lineHeight.value.unit}`;

  if (Indexes.Instance.list.lineHeights?.[lineHeight]) {
    return Indexes.Instance.list.lineHeights[lineHeight];
  } else if (
    'id' in spToken.value.lineHeight! &&
    Indexes.Instance.list.lineHeights?.[spToken.value.lineHeight.id]
  ) {
    return Indexes.Instance.list.lineHeights[spToken.value.lineHeight.id];
  }
  return lineHeight;
};

const computeFontWeight = ({ spToken }: ComputeParamsFn) => {
  const fontWeight = spToken.value.font.value.fontWeight;
  if (Indexes.Instance.list.fontWeights?.[fontWeight]) {
    return Indexes.Instance.list.fontWeights[fontWeight];
  } else if (
    spToken.value.font.value.fontWeight &&
    'id' in spToken.value.font &&
    Indexes.Instance.list.fontWeights?.[spToken.value.font.id]
  ) {
    return Indexes.Instance.list.fontWeights[spToken.value.font.id];
  }
  return fontWeight;
};

const computeColor = ({ spToken, options }: ComputeParamsFn) => {
  const color = spToken.value.color!;
  if (
    spToken.value.color &&
    'id' in spToken.value.color &&
    Indexes.Instance.list.colors?.[spToken.value.color.id]
  ) {
    return Indexes.Instance.list.colors[spToken.value.color.id];
  }
  return tinycolor(color.value).toString(options?.formatTokens?.colorFormat?.format || 'rgb');
};

const computeFontSize = ({ spToken, themeUiTokens }: ComputeParamsFn) => {
  const fontSize = `${spToken.value.fontSize.value.measure}${spToken.value.fontSize.value.unit}`;
  if (Indexes.Instance.list.fontSizes?.[fontSize]) {
    return Indexes.Instance.list.fontSizes[fontSize];
  } else if (
    spToken.value.fontSize &&
    'id' in spToken.value.fontSize &&
    Indexes.Instance.list.fontSizes?.[spToken.value.fontSize.id]
  ) {
    return (themeUiTokens!.fontSizes as NonNullable<ThemeUiTextStyle['fontSizes']>).findIndex(
      fontSize =>
        fontSize ===
        Indexes.Instance.list.fontSizes![(spToken.value.fontSize as MeasurementToken).id],
    );
  }
  return fontSize;
};

const computeTextIndent = ({ spToken }: ComputeParamsFn) => {
  const textIndent = `${spToken.value.textIndent!.value.measure}${
    spToken.value.textIndent!.value.unit
  }`;

  if (
    'id' in spToken.value.textIndent! &&
    Indexes.Instance.list.sizes?.[spToken.value.textIndent.id]
  ) {
    return Indexes.Instance.list.sizes[spToken.value.textIndent.id];
  }
  return textIndent;
};
