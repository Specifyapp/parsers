import { PartialRecord, TextStyleValue } from '../../../types';
import { OptionsType } from '../to-scss-map.parser';
import convertMeasurement from '../../../libs/size-manipulation';
import { sortObjectByKey } from './index';
import { ScssMapHandlerType, TextStyleProperties } from '../to-scss-map.type';

function getFontSize(
  value: Partial<TextStyleValue>,
  fontFormat?: NonNullable<OptionsType['formatTokens']>['fontSize'],
) {
  const fontSize = value.fontSize;
  if (fontFormat?.unit && value.fontSize?.value.unit !== fontFormat?.unit && value.fontSize) {
    value.fontSize.value = convertMeasurement(value.fontSize.value, fontFormat?.unit);
  }
  if (fontSize) {
    return `${fontSize.value.measure}${fontSize.value.unit}`;
  }
}

function getLetterSpacing(value: Partial<TextStyleValue>) {
  const ls = value.letterSpacing;
  if (ls) return `${ls.value.measure}${ls.value.unit}`;
}

function getLineHeight(value: Partial<TextStyleValue>) {
  const lh = value.lineHeight;
  if (lh) return `${lh.value.measure}${lh.value.unit}`;
}

const handler: ScssMapHandlerType = {
  name: 'textStyle',
  run: (value, options: OptionsType) => {
    const textStyle = value as Partial<TextStyleValue>;
    const result: PartialRecord<TextStyleProperties, string | number> = {};
    if (textStyle.font && ('name' in textStyle.font || textStyle.font?.value?.fontPostScriptName)) {
      result['font-family'] = `"${
        'name' in textStyle.font ? textStyle.font.name : textStyle.font.value.fontPostScriptName
      }"`;
    }
    if (textStyle.font?.value?.fontWeight) {
      result['font-weight'] = textStyle.font.value.fontWeight;
    }

    const fontSize = getFontSize(textStyle, options?.formatTokens?.fontSize);
    if (fontSize) result['font-size'] = fontSize;

    const letterSpacing = getLetterSpacing(textStyle);
    if (letterSpacing) result['letter-spacing'] = letterSpacing;

    const lineHeight = getLineHeight(textStyle);
    if (lineHeight) result['line-height'] = lineHeight;

    if (textStyle.textTransform) result['text-transform'] = textStyle.textTransform;

    if (textStyle.textAlign?.horizontal) result['text-align'] = textStyle.textAlign?.horizontal;

    if (textStyle.textAlign?.vertical) result['vertical-align'] = textStyle.textAlign?.vertical;

    if (textStyle.textDecoration && textStyle.textDecoration.length > 0) {
      result['text-decoration'] = textStyle.textDecoration.join(' ');
    }

    if (textStyle.textIndent) {
      result[
        'text-indent'
      ] = `${textStyle.textIndent.value.measure}${textStyle.textIndent.value.unit}`;
    }

    return result;
  },
  sort(list: Record<string, any>) {
    return sortObjectByKey(list);
  },
};

export default handler;
