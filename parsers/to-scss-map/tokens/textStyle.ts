import { FontToken, TextStyleValue } from '../../../types';
import { OptionsType } from '../to-scss-map.parser';
import convertMeasurement from '../../../libs/size-manipulation';
import { sortObjectByKey } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

function getFontSize(
  value: TextStyleValue,
  fontFormat?: NonNullable<OptionsType['formatTokens']>['fontSize'],
) {
  const fontSize = value.fontSize;
  if (fontFormat?.unit && value.fontSize.value.unit !== fontFormat?.unit) {
    value.fontSize.value = convertMeasurement(value.fontSize.value, fontFormat?.unit);
  }
  return `${fontSize.value.measure}${fontSize.value.unit}`;
}

function getLetterSpacing(value: TextStyleValue) {
  const ls = value.letterSpacing;
  if (ls) return `${ls.value.measure}${ls.value.unit}`;
}

function getLineHeight(value: TextStyleValue) {
  const lh = value.lineHeight;
  if (lh) return `${lh.value.measure}${lh.value.unit}`;
}

const handler: ScssMapHandlerType = {
  name: 'textStyle',
  run: (value, options: OptionsType) => {
    const textStyle = value as TextStyleValue;
    const result: Record<string, string | number> = {};
    result['font-family'] = `"${
      (textStyle.font as FontToken).name ?? textStyle.font.value.fontPostScriptName
    }"`;
    result['font-size'] = getFontSize(textStyle, options?.formatTokens?.fontSize);
    result['font-weight'] = textStyle.font.value.fontWeight;

    const letterSpacing = getLetterSpacing(textStyle);
    if (letterSpacing) result['letter-spacing'] = letterSpacing;

    const lineHeight = getLineHeight(textStyle);
    if (lineHeight) result['line-height'] = lineHeight;
    return result;
  },
  sort(list: Record<string, any>) {
    return sortObjectByKey(list);
  },
};

export default handler;
