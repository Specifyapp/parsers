import { OptionsType } from '../to-flutter.parser';
import { camelCase } from 'lodash';
import tinycolor from 'tinycolor2';
import Template from '../../../libs/template';
import { DownloadableFile, ColorToken } from '../../../types';

const templateContent = new Template(`
import 'dart:ui';

class {{colorClass}} {
    {{colorClass}}._();

    {{#colors}}
    static const {{name}} = Color({{value}});
    {{/colors}}
}`);

export function generateColorFile(
  colors: Array<ColorToken>,
  options: OptionsType,
): DownloadableFile {
  console.log(colors.length);
  return {
    name: options?.formatByType?.color?.fileName ?? 'colors.dart',
    value: {
      content: templateContent.render({
        colorClass: options?.formatByType?.color?.className ?? 'SpecifyColor',
        colors: colors.map(color => ({
          name: camelCase(color.name),
          value: `0x${tinycolor(color.value).toString('hex8').substring(1).toUpperCase()}`,
        })),
      }),
    },
  };
}
