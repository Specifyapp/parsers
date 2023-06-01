import { OptionsType } from '../to-flutter.parser';
import { camelCase } from 'lodash';
import tinycolor from 'tinycolor2';
import Template from '../../../libs/template';
import { DownloadableFile, ColorToken, ColorValue } from '../../../types';

const templateContent = new Template(`
import 'dart:ui';

class {{colorClass}} {
    {{colorClass}}._();

    {{#colors}}
    static const {{#type}}{{type}} {{/type}}{{name}} = Color({{value}});
    {{/colors}}
}`);

export const colorToFlutter = (color: ColorValue): string => {
  const hex8 = tinycolor(color).toString('hex8').substring(1).toUpperCase();
  return `0x${hex8.substring(6)}${hex8.substring(0, 6)}`;
};

export function generateColorFile(
  colors: Array<ColorToken>,
  options: OptionsType,
): DownloadableFile {
  return {
    name: options?.formatByType?.color?.fileName ?? 'colors.dart',
    value: {
      content: templateContent.render({
        colorClass: options?.formatByType?.color?.className ?? 'SpecifyColor',
        colors: colors.map(color => ({
          name: camelCase(color.name),
          value: colorToFlutter(color.value),
          type: options?.formatByType?.color?.classType ?? 'Color',
        })),
      }),
    },
  };
}
