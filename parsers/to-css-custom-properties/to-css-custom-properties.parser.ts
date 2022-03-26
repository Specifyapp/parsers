import prettier from 'prettier/standalone';
import parserCss from 'prettier/parser-postcss';
import * as _ from 'lodash';
import { match, select } from 'ts-pattern';
import { toCss as toCssColor } from './tokens/color';
import { toCss as toCssBitmap } from './tokens/bitmap';
import { toCss as toCssBorder } from './tokens/border';
import { toCss as toCssDepth } from './tokens/depth';
import { toCss as toCssDuration } from './tokens/duration';
import { toCss as toCssGradient } from './tokens/gradient';
import { toCss as toCssMeasurement } from './tokens/measurement';
import { toCss as toCssOpacity } from './tokens/opacity';
import { toCss as toCssShadow } from './tokens/shadow';
import { toCss as toCssVector } from './tokens/vector';
import {
  BitmapToken,
  BorderToken,
  ColorsFormat,
  ColorToken,
  DepthToken,
  DurationToken,
  GradientToken,
  MeasurementToken,
  OpacityToken,
  ShadowToken,
  VectorToken,
} from '../../types';

export type InputDataType = Array<
  | Pick<ColorToken, 'value' | 'type' | 'name'>
  | Pick<BorderToken, 'value' | 'type' | 'name'>
  | Pick<DepthToken, 'value' | 'type' | 'name'>
  | Pick<DurationToken, 'value' | 'type' | 'name'>
  | Pick<GradientToken, 'value' | 'type' | 'name'>
  | Pick<MeasurementToken, 'value' | 'type' | 'name'>
  | Pick<OpacityToken, 'value' | 'type' | 'name'>
  | Pick<ShadowToken, 'value' | 'type' | 'name'>
  | Pick<VectorToken, 'value' | 'type' | 'name'>
  | Pick<BitmapToken, 'value' | 'type' | 'name'>
  | Record<string, any>
>;

export type OptionsType =
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
      formatTokens: Partial<{
        color: ColorsFormat;
      }>;
      formatConfig: Partial<{
        selector: string;
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
      }>;
    }>
  | undefined;

function convertToCss(token: InputDataType[0], options?: OptionsType) {
  const css = match(token)
    .with({ type: 'color', value: select('value') }, ({ value }) => toCssColor({ value }, options))
    .with({ type: 'vector', value: select('value') }, ({ value }) => toCssVector({ value }))
    .with({ type: 'bitmap', value: select('value') }, ({ value }) => toCssBitmap({ value }))
    .with({ type: 'depth', value: select('value') }, ({ value }) => toCssDepth({ value }))
    .with({ type: 'border', value: select('value') }, ({ value }) => toCssBorder({ value }))
    .with({ type: 'gradient', value: select('value') }, ({ value }) => toCssGradient({ value }))
    .with({ type: 'measurement', value: select('value') }, ({ value }) =>
      toCssMeasurement({ value }),
    )
    .with({ type: 'opacity', value: select('value') }, ({ value }) => toCssOpacity({ value }))
    .with({ type: 'duration', value: select('value') }, ({ value }) => toCssDuration({ value }))
    .with({ type: 'shadow', value: select('value') }, ({ value }) => toCssShadow({ value }))
    .otherwise(() => null);

  if (!css) return;

  const name =
    options?.formatName ||
    token.name.includes(' ') ||
    token.name.includes('\n') ||
    token.name.includes('/')
      ? _[options?.formatName || 'kebabCase'](token.name)
      : token.name;

  return `--${name}: ${css};`;
}

export function toCssCustomProperties<T extends InputDataType>(tokens: T, options?: OptionsType) {
  try {
    const selector = options?.formatConfig?.selector || ':root';
    const tokensGroupByType = _.groupBy(tokens, 'type');
    const styles = Object.keys(tokensGroupByType).reduce((acc, type) => {
      const formatedCss = tokensGroupByType[type]
        .map(token => convertToCss(token, options))
        .join('');
      if (formatedCss.length > 0) acc += `\n\n/* ${type.toUpperCase()} */\n${formatedCss}`;
      return acc;
    }, '');
    return prettier.format(`${selector} {${styles}}`, {
      ...options?.formatConfig,
      parser: 'css',
      plugins: [parserCss],
    });
  } catch (err) {
    throw err;
  }
}
