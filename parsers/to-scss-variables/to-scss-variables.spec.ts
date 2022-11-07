import libs from '../global-libs';
import seeds from '../../tests/seeds';
import toScss, { OptionsType } from './to-scss-variables.parser';
import { ColorToken, ColorValue, Shadow, ShadowToken, Token, MeasurementToken } from '../../types';

describe('To scss', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await toScss(seeds().tokens, undefined, libs);
    expect(typeof result).toEqual('string');
    const color = seeds().tokens.find(token => token.type === 'color') as ColorToken;
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
        `${libs._.kebabCase(color.name)}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString('rgb')}`,
      ),
    ).toBe(true);
    expect(result.includes(`${shadow.name}: ${shadowValue}`)).toBe(true);
    expect(
      result.includes(
        `${libs._.kebabCase(measurement.name)}: ${measurement.value.measure}${
          measurement.value.unit
        }`,
      ),
    ).toBe(true);
  });
  it('Get tokens - apply parsers - with options', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toScss(seeds().tokens, options, libs);
    const color = seeds().tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds().tokens.find(
      token => token.type === 'measurement',
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
  });

  it('Get tokens - apply parsers - with camelCase', async () => {
    const options: OptionsType = {
      formatName: 'camelCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toScss(seeds().tokens, options, libs);
    const color = seeds().tokens.find(token => token.type === 'color') as ColorToken;
    const measurement = seeds().tokens.find(
      token => token.type === 'measurement',
    ) as MeasurementToken;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    ).toBe(true);

    expect(result.includes('colorsAccent')).toBe(true);
    expect(result.includes('colorsRed')).toBe(true);

    const fnFormatName = libs._.camelCase;
    expect(
      result.includes(
        `${fnFormatName(measurement.name)}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    ).toBe(true);
  });

  it('Get tokens - apply parsers - all tokens', async () => {
    const options: OptionsType = {
      formatName: 'kebabCase'!,
    };
    const result = await toScss(seeds().tokens, options, libs);
    expect(result.includes('$colors-accent: rgb(87, 124, 254);')).toBe(true);
    expect(
      result.includes(
        '$acme-logo: "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/13d6/2eb6/a2626d914998754ac0b704e2cdb7a813";',
      ),
    ).toBe(true);
    expect(result.includes('$border-accent: 2px solid rgba(102, 80, 239, 1);')).toBe(true);
    expect(result.includes('$very-long: 3s;')).toBe(true);
    expect(result.includes('$base-space-01: 4px;')).toBe(true);
    expect(result.includes('$visible: 0.95;')).toBe(true);
    expect(result.includes('$elevation-1: 0px 4px 8px rgba(0, 0, 0, 0.1);')).toBe(true);
    expect(
      result.includes(
        '$activity: "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/96dc/8825/c166b559140a0a64b28441924700a0b2";',
      ),
    ).toBe(true);
    expect(result.includes('$background: 1;')).toBe(true);
    expect(
      result.includes(
        `$gradients-colored: linear-gradient(
  90deg,
  rgb(245, 72, 63) 0%,
  rgb(255, 142, 5) 100%
);`,
      ),
    ).toBe(true);
  });
});
