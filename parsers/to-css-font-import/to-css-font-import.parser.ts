import prettier from 'prettier/standalone';
import path from 'path';
import os from 'os';
import parserCss from 'prettier/parser-postcss';
import * as _ from 'lodash';
export type InputDataType = Array<{ name: string; [Key: string]: any }>;
export type OutputDataType = string;
export type OptionsType = {
  formats?: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>;
  fontsPath?: string;
  fontFamilyTransform?: 'camelCase' | 'kebabCase' | 'snakeCase';
  includeFontWeight?: boolean;
  fontDisplay?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  genericFamily?: 'serif' | 'sans-serif' | 'cursive' | 'fantasy' | 'monospace';
};

const formatDictionary = {
  woff2: 'woff2',
  woff: 'woff',
  otf: 'truetype',
  ttf: 'truetype',
  eot: null,
};

class ToCssFont {
  tokens: InputDataType;
  formats: NonNullable<OptionsType['formats']>;
  fontsPath: NonNullable<OptionsType['fontsPath']>;
  fontFamilyTransformFn: Function | undefined;
  includeFontWeight: OptionsType['includeFontWeight'];
  fontDisplay: NonNullable<OptionsType['fontDisplay']>;
  genericFamily: OptionsType['genericFamily'];

  constructor(tokens: InputDataType, options: OptionsType | undefined) {
    this.tokens = tokens;
    this.formats = options?.formats || ['woff2', 'woff', 'otf', 'ttf', 'eot'];
    this.fontsPath = options?.fontsPath || '';
    this.fontDisplay = options?.fontDisplay || 'swap';
    this.genericFamily = options?.genericFamily;
    this.includeFontWeight =
      typeof options?.includeFontWeight !== 'boolean' ? true : options.includeFontWeight;
    if (options?.fontFamilyTransform) this.fontFamilyTransformFn = _[options?.fontFamilyTransform];
  }

  run() {
    return this.tokens
      .map(tokenFont => {
        let entry = this.appendFontFamily(tokenFont);
        entry = this.appendFormats(entry, tokenFont);
        if (this.formats?.includes('eot')) entry = this.appendEotFormat(entry, tokenFont);
        if (this.includeFontWeight) entry = this.appendFontWeight(entry, tokenFont);
        entry = this.setFontDisplay(entry, this.fontDisplay);
        return this.wrapInFontFace(entry);
      })
      .join(os.EOL + os.EOL);
  }

  appendFontFamily(token: InputDataType[0]) {
    let result = this.fontFamilyTransformFn
      ? this.fontFamilyTransformFn(token.name)
      : JSON.stringify(token.name);
    if (this.genericFamily) result += `, ${this.genericFamily}`;
    return `font-family: ${result};`;
  }

  appendEotFormat(entry: string, token: InputDataType[0]) {
    return entry + `src: url("${path.join(this.fontsPath, `${token.name}.eot`)}");`;
  }

  appendFormats(entry: string, token: InputDataType[0]) {
    const formats = this.formats
      .reduce<Array<string>>((result, format) => {
        if (format === 'eot') return result;
        const fontPath = path.join(this.fontsPath, `${token.name}.${format}`);
        result.push(`url("${fontPath}") format("${formatDictionary[format]}")`);
        return result;
      }, [])
      .join(',');
    return entry + `src: ${formats};`;
  }

  appendFontWeight(entry: string, token: InputDataType[0]) {
    return token.value?.fontWeight ? `${entry}font-weight: ${token.value.fontWeight};` : entry;
  }

  setFontDisplay(entry: string, fontDisplay: OptionsType['fontDisplay']) {
    return `${entry}font-display: ${fontDisplay};`;
  }

  wrapInFontFace(entry: string) {
    return `@font-face {${entry}}`;
  }
}

export default async function (
  tokens: InputDataType,
  options?: OptionsType,
): Promise<OutputDataType | Error> {
  try {
    const toCssFont = new ToCssFont(tokens, options);
    return prettier.format(toCssFont.run(), {
      parser: 'css',
      plugins: [parserCss],
    });
  } catch (err) {
    throw err;
  }
}
