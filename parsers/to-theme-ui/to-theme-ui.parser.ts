import {
  BorderToken,
  ColorToken,
  DepthToken,
  DurationToken,
  FontToken,
  GradientToken,
  MeasurementToken,
  OpacityToken,
  ShadowToken,
  TextStyleToken,
} from '../../types';
import prettier from 'prettier';
import * as os from 'os';
import {
  ColorsFormat,
  ThemeUiBorder,
  ThemeUiIndexes,
  ThemeUiKeys,
  ThemeUiObject,
  ThemeUiTextStyle,
} from './to-theme-ui.type';
import { match } from 'ts-pattern';
import { generate as generateColor } from './tokens/color';
import {
  generate as generateBorder,
  generateVariants as generateBorderVariant,
} from './tokens/border';
import { generate as generateDepth } from './tokens/depth';
import { generate as generateGradient } from './tokens/gradient';
import { generate as generateMeasurement } from './tokens/measurement';
import { generate as generateOpacity } from './tokens/opacity';
import { generate as generateDuration } from './tokens/duration';
import { generate as generateShadow } from './tokens/shadow';
import { generate as generateFont } from './tokens/font';
import {
  generate as generateTextStyle,
  generateVariants as generateTexStyleVariant,
} from './tokens/textStyle';
import * as Belt from '@mobily/ts-belt';
import { deduplicateAndSortList, sortObject } from './tokens';

export type InputDataType = ReadonlyArray<
  | Pick<ColorToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<BorderToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<DepthToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<DurationToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<GradientToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<MeasurementToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<OpacityToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<ShadowToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<FontToken, 'value' | 'type' | 'name' | 'id'>
  | Pick<TextStyleToken, 'value' | 'type' | 'name' | 'id'>
  // | Record<string, any>
>;

export type FormatTokenType = Partial<{
  colorFormat: {
    format: ColorsFormat;
  };
  opacityFormat: {
    unit: 'percent' | 'none';
    type?: 'number' | 'string';
  };
  fontSizeFormat: {
    type: 'number' | 'string';
    unit?: 'px' | 'rem';
  };
}>;
type PresetableKey = 'fontWeights' | 'fontSizes';
type PresetsType = Partial<{
  fontWeights: {
    preset: 'base' | Record<string, string | number>;
    freeze?: boolean;
  };
  fontSizes: {
    preset: 'base' | Array<string | number>;
    unit?: 'px' | 'rem';
    freeze?: boolean;
  };
}>;
export type OptionsType =
  | undefined
  | Partial<{
      formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
      formatTokens: FormatTokenType;
      formatConfig: Partial<{
        module: 'es6' | 'commonjs' | 'json';
        objectName: string;
        endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
        tabWidth: number;
        useTabs: boolean;
        singleQuote: boolean;
        exportDefault: boolean;
      }>;
      variants: boolean;
      presets: PresetsType;
    }>;

export class Indexes {
  private static _instance: Indexes;
  private _enable: boolean;
  list: ThemeUiIndexes = {};
  presets: Partial<Record<ThemeUiKeys, any>> = {};

  private constructor(enable: boolean) {
    this._enable = enable;
  }

  public static init(enable: boolean, presets: Indexes['presets']) {
    this._instance = new this(enable);
    this._instance.presets = { ...presets };
    if (enable && Object.keys(presets).length > 0) {
      Object.entries(presets).forEach(([property, values]) => {
        if (!this._instance.list[property as keyof ThemeUiIndexes]) {
          this._instance.list[property as keyof ThemeUiIndexes] = {};
        }
        if (Array.isArray(values)) {
          values.forEach(
            (value, index) =>
              (this._instance.list[property as keyof ThemeUiIndexes]![value] = index),
          );
        } else {
          Object.entries(values).forEach(
            // @ts-ignore
            ([key, value]) => (this._instance.list[property as keyof ThemeUiIndexes]![value] = key),
          );
        }
      });
    }
  }

  public static get Instance(): Indexes {
    return this._instance;
  }

  public add(
    themeUiKey: ThemeUiKeys,
    tokenKey: string,
    tokenRef: string | number,
    value: string | number = tokenRef,
  ) {
    if (!this._enable) return;
    if (!this.list[themeUiKey]) this.list[themeUiKey] = {};
    if (this.presets && themeUiKey in this.presets) {
      const preset = this.presets[themeUiKey as PresetableKey];
      if (Array.isArray(preset)) {
        const matchedPreset = preset.find(presetValue => presetValue === value);
        if (matchedPreset) this.list[themeUiKey]![tokenKey] = matchedPreset;
      } else {
        const matchedPreset = Object.entries(preset as object).find(
          ([_, presetValue]) => value === presetValue,
        );
        if (matchedPreset) this.list[themeUiKey]![tokenKey] = matchedPreset[0];
      }
    } else {
      this.list[themeUiKey]![tokenKey] = tokenRef;
    }
  }
}

const initPreset = (presets?: PresetsType) => {
  const styles: ThemeUiObject = {};
  styles.fontWeights =
    presets?.fontWeights?.preset === 'base'
      ? {
          thin: 100,
          extraLight: 200,
          light: 300,
          normal: 400,
          medium: 500,
          semiBold: 600,
          bold: 700,
          extraBold: 800,
          black: 900,
        } // source: https://developer.mozilla.org/fr/docs/Web/CSS/font-weight
      : presets?.fontWeights?.preset ?? {};

  if (presets?.fontSizes?.preset === 'base') {
    styles.fontSizes =
      presets?.fontSizes?.unit && presets?.fontSizes?.unit === 'px'
        ? ['8.19px', '10.24px', '12.8px', '16px', '20px', '25px', '31.25px', '39.06px', '48.83px']
        : [
            '0.512rem',
            '0.64rem',
            '0.8rem',
            '1rem',
            '1.25rem',
            '1.563rem',
            '1.953rem',
            '2.441rem',
            '3.052rem',
          ]; // source: https://type-scale.com/;
  } else if (presets?.fontSizes?.preset) {
    styles.fontSizes = presets?.fontSizes?.preset;
  }
  return styles;
};

const afterGenerate = Belt.D.mapWithKey((themeUiKey, themeUiValue) =>
  match(themeUiKey)
    .when(
      value =>
        [
          'zIndices',
          'durations',
          'fonts',
          'sizes',
          'fontWeights',
          'lineHeights',
          'letterSpacings',
        ].includes(value),
      () => sortObject(themeUiValue),
    )
    .when(
      value => ['opacities', 'fontSizes'].includes(value),
      () => deduplicateAndSortList(themeUiValue),
    )
    .otherwise(() => themeUiValue),
);

const generate = ([options, tokens, presets]: [OptionsType, InputDataType, ThemeUiObject]) =>
  Belt.A.reduce(tokens, presets, (acc, token) =>
    Belt.pipe(
      match(token)
        .with({ type: 'border' }, token => generateBorder(token, options))
        .with({ type: 'color' }, token => generateColor(token, options))
        .with({ type: 'depth' }, token => generateDepth(token, options))
        .with({ type: 'duration' }, token => generateDuration(token, options))
        .with({ type: 'gradient' }, token => generateGradient(token, options))
        .with({ type: 'measurement' }, token => generateMeasurement(token, options))
        .with({ type: 'opacity' }, token => generateOpacity(token, options))
        .with({ type: 'shadow' }, token => generateShadow(token, options))
        .with({ type: 'font' }, token => generateFont(token, options, presets))
        .with({ type: 'textStyle' }, token => generateTextStyle(token, options, presets))
        .exhaustive(),
      themeUiToken =>
        !Belt.G.isNullable(themeUiToken)
          ? Belt.D.merge(
              acc,
              Belt.D.mapWithKey(themeUiToken, (themeUiKey, value) =>
                Belt.G.isObject(value)
                  ? Belt.D.set(acc, themeUiKey, Belt.D.merge(Belt.D.get(acc, themeUiKey), value))[
                      themeUiKey
                    ]
                  : Belt.D.set(
                      acc,
                      themeUiKey,
                      Belt.A.concat(
                        Belt.G.isNotNullable(acc[themeUiKey]) ? acc[themeUiKey] : [],
                        value,
                      ),
                    )[themeUiKey],
              ),
            )
          : acc,
    ),
  );

const setGlobal = <T extends Partial<Record<ThemeUiKeys, any>>>(
  presets: T,
  tokens: InputDataType,
  options: OptionsType,
): ThemeUiObject => Belt.pipe([options, tokens, presets], generate, afterGenerate);

const finalize = (src: object, options: OptionsType) => {
  const styles = JSON.stringify(src);
  const module = options?.formatConfig?.module ?? 'es6';
  const objectName = options?.formatConfig?.objectName ?? 'theme';
  return prettier.format(
    (() => {
      if (module === 'json') {
        return styles;
      } else if (module === 'es6' && options?.formatConfig?.exportDefault)
        return `const ${objectName} = ${styles} ${`;${
          os.EOL + os.EOL
        }export default ${objectName};`}`;
      else if (module === 'es6' && !options?.formatConfig?.exportDefault)
        return `export const ${options?.formatConfig?.objectName} = ${styles};`;
      else if (module === 'commonjs' && options?.formatConfig?.exportDefault)
        return `const ${objectName} = ${styles}; ${`${os.EOL + os.EOL}module.exports = ${
          options?.formatConfig?.objectName
        };`}`;
      else
        return `const ${objectName} = ${styles}; ${`${
          os.EOL + os.EOL
        }module.exports = {${objectName}};`}`;
    })(),
    {
      ...options?.formatConfig,
      parser: module === 'json' ? 'json' : 'babel',
    },
  );
};

export async function toThemeUi<T extends InputDataType>(tokens: T, options?: OptionsType) {
  try {
    const presets = initPreset(options?.presets);
    Indexes.init(!!options?.variants, presets);
    const themeUiObject = setGlobal(presets, tokens, options);
    return finalize(
      options?.variants
        ? Belt.D.merge(
            themeUiObject,
            Belt.pipe(
              tokens,
              Belt.A.groupBy(token => token.type),
              // @ts-ignore
              Belt.D.toPairs,
              Belt.A.reduce({}, (acc, [tokenType, tokens]) => {
                return Belt.D.merge(
                  acc,
                  match(tokenType)
                    .with('textStyle', () =>
                      generateTexStyleVariant(
                        themeUiObject as ThemeUiTextStyle,
                        tokens as unknown as Array<TextStyleToken>,
                        options,
                      ),
                    )
                    .with('border', () =>
                      generateBorderVariant(
                        themeUiObject as ThemeUiBorder,
                        tokens as unknown as Array<BorderToken>,
                        options,
                      ),
                    )
                    .otherwise(() => ({})),
                );
              }),
            ),
          )
        : themeUiObject,
      options,
    );
  } catch (err) {
    throw err;
  }
}
