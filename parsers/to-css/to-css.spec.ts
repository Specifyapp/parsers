import * as seeds from '../../../../tests/seeds.json';
import toCss, { ParserContext } from './to-css.parser';
import { ColorValue, Token } from '@specifyapp/types';
import libs from '../global-libs';

describe('To css', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toCss(seeds.tokens as Array<Token>, null, libs);
    if (result instanceof Error) return done.fail(result);
    expect(typeof result).toEqual('string');
    const color: Token = seeds.tokens.find((token: Token) => token.type === 'color');
    const measurement = seeds.tokens.find((token: Token) => token.type === 'measurement');
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
    const options: ParserContext['options'] = {
      formatName: 'snakeCase',
      formatTokens: { color: 'rgb' },
    };
    const result = await toCss(seeds.tokens as Array<Token>, options, libs);
    if (result instanceof Error) return done.fail(result);
    const color = seeds.tokens.find((token: Token) => token.type === 'color');
    const measurement = seeds.tokens.find((token: Token) => token.type === 'measurement');
    expect(
      result.includes(
        `${libs._[options.formatName](color.name)}: ${libs
          .tinycolor(color.value as ColorValue)
          .toString(options.formatTokens.color)}`,
      ),
    );
    expect(
      result.includes(
        `${libs._[options.formatName]}: ${measurement.value.measure}${measurement.value.unit}`,
      ),
    );
    done();
  });
  it('Get tokens - apply parsers - Bad options input value', async done => {
    // @ts-ignore
    const options: OptionType = { formatName: 'Unknown formatName' };
    try {
      await toCss(seeds.tokens as Array<Token>, options, libs);
    } catch (e) {
      expect(e.actual).toEqual(options);
      expect(e.parser).toEqual('to-css');
      expect(e.message).toEqual('Bad input value: options');
      expect(
        e.expected.includes('formatName') &&
          e.expected.includes('formatTokens') &&
          e.expected.includes('formatConfig'),
      ).toEqual(true);
      done();
    }
  });
  it('Get tokens - apply parsers - Bad token input value', async done => {
    try {
      // @ts-ignore
      await toCss(undefined, { keys: ['name'] }, libs);
    } catch (e) {
      expect(e.actual).toEqual(undefined);
      expect(e.parser).toEqual('to-css');
      expect(e.message).toEqual('Bad input value: tokens');
      expect(e.expected.includes('Token') && e.expected.includes('value')).toEqual(true);
      done();
    }
  });
});
