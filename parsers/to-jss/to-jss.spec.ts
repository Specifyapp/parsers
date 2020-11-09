import libs from '../global-libs';
import * as seeds from '../../seeds.json';
import toJss, { OptionsType } from './to-jss.parser';
import {
  ColorToken,
  ColorValue,
  Shadow,
  ShadowToken,
  Token,
  MeasurementToken,
  BorderToken,
} from '../../types';
import tinycolor from 'tinycolor2';

describe('To jss', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toJss(seeds.tokens as Array<Token>, undefined, libs);
    expect(typeof result).toEqual('string');
    const color = seeds.tokens.find(token => token.type === 'color') as Token;
    const measurement = seeds.tokens.find(
      token => token.type === 'measurement',
    ) as MeasurementToken;
    const shadow = seeds.tokens.find(token => token.type === 'shadow') as ShadowToken;

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
    const result = await toJss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
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
    const result = await toJss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
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
    const result = await toJss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
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
    const result = await toJss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds.tokens.find(
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

    // Specific edge case where we don't have a space in the name but still want to parse
    expect(result.includes('colorwithaslashInit')).toBe(true);
    expect(result.includes('colorwithadashInit')).toBe(true);

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
    const result = await toJss(seeds.tokens as Array<Token>, options, libs);

    const border = seeds.tokens.find(token => token.type === 'border') as BorderToken;
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
});
