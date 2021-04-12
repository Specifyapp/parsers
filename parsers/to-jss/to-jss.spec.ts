import libs from '../global-libs';
import seeds from '../../tests/seeds';
import toJss, { OptionsType } from './to-jss.parser';
import {
  ColorToken,
  ColorValue,
  Shadow,
  ShadowToken,
  Token,
  MeasurementToken,
  BorderToken,
  DepthToken,
  OpacityToken,
  DurationToken,
  BitmapToken,
  VectorToken,
} from '../../types';
import tinycolor from 'tinycolor2';
import path from 'path';

describe('To jss', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toJss(seeds().tokens as Array<Token>, { formatName: 'camelCase' }, libs);
    expect(typeof result).toEqual('string');
    const color = seeds().tokens.find(token => token.type === 'color') as Token;
    const measurement = seeds().tokens.find(
      token => token.type === 'measurement',
    ) as MeasurementToken;
    const shadow = seeds().tokens.find(token => token.type === 'shadow') as ShadowToken;

    const shadowValue = shadow.value.reduce((acc: string, value: Shadow) => {
      const { color, offsetX, offsetY, blur, isInner } = value;
      const x = offsetX.value;
      const y = offsetY.value;
      const bl = blur.value;
      const { r, g, b, a } = color.value;
      const innerText = isInner ? 'inset ' : '';
      if (acc === '') {
        return `${innerText}${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r}, ${g}, ${b}, ${a})`;
      }

      return `${acc}, ${innerText}${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r}, ${g}, ${b}, ${a})`;
    }, '');

    expect(
      result.includes(
        `${libs._.camelCase(color.name)}: "${libs
          .tinycolor(color.value as ColorValue)
          .toString('rgb')}",`,
      ),
    ).toBe(true);
    expect(result.includes(`${libs._.camelCase(shadow.name)}: "${shadowValue}",`)).toBe(true);
    expect(
      result.includes(
        `${libs._.camelCase(measurement.name)}: "${measurement.value.measure}${
          measurement.value.unit
        }",`,
      ),
    ).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - with snakeCase formatName options', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { colorFormat: 'hsl' },
    };
    const result = await toJss(seeds().tokens as Array<Token>, options, libs);
    const color = seeds().tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds().tokens.find(
      token => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: "${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.colorFormat)}",`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = libs._[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: "${measurement.value.measure}${measurement.value.unit}",`,
      ),
    ).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - with custom jssObjectName', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { colorFormat: 'hsl' },
      formatConfig: {
        jssObjectName: 'lightTheme',
      },
    };
    const result = await toJss(seeds().tokens as Array<Token>, options, libs);
    const color = seeds().tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds().tokens.find(
      token => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: "${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.colorFormat)}",`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = libs._[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: "${measurement.value.measure}${measurement.value.unit}",`,
      ),
    ).toBe(true);
    expect(result.includes(`${options.formatConfig!.jssObjectName}`)).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - without custom jssObjectName', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { colorFormat: 'hsl' },
    };
    const result = await toJss(seeds().tokens as Array<Token>, options, libs);
    const color = seeds().tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds().tokens.find(
      token => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.colorFormat)}`,
      ),
    );

    const fnFormatMeasurement = libs._[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: "${measurement.value.measure}${measurement.value.unit}",`,
      ),
    ).toBe(true);
    expect(result.includes(`const theme = {`)).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - with camelCase', async done => {
    const options: OptionsType = {
      formatName: 'camelCase'!,
      formatTokens: { colorFormat: 'hsl' },
    };
    const result = await toJss(seeds().tokens as Array<Token>, options, libs);
    const color = seeds().tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds().tokens.find(
      token => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: "${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.colorFormat)}",`,
      ),
    ).toBe(true);

    const fnFormatName = libs._.camelCase;
    expect(
      result.includes(
        `${fnFormatName(measurement.name)}: "${measurement.value.measure}${
          measurement.value.unit
        }",`,
      ),
    ).toBe(true);
    expect(result.includes(`const theme = {`)).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - with values format options', async done => {
    const options: OptionsType = {
      formatName: 'camelCase',
      formatTokens: {
        borderFormat: 'array',
      },
    };
    const result = await toJss(seeds().tokens as Array<Token>, options, libs);

    const border = seeds().tokens.find(token => token.type === 'border') as BorderToken;
    const xBorderWidth = border.value.width.value.measure;
    const xBorderType = border.value.type.toLowerCase();
    const xBorderColor = tinycolor(border.value.color.value).toString(
      options.formatTokens?.colorFormat,
    );
    const xBorder = `${libs._.camelCase(
      border.name,
    )}: [${xBorderWidth}, "${xBorderType}", "${xBorderColor}"],`;
    expect(result.includes(xBorder)).toBe(true);

    done();
  });

  it('Module Format - es6 - export default', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { exportDefault: true, jssObjectName },
    };

    const result = await toJss(seeds().tokens as Array<Token>, options, libs);

    expect(result.includes(`export default ${jssObjectName}`)).toBeTruthy();
    expect(result.includes(`export const ${jssObjectName}`)).toBeFalsy();
    expect(result.includes('module.exports')).toBeFalsy();
  });

  it('Module Format - es6', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { exportDefault: false, jssObjectName },
    };

    const result = await toJss(seeds().tokens as Array<Token>, options, libs);

    expect(result.includes(`export default ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`export const ${jssObjectName}`)).toBeTruthy();
    expect(result.includes('module.exports')).toBeFalsy();
  });

  it('Module Format - commonjs - export default ', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { module: 'commonjs', exportDefault: true, jssObjectName },
    };

    const result = await toJss(seeds().tokens as Array<Token>, options, libs);

    expect(result.includes(`export default ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`export const ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`module.exports = ${jssObjectName}`)).toBeTruthy();
  });

  it('Module Format - commonjs', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { module: 'commonjs', exportDefault: false, jssObjectName },
    };

    const result = await toJss(seeds().tokens as Array<Token>, options, libs);
    expect(result.includes(`export default ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`export const ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`module.exports = { ${jssObjectName} }`)).toBeTruthy();
  });

  it('Relative path with default pattern', async () => {
    const options: OptionsType = {
      formatConfig: {
        assetsFolderPath: 'assets/vector',
      },
    };

    const result = await toJss(
      seeds().tokens.filter(({ type }) => type === 'vector' || type === 'bitmap') as Array<Token>,
      options,
      libs,
    );

    expect(result.includes('http://')).toBeFalsy();
    expect(result.includes('@2x.jpg')).toBeTruthy();
  });
  it('Relative path with custom pattern', async () => {
    const options: OptionsType = {
      formatConfig: {
        assetsFolderPath: 'assets/vector',
        assetsFilePattern: '{{name}}.{{format}}',
      },
    };

    const result = await toJss(
      seeds().tokens.filter(({ type }) => type === 'vector' || type === 'bitmap') as Array<Token>,
      options,
      libs,
    );

    expect(result.includes('http://')).toBeFalsy();
    expect(result.includes('@2x.webp')).toBeFalsy();
  });
  it('No assets folder path - type by tokens', async () => {
    const options: OptionsType = {
      formatName: 'camelCase',
      formatTokens: {
        durationFormat: 'number',
        opacityFormat: 'number',
        measurementFormat: 'number',
        depthFormat: 'number',
        gradientFormat: 'array',
        shadowFormat: 'array',
      },
    };
    const tokens = seeds().tokens;

    const result = await toJss(tokens, options, libs);
    tokens.forEach(token => {
      if (token.type === 'depth') {
        expect(
          result.includes(`${token.name}: ${(token.value as DepthToken['value']).depth}`),
        ).toBeTruthy();
      } else if (token.type === 'measurement') {
        expect(
          result.includes(`${token.name}: ${(token.value as MeasurementToken['value']).measure}`),
        ).toBeTruthy();
      } else if (token.type === 'opacity') {
        expect(
          result.includes(`${token.name}: ${(token.value as OpacityToken['value']).opacity / 100}`),
        ).toBeTruthy();
      } else if (token.type === 'duration') {
        expect(
          result.includes(`${token.name}: ${(token.value as DurationToken['value']).duration}`),
        ).toBeTruthy();
      } else if (token.type === 'gradient' || token.type === 'shadow') {
        const arrayReg = new RegExp(`${token.name}: \\[`);
        expect(result).toEqual(expect.stringMatching(arrayReg));
      }
    });
  });
  it('Define assets folder path by type', async () => {
    const assetsFolderPath = { bitmap: 'bitmap/', vector: 'vector/' };
    const options: OptionsType = {
      formatName: 'camelCase',
      formatConfig: {
        assetsFilePattern: '{{name}}.{{format}}',
        assetsFolderPath,
      },
    };
    const tokens = seeds().tokens.filter(({ type }) => type === 'bitmap' || type === 'vector');

    const result = await toJss(tokens, options, libs);
    tokens.forEach(token => {
      if (token.type === 'bitmap') {
        const bitmap = token as BitmapToken;
        expect(
          result.includes(
            `${libs._.camelCase(bitmap.name)}: "${path.join(
              assetsFolderPath.bitmap,
              `${libs._.camelCase(bitmap.name)}.${bitmap.value.format}"`,
            )}`,
          ),
        ).toBeTruthy();
      } else {
        const vector = token as VectorToken;
        expect(
          result.includes(
            `${libs._.camelCase(vector.name)}: "${path.join(
              assetsFolderPath.vector,
              `${libs._.camelCase(vector.name)}.${vector.value.format}"`,
            )}`,
          ),
        ).toBeTruthy();
      }
    });
  });
});
