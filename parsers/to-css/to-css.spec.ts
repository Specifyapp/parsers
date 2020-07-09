import * as seeds from '../../seeds.json';
import toCss, { OptionsType } from './to-css.parser';
import { ColorValue, Token } from '@specifyapp/types';
import libs from '../global-libs';

describe('To css', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toCss(seeds.tokens as Array<Token>, undefined, libs);
    expect(typeof result).toEqual('string');
    const color = seeds.tokens.find((token: Token) => token.type === 'color') as Token;
    const measurement = seeds.tokens.find((token: Token) => token.type === 'measurement') as Token;
    expect(
      result.includes(
        `${libs._.camelCase(color.name)}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString('rgb')}`,
      ),
    );
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
        customSelector: 'body[data-theme="light"]',
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
    expect(
      result.includes(`${options.formatConfig.customSelector}`),
    );
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
    expect(
      result.includes(`:root {`),
    );
    done();
  });
});
