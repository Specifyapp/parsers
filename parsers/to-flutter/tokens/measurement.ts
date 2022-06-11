import { OptionsType } from '../to-flutter.parser';
import { camelCase } from 'lodash';
import Template from '../../../libs/template';
import { DownloadableFile, MeasurementToken } from '../../../types';

const templateContent = new Template(`
import 'dart:ui';

class {{measurementClass}} {
    {{measurementClass}}._();

    {{#measurements}}
    static const {{name}} = {{value}};
    {{/measurements}}
}`);

export function generateMeasurementFile(
  measurements: Array<MeasurementToken>,
  options: OptionsType,
): DownloadableFile {
  return {
    name: options?.formatByType?.measurement?.fileName ?? 'measurements.dart',
    value: {
      content: templateContent.render({
        measurementClass: options?.formatByType?.measurement?.className ?? 'SpecifyMeasurement',
        measurements: measurements.map(measurement => ({
          name: camelCase(measurement.name),
          value: (
            measurement.value.measure * (options?.formatByType?.measurement?.devicePixelRatio ?? 2)
          ).toFixed(2),
        })),
      }),
    },
  };
}
