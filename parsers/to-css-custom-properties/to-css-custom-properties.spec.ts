import libs from '../global-libs';
import seeds from '../../tests/seeds';
import toCss, { OptionsType } from './to-css-custom-properties.parser';
import {
  ColorToken,
  ColorValue,
  Shadow,
  ShadowToken,
  MeasurementToken,
  TextStyleToken,
} from '../../types';

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
  });

  it('Get tokens - apply parsers for textStyle', async () => {
    const textStyle = seeds().tokens.find(t => t.type === 'textStyle')! as TextStyleToken;

    textStyle.value.font.value.isItalic = true;
    textStyle.value.fontVariant = ['common-ligatures', 'all-petite-caps'];
    textStyle.value.textDecoration = ['dashed', 'underline'];
    textStyle.value.textIndent = { value: { unit: 'px', measure: 12 } };
    textStyle.value.textTransform = 'capitalize';

    const result = await toCss([textStyle], { formatName: 'kebabCase' }, libs);

    expect(result).toBe(`:root {
  /* TEXTSTYLE */
  --body-color: rgb(30, 33, 43);
  --body-font-family: Inter-Medium;
  --body-font-weight: 500;
  --body-font-style: italic;
  --body-font-size: 14px;
  --body-font-variant: common-ligatures all-petite-caps;
  --body-letter-spacing: 10px;
  --body-line-height: 20px;
  --body-text-align: left;
  --body-text-decoration: dashed underline;
  --body-text-ident: 12px;
  --body-text-transform: capitalize;
}
`);
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
  });
  it('Get tokens - apply parsers - all tokens', async () => {
    const options: OptionsType = {
      formatName: 'kebabCase'!,
    };
    const result = await toCss(seeds().tokens, options, libs);
    expect(result).toMatchSnapshot();
  });
});
