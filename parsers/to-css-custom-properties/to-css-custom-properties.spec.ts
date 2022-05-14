import libs from '../global-libs';
import seeds from '../../tests/seeds';
import toCss, { OptionsType } from './to-css-custom-properties.parser';
import { ColorToken, ColorValue, Shadow, ShadowToken, Token, MeasurementToken } from '../../types';

describe('To css', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await toCss(seeds().tokens, undefined, libs);
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
    return;
  });
  it('Get tokens - apply parsers - with options', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds().tokens, options, libs);
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
    return;
  });

  it('Get tokens - apply parsers - with custom selector', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
      formatConfig: {
        selector: 'body[data-theme="light"]',
      },
    };
    const result = await toCss(seeds().tokens, options, libs);
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
    expect(result.includes(`${options.formatConfig!.selector}`)).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - without custom selector', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds().tokens, options, libs);
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
    );

    const fnFormatMeasurement = libs._[options.formatName!](measurement.name);
    expect(
      result.includes(
        `${fnFormatMeasurement}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    ).toBe(true);
    expect(result.includes(`:root {`)).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - with camelCase', async () => {
    const options: OptionsType = {
      formatName: 'camelCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds().tokens, options, libs);
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
    expect(result.includes(`:root {`)).toBe(true);
    return;
  });

  it('Get tokens - apply parsers - all tokens', async () => {
    const options: OptionsType = {};
    const result = await toCss(seeds().tokens, options, libs);
    expect(result.includes('--heuristic-cross-platform-quantify: rgba(51, 15, 99, 0.6);')).toBe(
      true,
    );
    expect(
      result.includes(
        '--open-system-markets-hard-drive: "https://specifyapp.com/_nuxt/img/881a6b6.webp";',
      ),
    ).toBe(true);
    expect(
      result.includes('--invoice-system-worthy-payment: 7px solid rgba(199, 48, 37, 0.93);'),
    ).toBe(true);
    expect(result.includes('--digital-sas-avon: 805ms;')).toBe(true);
    expect(result.includes('--frozen-withdrawal-gorgeous: Allan-Bold;')).toBe(true);
    expect(result.includes('--paanga-calculate-plum: 73px;')).toBe(true);
    expect(result.includes('--keyboard-fork-loaf: 0.13;')).toBe(true);
    expect(
      result.includes(
        '--car-ergonomic-licensed-cotton-pants: 37px 71px 2px rgba(144, 63, 6, 0.28);',
      ),
    ).toBe(true);
    expect(result.includes('--kids-iowa-ergonomic: Allan-Bold 5pt rgba(86, 225, 86, 0.52);')).toBe(
      true,
    );
    expect(
      result.includes(
        '--handcrafted-rubber-computer-sky-blue-bandwidth: "https://raw.githubusercontent.com/feathericons/feather/master/icons/alert-circle.svg";',
      ),
    ).toBe(true);
    expect(result.includes('--towels-uniform-tasty: 8;')).toBe(true);
    expect(
      result.includes(
        '      --concrete-next-generation-palladium: linear-gradient(\n' +
          '          212deg,\n' +
          '          rgba(186, 149, 255, 0.34) 0%,\n' +
          '          rgba(229, 120, 89, 0.79) 13%\n' +
          '        ),\n',
      ),
    ).toBe(true);
    return;
  });
});
