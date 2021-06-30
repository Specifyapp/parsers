import { IToken, TokensType } from '../../types';
import prettier from 'prettier';
import * as TokensClass from './tokens';
import { LibsType } from '../global-libs';
import * as _ from 'lodash';
import * as os from 'os';
import {
  ColorsFormat,
  ThemeUiIndexes,
  ThemeUiTokenClass,
  ThemeUiType,
  ThemeUiTypes,
} from './to-theme-ui.type';

export type InputDataType = Array<
  Pick<IToken, 'id' | 'name' | 'value' | 'type'> & Record<string, any>
>;
export type OutputDataType = string;
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
    }>
  | undefined;

function getClassByType(type: string): ThemeUiTokenClass | undefined {
  const tokenClassName = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
  return (<any>TokensClass)[tokenClassName];
}

export class Indexes {
  private static _instance: Indexes;
  private _enable: boolean;
  list: ThemeUiIndexes = {};
  presets: PresetsType = {};

  private constructor(enable: boolean) {
    this._enable = enable;
  }

  public static init(enable: boolean, presets: PresetsType) {
    this._instance = new this(enable);
    this._instance.presets = { ...presets };
  }

  public static get Instance(): Indexes {
    return this._instance;
  }

  public add(
    themeUiKey: ThemeUiType,
    spTokenId: string,
    tokenRef: string | number,
    value: string | number = tokenRef,
  ) {
    if (!this._enable) return;
    if (!this.list[themeUiKey]) this.list[themeUiKey] = {};
    if (this.presets && themeUiKey in this.presets) {
      const preset = this.presets[themeUiKey as PresetableKey];
      if (Array.isArray(preset)) {
        const matchedPreset = preset.find(presetValue => presetValue === value);
        if (matchedPreset) this.list[themeUiKey]![spTokenId] = matchedPreset;
      } else {
        const matchedPreset = Object.entries(preset as object).find(
          ([_, presetValue]) => value === presetValue,
        );
        if (matchedPreset) this.list[themeUiKey]![spTokenId] = matchedPreset[0];
      }
    } else {
      this.list[themeUiKey]![spTokenId] = tokenRef;
    }
  }
}

class ToThemeUiParser {
  objectName;
  transformNameFn;
  exportDefault;
  module;
  tokensGroupByType;
  options;
  tokens;
  styles: Partial<Record<ThemeUiType, any>> = {};
  constructor(tokens: InputDataType, options: OptionsType) {
    this.options = options;
    this.objectName = options?.formatConfig?.objectName ?? 'theme';
    this.transformNameFn = _[options?.formatName ?? 'camelCase'];
    this.exportDefault = options?.formatConfig?.exportDefault ?? true;
    this.module = options?.formatConfig?.module ?? 'es6';
    this.tokens = tokens;
    this.tokensGroupByType = _.groupBy(tokens, 'type') as Record<TokensType, InputDataType>;
    this.styles = {};
    if (options?.presets) this.initPreset(options.presets);
    Indexes.init(!!options?.variants, this.styles);
  }

  initPreset(presets: PresetsType) {
    const fontWeights =
      presets.fontWeights?.preset === 'base'
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
        : presets.fontWeights?.preset ?? {};
    if (presets.fontWeights?.freeze) {
      this.styles.fontWeights = Object.freeze(fontWeights);
    } else {
      this.styles.fontWeights = fontWeights;
    }

    if (presets.fontSizes?.preset === 'base') {
      this.styles.fontSizes =
        presets.fontSizes?.unit && presets.fontSizes?.unit === 'px'
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
    } else if (presets.fontSizes?.preset) {
      this.styles.fontSizes = presets.fontSizes?.preset;
    }
    if (presets.fontSizes?.freeze) Object.freeze(this.styles.fontSizes);
  }

  exec() {
    const types = Object.keys(this.tokensGroupByType) as Array<TokensType>;
    types.forEach(type => Object.assign(this.styles, this.setGlobal(type)));
    if (this.options && this.options.variants) {
      types.forEach(type => Object.assign(this.styles, this.setVariants(type)));
    }
    return this;
  }

  setGlobal(type: TokensType) {
    const tokenHandler = getClassByType(type);
    if (!tokenHandler) return {};
    let tokenByType = this.tokensGroupByType[type].reduce((acc, token) => {
      const instance = new tokenHandler(token, this.transformNameFn);
      const themeUiTokens = instance.generate(this.options, this.tokens);
      (Object.keys(themeUiTokens) as Array<ThemeUiTypes>).forEach(themeUiKey => {
        if (this.styles[themeUiKey] && Object.isFrozen(this.styles[themeUiKey])) return;
        if (Array.isArray(themeUiTokens[themeUiKey])) {
          acc[themeUiKey] = [...(acc[themeUiKey] || []), ...themeUiTokens[themeUiKey]];
        } else {
          acc[themeUiKey] = { ...(acc[themeUiKey] || {}), ...themeUiTokens[themeUiKey] };
        }
      });
      return acc;
    }, this.styles as Record<ThemeUiType, any>);
    return tokenHandler.afterGenerate ? tokenHandler.afterGenerate(tokenByType) : tokenByType;
  }

  setVariants(type: TokensType) {
    const tokenHandler = getClassByType(type);
    if (!tokenHandler) return {};
    return tokenHandler?.generateVariants
      ? tokenHandler.generateVariants(
          this.styles,
          this.tokensGroupByType[type],
          this.options,
          this.transformNameFn,
        )
      : this.styles;
  }

  finalize() {
    const styles = JSON.stringify(this.styles);
    return prettier.format(
      (() => {
        if (this.module === 'json') {
          return styles;
        } else if (this.module === 'es6' && this.exportDefault)
          return `const ${this.objectName} = ${styles} ${`;${os.EOL + os.EOL}export default ${
            this.objectName
          };`}`;
        else if (this.module === 'es6' && !this.exportDefault)
          return `export const ${this.objectName} = ${styles};`;
        else if (this.module === 'commonjs' && this.exportDefault)
          return `const ${this.objectName} = ${styles}; ${`${os.EOL + os.EOL}module.exports = ${
            this.objectName
          };`}`;
        else
          return `const ${this.objectName} = ${styles}; ${`${os.EOL + os.EOL}module.exports = {${
            this.objectName
          }};`}`;
      })(),
      {
        ...this.options?.formatConfig,
        parser: this.module === 'json' ? 'json' : 'babel',
      },
    );
  }
}

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _ }: Pick<LibsType, '_'>,
): Promise<OutputDataType> {
  try {
    const parserInstance = new ToThemeUiParser(tokens, options);
    return parserInstance.exec().finalize();
  } catch (err) {
    throw err;
  }
}
