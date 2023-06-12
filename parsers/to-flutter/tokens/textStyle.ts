import { OptionsType } from '../to-flutter.parser';
import { O, pipe } from '@mobily/ts-belt';
import Template from '../../../libs/template';
import { DownloadableFile, TextDecorationValue, TextStyleToken } from '../../../types';
import { colorToFlutter } from './color';
import { camelCase } from 'lodash';

const templateContent = new Template(`
import 'dart:ui';

class {{textStyleClass}} {
    {{textStyleClass}}._();

    {{#fontFamillies}}
    static const String {{varName}} = '{{fontName}}';
    {{/fontFamillies}}

    {{#textStyles}}
    static const {{#type}}{{type}} {{/type}}{{name}} = TextStyle(
      fontFamily: {{fontFamilly}},
      fontSize: {{fontSize}},
      fontStyle: {{fontStyle}},
      fontWeight: FontWeight.w{{fontWeight}},{{#decoration}}\n      decoration: {{decoration}},{{/decoration}}{{#letterSpacing}}\n      letterSpacing: {{letterSpacing}},{{/letterSpacing}}{{#color}}\n      color: Color({{color}}),{{/color}}
    );
    {{/textStyles}}
}`);

const textDecorationToFlutter = (textDecoration: TextDecorationValue): string => {
  switch (textDecoration) {
    case 'line-through':
      return 'lineThrough';
    case 'overline':
    case 'underline':
      return textDecoration;
    default:
      return 'none';
  }
};

export function generateTextStyleFile(
  textStyles: Array<TextStyleToken>,
  options: OptionsType,
): DownloadableFile {
  return {
    name: options?.formatByType?.color?.fileName ?? 'text-styles.dart',
    value: {
      content: templateContent.render({
        textStyleClass: options?.formatByType?.color?.className ?? 'SpecifyTextStyle',
        fontFamillies: [...new Set(textStyles.map(v => v.value.font.value.fontFamily))].map(
          fontName => ({
            fontName,
            varName: `_${camelCase(fontName)}`,
          }),
        ),
        textStyles: textStyles.map(textStyle => ({
          name: camelCase(textStyle.name),
          type: options?.formatByType?.textStyle?.classType ?? 'TextStyle',
          fontFamilly: `_${camelCase(textStyle.value.font.value.fontFamily)}`,
          fontSize: textStyle.value.fontSize.value.measure.toFixed(2),
          fontStyle: `FontStyle.${!!textStyle.value.font.value.isItalic ? 'italic' : 'normal'}`,
          fontWeight: textStyle.value.font.value.fontWeight,
          decoration: pipe(
            // Flutter only accept 1 text decoration
            O.fromNullable(textStyle.value.textDecoration?.[0]),
            O.map(v => `TextDecoration.${textDecorationToFlutter(v)}`),
            O.toUndefined,
          ),
          letterSpacing: textStyle.value.letterSpacing?.value.measure.toFixed(2),
          color: pipe(
            O.fromNullable(textStyle.value.color?.value),
            O.map(colorToFlutter),
            O.toUndefined,
          ),
        })),
      }),
    },
  };
}
