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
  TokensType,
} from '../../types';
import prettier from 'prettier';
import * as os from 'os';
import { ColorsFormat, ThemeUiIndexes, ThemeUiType } from './to-theme-ui.type';
import { match, select } from 'ts-pattern';
import { generate as generateColor } from './tokens/color';
import { generate as generateBorder } from './tokens/border';
import { generate as generateDepth } from './tokens/depth';
import { generate as generateGradient } from './tokens/gradient';
import { generate as generateMeasurement } from './tokens/measurement';
import { generate as generateOpacity } from './tokens/opacity';
import { generate as generateDuration } from './tokens/duration';
import { generate as generateShadow } from './tokens/shadow';
import { generate as generateFont } from './tokens/font';
import { generate as generateTextStyle } from './tokens/textStyle';
import * as Belt from '@mobily/ts-belt';

export type InputDataType = Array<
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
  | Record<string, any>
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
  presets: Partial<Record<ThemeUiType, any>> = {};

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
    themeUiKey: ThemeUiType,
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
  const styles: Partial<Record<ThemeUiType, any>> = {};
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

const generate = (token: InputDataType[0], options: OptionsType) => {
  return match(token)
    .with(getMatch('border'), token => generateBorder(token, options))
    .with(getMatch('color'), token => generateColor(token, options))
    .with(getMatch('depth'), token => generateDepth(token, options))
    .with(getMatch('duration'), token => generateDuration(token, options))
    .with(getMatch('gradient'), token => generateGradient(token, options))
    .with(getMatch('measurement'), token => generateMeasurement(token, options))
    .with(getMatch('opacity'), token => generateOpacity(token, options))
    .with(getMatch('shadow'), token => generateShadow(token, options))
    .with(getMatch('font'), token => generateFont(token, options))
    .with(getMatch('textStyle'), token => generateTextStyle(token, options))
    .otherwise(() => null);
};

const afterGenerate = (token: InputDataType[0], options: OptionsType) => {
  return match(token)
    .with(getMatch('border'), token => generateBorder(token, options))
    .with(getMatch('color'), token => generateColor(token, options))
    .with(getMatch('depth'), token => generateDepth(token, options))
    .with(getMatch('duration'), token => generateDuration(token, options))
    .with(getMatch('gradient'), token => generateGradient(token, options))
    .with(getMatch('measurement'), token => generateMeasurement(token, options))
    .with(getMatch('opacity'), token => generateOpacity(token, options))
    .with(getMatch('shadow'), token => generateShadow(token, options))
    .with(getMatch('font'), token => generateFont(token, options))
    .with(getMatch('textStyle'), token => generateTextStyle(token, options))
    .otherwise(() => null);
};

const getMatch = (type: TokensType) => {
  return { type: type, name: select('name'), value: select('value'), id: select('id') };
};
const setGlobal = <T extends Partial<Record<ThemeUiType, any>>>(
  styles: T,
  tokens: InputDataType,
  options: OptionsType,
) => {
  return Belt.A.reduce(tokens, styles, (acc, token) => {
    return Belt.pipe(generate(token, options), themeUiToken => {
      if (Belt.G.isNullable(themeUiToken)) return acc;
      Belt.D.mapWithKey(themeUiToken, (themeUiKey, value) => {
        if (Belt.G.isObject(value)) {
          acc = Belt.D.set(acc, themeUiKey, Belt.D.merge(Belt.D.get(acc, themeUiKey), value));
        } else {
          acc = Belt.D.set(
            acc,
            themeUiKey,
            Belt.A.concat(Belt.G.isNotNullable(acc[themeUiKey]) ? acc[themeUiKey] : [], value),
          );
        }
      });
      return acc;
    });
  });
};

// const themeUiTokens = match(token)
//   .with({ type: 'color' }, (_, token) => generateColor(token, options))
//   .with({ type: 'depth' }, (_, token) => generateDepth(token, options))
//   .with({ type: 'border' }, (_, token) => generateBorder(token, options))
//   .with({ type: 'gradient' }, (_, token) => generateGradient(token, options))
//   .with({ type: 'measurement' }, (_, token) => generateMeasurement(token, options))
//   .with({ type: 'opacity' }, (_, token) => generateOpacity(token, options))
//   .with({ type: 'duration' }, (_, token) => generateDuration(token, options))
//   .with({ type: 'shadow' }, (_, token) => generateShadow(token, options))
//   .otherwise(() => null);
// return tokenHandler.afterGenerate ? tokenHandler.afterGenerate(tokenByType) : tokenByType;

// class ToThemeUiParser {
//   objectName;
//   transformNameFn;
//   exportDefault;
//   module;
//   tokensGroupByType;
//   options;
//   tokens;
//   styles;
//   constructor(tokens: InputDataType, options: OptionsType) {
//     this.options = options;
//     this.objectName = options?.formatConfig?.objectName ?? 'theme';
//     this.transformNameFn = _[options?.formatName ?? 'camelCase'];
//     this.exportDefault = options?.formatConfig?.exportDefault ?? true;
//     this.module = options?.formatConfig?.module ?? 'es6';
//     this.tokens = tokens;
//     this.tokensGroupByType = _.groupBy(tokens, 'type');
//     this.styles = {};
//     Indexes.init(!!options?.variants, this.styles);
//   }
//
//   exec() {
//     const types = Object.keys(this.tokensGroupByType) as Array<TokensType>;
//     types.forEach(type => Object.assign(this.styles, this.setGlobal(type)));
//     if (this.options && this.options.variants) {
//       types.forEach(type => Object.assign(this.styles, this.setVariants(type)));
//     }
//     return this;
//   }
//
//   setVariants(type: TokensType) {
//     const tokenHandler = getClassByType(type);
//     if (!tokenHandler) return {};
//     return tokenHandler?.generateVariants
//       ? tokenHandler.generateVariants(
//           this.styles,
//           this.tokensGroupByType[type],
//           this.options,
//           this.transformNameFn,
//         )
//       : this.styles;
//   }
//
//   finalize() {
//     const styles = JSON.stringify(this.styles);
//     return prettier.format(
//       (() => {
//         if (this.module === 'json') {
//           return styles;
//         } else if (this.module === 'es6' && this.exportDefault)
//           return `const ${this.objectName} = ${styles} ${`;${os.EOL + os.EOL}export default ${
//             this.objectName
//           };`}`;
//         else if (this.module === 'es6' && !this.exportDefault)
//           return `export const ${this.objectName} = ${styles};`;
//         else if (this.module === 'commonjs' && this.exportDefault)
//           return `const ${this.objectName} = ${styles}; ${`${os.EOL + os.EOL}module.exports = ${
//             this.objectName
//           };`}`;
//         else
//           return `const ${this.objectName} = ${styles}; ${`${os.EOL + os.EOL}module.exports = {${
//             this.objectName
//           }};`}`;
//       })(),
//       {
//         ...this.options?.formatConfig,
//         parser: this.module === 'json' ? 'json' : 'babel',
//       },
//     );
//   }
// }

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
    const styles = initPreset(options?.presets);
    Indexes.init(!!options?.variants, styles);
    // exec
    return finalize(setGlobal(styles, tokens, options), options);

    // if (this.options && this.options.variants) {
    //   types.forEach(type => Object.assign(this.styles, this.setVariants(type)));
    // }
  } catch (err) {
    throw err;
  }
}
