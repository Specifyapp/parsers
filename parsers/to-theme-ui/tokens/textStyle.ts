import { MeasurementToken, TextStyleToken } from '../../../types';
import convertMeasurement from '../../../libs/size-manipulation';
import { formatName } from './index';
import { FormatTokenType, Indexes, OptionsType } from '../to-theme-ui.parser';
import tinycolor from 'tinycolor2';
import * as Belt from '@mobily/ts-belt';
import { ThemeUiObject, ThemeUiTextStyle } from '../to-theme-ui.type';

type ComputeParamsFn = {
  textStyle: TextStyleToken;
  themeUiTokens?: ThemeUiTextStyle;
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
  presets: ThemeUiObject,
) => {
  const name = formatName(token.name, options?.formatName);
  let result: ThemeUiTextStyle = {};

  if (
    typeof options?.presets?.fontSizes?.freeze !== 'boolean' ||
    options?.presets?.fontSizes?.freeze === false
  ) {
    result = Belt.D.set(
      result,
      'fontSizes',
      Belt.A.concat(
        presets.fontSizes ?? [],
        getFontSizes(token, options?.formatTokens?.fontSizeFormat),
      ),
    );
  }
  const letterSpacing = getLetterSpacings(token);
  if (Belt.G.isNotNullable(letterSpacing)) {
    result = Belt.D.set(result, 'letterSpacings', { [name]: letterSpacing });
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
  }

  return result;
};

export const generateVariants = (
  themeUiTokens: ThemeUiTextStyle,
  textStyles: Array<TextStyleToken>,
  options: OptionsType,
) => {
  return Belt.D.merge(themeUiTokens, {
    text: Belt.A.reduce(textStyles, {}, (acc, textStyle) => {
      const variantValue: Record<string, string | number> = {};

      if (textStyle.value.font) {
        variantValue.fontFamily =
          'id' in textStyle.value?.font && Indexes.Instance.list.fonts?.[textStyle.value.font.id]
            ? Indexes.Instance.list.fonts[textStyle.value.font.id]!
            : textStyle.value.font.value.fontPostScriptName;
      }

      if (textStyle.value.textTransform) variantValue.textTransform = textStyle.value.textTransform;

      if (textStyle.value.letterSpacing) {
        variantValue.letterSpacing = computeLetterSpacing({ textStyle })!;
      }

      if (textStyle.value.lineHeight) {
        variantValue.lineHeight = computeLineHeight({ textStyle })!;
      }

      if (textStyle.value.textIndent) {
        variantValue.textIndent = computeTextIndent({ textStyle })!;
      }

      if (textStyle.value.fontSize) {
        variantValue.fontSize = computeFontSize({ textStyle, themeUiTokens })!;
      }

      if (textStyle.value.font?.value?.fontWeight) {
        variantValue.fontWeight = computeFontWeight({ textStyle })!;
      }

      if (textStyle.value.color) {
        variantValue.color = computeColor({ textStyle, options })!;
      }

      if (textStyle.value.textAlign?.horizontal) {
        variantValue.textAlign = textStyle.value.textAlign.horizontal;
      }
      if (textStyle.value.textAlign?.vertical) {
        variantValue.verticalAlign = textStyle.value.textAlign.vertical;
      }
      if (textStyle.value.textTransform) {
        variantValue.textTransform = textStyle.value.textTransform;
      }
      if (textStyle.value.textDecoration) {
        variantValue.textDecoration = textStyle.value.textDecoration.join(' ');
      }
      if (textStyle.value.fontVariant) {
        variantValue.fontVariant = textStyle.value.fontVariant.join(' ');
      }

      return Belt.D.merge(acc, { [formatName(textStyle.name, options?.formatName)]: variantValue });
    }),
  });
};

const computeLetterSpacing = ({ textStyle }: ComputeParamsFn) => {
  const letterSpacing = `${textStyle.value.letterSpacing!.value.measure}${
    textStyle.value.letterSpacing!.value.unit
  }`;
  if (Indexes.Instance.list.letterSpacings?.[letterSpacing]) {
    return Indexes.Instance.list.letterSpacings[letterSpacing];
  } else if (
    'id' in textStyle.value.letterSpacing! &&
    Indexes.Instance.list.letterSpacings?.[textStyle.value.letterSpacing.id]
  ) {
    return Indexes.Instance.list.letterSpacings[textStyle.value.letterSpacing.id];
  }
  return letterSpacing;
};

const computeLineHeight = ({ textStyle }: ComputeParamsFn) => {
  const lineHeight = `${textStyle.value.lineHeight.value.measure}${textStyle.value.lineHeight.value.unit}`;

  if (Indexes.Instance.list.lineHeights?.[lineHeight]) {
    return Indexes.Instance.list.lineHeights[lineHeight];
  } else if (
    'id' in textStyle.value.lineHeight! &&
    Indexes.Instance.list.lineHeights?.[textStyle.value.lineHeight.id]
  ) {
    return Indexes.Instance.list.lineHeights[textStyle.value.lineHeight.id];
  }
  return lineHeight;
};

const computeFontWeight = ({ textStyle }: ComputeParamsFn) => {
  const fontWeight = textStyle.value.font.value.fontWeight;
  if (Indexes.Instance.list.fontWeights?.[fontWeight]) {
    return Indexes.Instance.list.fontWeights[fontWeight];
  } else if (
    textStyle.value.font.value.fontWeight &&
    'id' in textStyle.value.font &&
    Indexes.Instance.list.fontWeights?.[textStyle.value.font.id]
  ) {
    return Indexes.Instance.list.fontWeights[textStyle.value.font.id];
  }
  return fontWeight;
};

const computeColor = ({ textStyle, options }: ComputeParamsFn) => {
  const color = textStyle.value.color!;
  if (
    textStyle.value.color &&
    'id' in textStyle.value.color &&
    Indexes.Instance.list.colors?.[textStyle.value.color.id]
  ) {
    return Indexes.Instance.list.colors[textStyle.value.color.id];
  }
  return tinycolor(color.value).toString(options?.formatTokens?.colorFormat?.format || 'rgb');
};

const computeFontSize = ({ textStyle, themeUiTokens }: ComputeParamsFn) => {
  const fontSize = `${textStyle.value.fontSize.value.measure}${textStyle.value.fontSize.value.unit}`;
  if (Indexes.Instance.list.fontSizes?.[fontSize]) {
    return Indexes.Instance.list.fontSizes[fontSize];
  } else if (
    textStyle.value.fontSize &&
    'id' in textStyle.value.fontSize &&
    Indexes.Instance.list.fontSizes?.[textStyle.value.fontSize.id]
  ) {
    return (themeUiTokens!.fontSizes as NonNullable<ThemeUiTextStyle['fontSizes']>).findIndex(
      fontSize =>
        fontSize ===
        Indexes.Instance.list.fontSizes![(textStyle.value.fontSize as MeasurementToken).id],
    );
  }
  return fontSize;
};

const computeTextIndent = ({ textStyle }: ComputeParamsFn) => {
  const textIndent = `${textStyle.value.textIndent!.value.measure}${
    textStyle.value.textIndent!.value.unit
  }`;

  if (
    'id' in textStyle.value.textIndent! &&
    Indexes.Instance.list.sizes?.[textStyle.value.textIndent.id]
  ) {
    return Indexes.Instance.list.sizes[textStyle.value.textIndent.id];
  }
  return textIndent;
};
