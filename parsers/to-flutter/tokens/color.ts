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
  return {
    name: options?.formatByType?.color?.fileName ?? 'colors.dart',
    value: {
      content: templateContent.render({
        colorClass: options?.formatByType?.color?.className ?? 'SpecifyColor',
        colors: colors.map(color => {
          const hex8 = tinycolor(color.value).toString('hex8').substring(1).toUpperCase();

          return {
            name: camelCase(color.name),
            value: `0x${hex8.substring(6)}${hex8.substring(0, 6)}`,
          };
        }),
      }),
    },
  };
}
