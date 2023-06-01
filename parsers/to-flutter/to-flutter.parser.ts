import {
  DownloadableFile,
  IToken,
  ColorToken,
  MeasurementToken,
  TextStyleToken,
} from '../../types';
import { match, P } from 'ts-pattern';
import { generateColorFile } from './tokens/color';
import { generateMeasurementFile } from './tokens/measurement';
import { A, D, G, O, F, pipe } from '@mobily/ts-belt';
import { generateTextStyleFile } from './tokens/textStyle';

type tokenCommons = {
  className?: string;
  fileName?: string;
  classType?: string;
};

export type InputDataType = Array<Pick<IToken, 'name' | 'value' | 'type'> & Record<string, any>>;
export type OutputDataType = Array<DownloadableFile>;
export type OptionsType =
  | {
      formatByType?: {
        color?: tokenCommons;
        measurement?: tokenCommons & {
          devicePixelRatio?: number;
        };
        textStyles?: tokenCommons;
      };
    }
  | undefined;

export default async function (
  tokens: InputDataType,
  options: OptionsType = {},
): Promise<OutputDataType> {
  return pipe(
    tokens,
    A.groupBy(({ type }) => type),
    D.mapWithKey((type, tokens) =>
      match({ type, tokens })
        .with({ type: 'color', tokens: P.array(P._) }, res =>
          generateColorFile(res.tokens as Array<ColorToken>, options),
        )
        .with({ type: 'measurement', tokens: P.array(P._) }, res =>
          generateMeasurementFile(res.tokens as Array<MeasurementToken>, options),
        )
        .with({ type: 'textStyle', tokens: P.array(P._) }, res =>
          generateTextStyleFile(res.tokens as Array<TextStyleToken>, options),
        )
        .otherwise(() => null),
    ),
    D.values,
    A.filterMap(x => (G.isNull(x) ? O.None : O.Some(x))),
    F.toMutable,
  );
}
