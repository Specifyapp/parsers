import { seeds } from '../../tests/seeds';
import { OptionsType, toCssCustomProperties } from './to-css-custom-properties.parser';
import _ from 'lodash';
import tinycolor from 'tinycolor2';

describe('To css', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await toCssCustomProperties(seeds(), undefined);
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
      result.includes(`${_.kebabCase(color.name)}: ${tinycolor(color.value).toString('rgb')}`),
    ).toBe(true);
    expect(result.includes(`${shadow.name}: ${shadowValue}`)).toBe(true);
    expect(
      result.includes(
        `${_.kebabCase(measurement.name)}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    ).toBe(true);
    return;
  });
  it('Get tokens - apply parsers - with options', async () => {
    const options: OptionsType = {
      formatName: 'snakeCase',
      formatTokens: { color: 'hsl' },
    };
    const result = await toCssCustomProperties(seeds(), {
      formatName: 'snakeCase',
      formatTokens: { color: 'hsl' },
    });
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    // @ts-ignore
    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${tinycolor(color.value).toString(options.formatTokens?.color)}`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = _[options.formatName!](measurement.name);
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
    const result = await toCssCustomProperties(seeds(), options);
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${tinycolor(color.value).toString(options.formatTokens?.color)}`,
      ),
    ).toBe(true);

    const fnFormatMeasurement = _[options.formatName!](measurement.name);
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
    const result = await toCssCustomProperties(seeds(), options);
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${tinycolor(color.value).toString(options.formatTokens?.color)}`,
      ),
    );

    const fnFormatMeasurement = _[options.formatName!](measurement.name);
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
    const result = await toCssCustomProperties(seeds(), options);
    const color = seeds(['color'])[0]!;
    const measurement = seeds(['measurement'])[0]!;

    const fnFormatColor = _[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${tinycolor(color.value).toString(options.formatTokens?.color)}`,
      ),
    ).toBe(true);

    expect(result.includes('colorsAccent')).toBe(true);
    expect(result.includes('colorsRed')).toBe(true);

    const fnFormatName = _.camelCase;
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
    const result = await toCssCustomProperties(seeds(), options);
    expect(result.includes('--heuristic-cross-platform-quantify: rgba(51, 15, 99, 0.6);'));
    expect(
      result.includes(
        '--open-system-markets-hard-drive: "https://specifyapp.com/_nuxt/img/881a6b6.webp";',
      ),
    );
    expect(result.includes('--invoice-system-worthy-payment: 7px solid rgba(199, 48, 37, 0.93);'));
    expect(result.includes('--digital-sas-avon: 805ms;'));
    expect(result.includes('--frozen-withdrawal-gorgeous: Allan-Bold;'));
    expect(result.includes('--paanga-calculate-plum: 73px;'));
    expect(result.includes('--keyboard-fork-loaf: 0.13;'));
    expect(
      result.includes(
        '--car-ergonomic-licensed-cotton-pants: 37px 71px 2px rgba(144, 63, 6, 0.28);',
      ),
    );
    expect(result.includes('--kids-iowa-ergonomic: Allan-Bold 5pt rgba(86, 225, 86, 0.52);'));
    expect(
      result.includes(
        '--handcrafted-rubber-computer-sky-blue-bandwidth: "https://raw.githubusercontent.com/feathericons/feather/master/icons/alert-circle.svg";',
      ),
    );
    expect(result.includes('--towels-uniform-tasty: 8;'));
    expect(
      result.includes(
        '      --concrete-next-generation-palladium: linear-gradient(\n' +
          '          212deg,\n' +
          '          rgba(186, 149, 255, 0.34) 0%,\n' +
          '          rgba(229, 120, 89, 0.79) 13%\n' +
          '        ),\n',
      ),
    );
    return;
  });
});
