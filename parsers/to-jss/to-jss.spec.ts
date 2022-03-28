import { seeds } from '../../tests/seeds';
import { OptionsType, toJss } from './to-jss.parser';
import tinycolor from 'tinycolor2';
import path from 'path';
import _ from 'lodash';

describe('To jss', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await toJss(seeds(), { formatName: 'camelCase' });
    expect(typeof result).toEqual('string');
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;
    const shadow = seeds(['shadow'])[0]!;

    const shadowValue = shadow.value.reduce((acc: string, value) => {
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
      result.includes(`${_.camelCase(color.name)}: "${tinycolor(color.value).toString('rgb')}",`),
    ).toBe(true);
    expect(result.includes(`${_.camelCase(shadow.name)}: "${shadowValue}",`)).toBe(true);
    expect(
      result.includes(
        `${_.camelCase(measurement.name)}: "${measurement.value.measure}${
          measurement.value.unit
        }",`,
      ),
    ).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - with snakeCase formatName options', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { colorFormat: 'hsl' },
    };
    const result = await toJss(seeds(), options);
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: "${tinycolor(color.value).toString(
          options.formatTokens?.colorFormat,
        )}",`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = _[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: "${measurement.value.measure}${measurement.value.unit}",`,
      ),
    ).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - with custom jssObjectName', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { colorFormat: 'hsl' },
      formatConfig: {
        jssObjectName: 'lightTheme',
      },
    };
    const result = await toJss(seeds(), options);
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: "${tinycolor(color.value).toString(
          options.formatTokens?.colorFormat,
        )}",`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = _[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: "${measurement.value.measure}${measurement.value.unit}",`,
      ),
    ).toBe(true);
    expect(result.includes(`${options.formatConfig!.jssObjectName}`)).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - without custom jssObjectName', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { colorFormat: 'hsl' },
    };
    const result = await toJss(seeds(), options);
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${tinycolor(color.value).toString(options.formatTokens?.colorFormat)}`,
      ),
    );

    const fnFormatMeasurement = _[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: "${measurement.value.measure}${measurement.value.unit}",`,
      ),
    ).toBe(true);
    expect(result.includes(`const theme = {`)).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - with camelCase', async () => {
    const options: OptionsType = {
      formatName: 'camelCase'!,
      formatTokens: { colorFormat: 'hsl' },
    };
    const result = await toJss(seeds(), options);
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: "${tinycolor(color.value).toString(
          options.formatTokens?.colorFormat,
        )}",`,
      ),
    ).toBe(true);

    const fnFormatName = _.camelCase;
    expect(
      result.includes(
        `${fnFormatName(measurement.name)}: "${measurement.value.measure}${
          measurement.value.unit
        }",`,
      ),
    ).toBe(true);
    expect(result.includes(`const theme = {`)).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - with values format options', async () => {
    const options: OptionsType = {
      formatName: 'camelCase',
      formatTokens: {
        borderFormat: 'array',
      },
    };
    const result = await toJss(seeds(), options);

    const border = seeds(['border'])[0]!;
    const xBorderWidth = border.value.width.value.measure;
    const xBorderType = border.value.type.toLowerCase();
    const xBorderColor = tinycolor(border.value.color.value).toString(
      options.formatTokens?.colorFormat,
    );
    const xBorder = `${_.camelCase(
      border.name,
    )}: [${xBorderWidth}, "${xBorderType}", "${xBorderColor}"],`;
    expect(result.includes(xBorder)).toBe(true);

    return;
  });

  it('Module Format - es6 - export default', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { exportDefault: true, jssObjectName },
    };

    const result = await toJss(seeds(), options);

    expect(result.includes(`export default ${jssObjectName}`)).toBeTruthy();
    expect(result.includes(`export const ${jssObjectName}`)).toBeFalsy();
    expect(result.includes('module.exports')).toBeFalsy();
  });

  it('Module Format - es6', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { exportDefault: false, jssObjectName },
    };

    const result = await toJss(seeds(), options);

    expect(result.includes(`export default ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`export const ${jssObjectName}`)).toBeTruthy();
    expect(result.includes('module.exports')).toBeFalsy();
  });

  it('Module Format - commonjs - export default ', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { module: 'commonjs', exportDefault: true, jssObjectName },
    };

    const result = await toJss(seeds(), options);

    expect(result.includes(`export default ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`export const ${jssObjectName}`)).toBeFalsy();
    expect(result.includes(`module.exports = ${jssObjectName}`)).toBeTruthy();
  });

  it('Module Format - commonjs', async () => {
    const jssObjectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { module: 'commonjs', exportDefault: false, jssObjectName },
    };

    const result = await toJss(seeds(), options);
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

    const result = await toJss(seeds(['vector', 'bitmap']), options);

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

    const result = await toJss(seeds(['vector', 'bitmap']), options);

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
    const tokens = seeds();

    const result = await toJss(tokens, options);
    tokens.forEach(token => {
      if (token.type === 'depth') {
        expect(result.includes(`${token.name}: ${token.value}`)).toBeTruthy();
      } else if (token.type === 'measurement') {
        expect(result.includes(`${token.name}: ${token.value.measure}`)).toBeTruthy();
      } else if (token.type === 'opacity') {
        expect(result.includes(`${token.name}: ${token.value.opacity / 100}`)).toBeTruthy();
      } else if (token.type === 'duration') {
        expect(result.includes(`${token.name}: ${token.value.duration}`)).toBeTruthy();
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
    const tokens = seeds(['bitmap', 'vector']);

    const result = await toJss(tokens, options);
    tokens.forEach(token => {
      if (token.type === 'bitmap') {
        const bitmap = token;
        expect(
          result.includes(
            `${_.camelCase(bitmap.name)}: "${path.join(
              assetsFolderPath.bitmap,
              `${_.camelCase(bitmap.name)}.${bitmap.value.format}"`,
            )}`,
          ),
        ).toBeTruthy();
      } else {
        const vector = token;
        expect(
          result.includes(
            `${_.camelCase(vector.name)}: "${path.join(
              assetsFolderPath.vector,
              `${_.camelCase(vector.name)}.${vector.value.format}"`,
            )}`,
          ),
        ).toBeTruthy();
      }
    });
  });
});
