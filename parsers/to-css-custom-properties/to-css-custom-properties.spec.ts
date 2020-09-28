import libs from '../global-libs';
import * as seeds from '../../seeds.json';
import toCss, { OptionsType } from './to-css-custom-properties.parser';
import { ColorToken, ColorValue, Shadow, ShadowToken, Token, MeasurementToken } from '../../types';

describe('To css', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toCss(seeds.tokens as Array<Token>, undefined, libs);
    expect(typeof result).toEqual('string');
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as Token;
    const measurement = seeds.tokens.find(
      (token: Token) => token.type === 'measurement',
    ) as MeasurementToken;
    const shadow = seeds.tokens.find((token: Token) => token.type === 'shadow') as ShadowToken;

    const shadowValue = shadow.value.reduce((acc: string, value: Shadow) => {
      const { color, offsetX, offsetY, blur, isInner } = value;
      const x = offsetX.value;
      const y = offsetY.value;
      const bl = blur.value;
      const { r, g, b, a } = color.value;
      const innerText = isInner ? 'inset ' : '';
      if (acc === '') {
        return `${innerText} ${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r}, ${g}, ${b}, ${a})`;
      }

      return `${acc}, ${innerText}${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r}, ${g}, ${b}, ${a})`;
    }, '');

    expect(
      result.includes(
        `${libs._.kebabCase(color.name)}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString('rgb')}`,
      ),
    ).toBe(true);
    expect(result.includes(`${libs._.kebabCase(shadow.name)}:${shadowValue}`)).toBe(true);
    expect(
      result.includes(
        `${libs._.kebabCase(measurement.name)}: ${measurement.value.measure}${
          measurement.value.unit
        }`,
      ),
    ).toBe(true);
    done();
  });
  it('Get tokens - apply parsers - with options', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
      (token: Token) => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = libs._[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    ).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - with custom selector', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
      formatConfig: {
        selector: 'body[data-theme="light"]',
      },
    };
    const result = await toCss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
      (token: Token) => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = libs._[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    ).toBe(true);
    expect(result.includes(`${options.formatConfig!.selector}`)).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - without custom selector', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
      (token: Token) => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    );

    const fnFormatMeasurement = libs._[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    ).toBe(true);
    expect(result.includes(`:root {`)).toBe(true);
    done();
  });

  it('Get tokens - apply parsers - with camelCase', async done => {
    const options: OptionsType = {
      formatName: 'camelCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
      (token: Token) => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    ).toBe(true);

    // Specific edge case where we don't have a space in the name but still want to parse
    expect(result.includes('colorwithaslashInit')).toBe(true);
    expect(result.includes('colorwithadashInit')).toBe(true);

    const fnFormatName = libs._.camelCase;
    expect(
      result.includes(
        `${fnFormatName(measurement.name)}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    ).toBe(true);
    expect(result.includes(`:root {`)).toBe(true);
    done();
  });
});
