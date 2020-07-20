import * as seeds from '../../seeds.json';
import toCss, { OptionsType } from './to-css.parser';
import { ColorValue, Token, Shadow } from '@specifyapp/types';
import libs from '../global-libs';

describe('To css', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toCss(seeds.tokens as Array<Token>, undefined, libs);
    expect(typeof result).toEqual('string');
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as Token;
    const measurement = seeds.tokens.find((token: Token) => token.type === 'measurement') as Token;
    const shadow = seeds.tokens.find((token: Token) => token.type === 'shadow') as Token;

    const shadowValue = shadow.value.reduce((acc: string, value: Shadow) => {
      const { color, offsetX, offsetY, blur, isInner } = value;
      const x = offsetX.value;
      const y = offsetY.value;
      const bl = blur.value;
      const { r, g, b, a } = color.value;
      const innerText = isInner ? 'inset' : '';
      if (acc === '') {
        return `${innerText} ${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r},${g},${b},${a})`;
      }

      return `${acc}, ${innerText} ${x.measure}${x.unit} ${y.measure}${y.unit} ${bl.measure}${bl.unit} rgba(${r},${g},${b},${a})`;
    }, '');

    expect(
      result.includes(
        `${libs._.camelCase(color.name)}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString('rgb')}`,
      ),
    );
    expect(result.includes(`${libs._.camelCase(shadow.name)}: ${shadowValue}`));
    expect(
      result.includes(
        `${libs._.camelCase(measurement.name)}: ${measurement.value.measure}${
          measurement.value.unit
        }`,
      ),
    );
    done();
  });
  it('Get tokens - apply parsers - with options', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as Token;
    const measurement = seeds.tokens.find((token: Token) => token.type === 'measurement') as Token;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    );

    const fnFormatName = libs._[options.formatName!];
    expect(
      result.includes(`${fnFormatName}: ${measurement.value.measure}${measurement.value.unit}`),
    );
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
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as Token;
    const measurement = seeds.tokens.find((token: Token) => token.type === 'measurement') as Token;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    );

    const fnFormatName = libs._[options.formatName!];
    expect(
      result.includes(`${fnFormatName}: ${measurement.value.measure}${measurement.value.unit}`),
    );
    expect(result.includes(`${options.formatConfig!.selector}`));
    done();
  });

  it('Get tokens - apply parsers - without custom selector', async done => {
    const options: OptionsType = {
      formatName: 'snakeCase'!,
      formatTokens: { color: 'hsl' },
    };
    const result = await toCss(seeds.tokens as Array<Token>, options, libs);
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as Token;
    const measurement = seeds.tokens.find((token: Token) => token.type === 'measurement') as Token;

    const fnFormatColor = libs._[options.formatName!](color.name);
    expect(
      result.includes(
        `${fnFormatColor}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens?.color)}`,
      ),
    );

    const fnFormatName = libs._[options.formatName!];
    expect(
      result.includes(`${fnFormatName}: ${measurement.value.measure}${measurement.value.unit}`),
    );
    expect(result.includes(`:root {`));
    done();
  });
});
