import libs from '../global-libs';
import seeds from '../../tests/seeds';
import toThemeUi from './to-theme-ui.parser';
import * as _ from 'lodash';
import { ThemeUiConfig, ThemeUiType } from './to-theme-ui.type';

type ObjectOfStringNumber = { [key: string]: number };
type ObjectOfStringString = { [key: string]: string };
describe('To theme ui', () => {
  it('Get tokens - apply parsers', async done => {
    const result = (await toThemeUi(seeds().tokens, undefined, libs)) as string;
    seeds().tokens.forEach(({ type, name }) => {
      if (!['vector', 'bitmap', 'opacity'].includes(type)) {
        expect(result).toEqual(expect.stringMatching(_.camelCase(name)));
      }
    });
    done();
  });
  it('Get tokens - apply parsers - json', async done => {
    const result = (await toThemeUi(
      seeds().tokens,
      {
        formatConfig: {
          module: 'json',
        },
      },
      libs,
    )) as ThemeUiConfig;
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'zIndices',
        'durations',
        'sizes',
        'fontSizes',
        'lineHeights',
        'borderWidths',
        'borderStyles',
        'colors',
        'shadows',
        'fonts',
        'fontWeights',
        'gradients',
        'opacities',
      ]),
    );
    expect(Object.keys(result.fontWeights)).toEqual(
      expect.arrayContaining(Object.keys(result.fonts)),
    );
    result.fontSizes.reduce((lastValue: number, currentValue: string | number) => {
      expect(lastValue < parseFloat(`${currentValue}`)).toEqual(true);
      return parseFloat(`${currentValue}`);
    }, -1);
    expect(Object.keys(result.fontWeights)).toEqual(
      expect.arrayContaining(Object.keys(result.fonts)),
    );
    Object.values(result.zIndices as ObjectOfStringNumber).forEach((item: number) =>
      expect(item).toEqual(expect.any(Number)),
    );
    ([
      'durations',
      'sizes',
      'borderWidths',
      'borderStyles',
      'lineHeights',
      'shadows',
      'colors',
    ] as Array<ThemeUiType>).forEach(key => {
      Object.values(result[key] as ObjectOfStringString).forEach((item: string) =>
        expect(item).toEqual(expect.any(String)),
      );
    });
    (['fontWeights', 'zIndices'] as Array<ThemeUiType>).forEach(key => {
      Object.values(result[key] as ObjectOfStringNumber).forEach((item: number) =>
        expect(item).toEqual(expect.any(Number)),
      );
    });
    (['fontSizes', 'opacities'] as Array<ThemeUiType>).forEach(key => {
      (result[key] as Array<number>).forEach((item: number) =>
        expect(item).toEqual(expect.any(Number)),
      );
    });
    done();
  });
  it('Get tokens - apply parsers - with variant', async done => {
    const result = (await toThemeUi(
      seeds().tokens,
      {
        formatConfig: {
          module: 'json',
        },
        variants: true,
      },
      libs,
    )) as ThemeUiConfig;
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'zIndices',
        'durations',
        'sizes',
        'fontSizes',
        'lineHeights',
        'borderWidths',
        'borderStyles',
        'colors',
        'shadows',
        'fonts',
        'fontWeights',
        'gradients',
        'opacities',
        'text',
        'border',
      ]),
    );
    expect(Object.keys(result.fontWeights)).toEqual(
      expect.arrayContaining(Object.keys(result.fonts)),
    );
    result.fontSizes.reduce((lastValue: number, currentValue: string | number) => {
      expect(lastValue < parseFloat(`${currentValue}`)).toEqual(true);
      return parseFloat(`${currentValue}`);
    }, -1);

    Object.values(result.text as Record<string, { fontFamily: string }>).forEach(value => {
      expect(result.fonts[value.fontFamily]).toBeDefined();
      expect(result.fontWeights[value.fontFamily]).toBeDefined();
    });
    done();
  });
  it('Should return variant that matched frozen presets', async done => {
    const result = (await toThemeUi(
      seeds().tokens,
      {
        formatTokens: {
          fontFormat: {
            unit: 'rem',
            type: 'string',
          },
          opacityFormat: {
            unit: 'percent',
          },
        },
        formatConfig: {
          module: 'json',
        },
        variants: true,
        presets: {
          fontWeights: {
            freeze: true,
            preset: 'base',
          },
          fontSizes: {
            freeze: true,
            preset: 'base',
          },
        },
      },
      libs,
    )) as ThemeUiConfig;
    Object.values(
      result.text as Record<string, { fontFamily: string; fontWeight: string }>,
    ).forEach(value => {
      expect(result.fonts[value.fontFamily]).toBeDefined();
      expect(result.fontWeights[value.fontWeight]).toBeDefined();
    });
    result.opacities.forEach((opacity: string) => {
      expect(opacity).toMatch(/[0-9]+%/);
    });
    done();
  });
  it('Should return variant that matched non frozen presets', async done => {
    const tokens = seeds().tokens;
    const result = (await toThemeUi(
      tokens,
      {
        formatConfig: {
          module: 'json',
        },
        variants: true,
        presets: {
          fontWeights: {
            preset: 'base',
          },
        },
      },
      libs,
    )) as ThemeUiConfig;
    expect(Object.keys(result.fontWeights).length).toBeGreaterThan(
      tokens.filter(({ type }) => type === 'textStyle').length,
    );
    Object.values(
      result.text as Record<string, { fontFamily: string; fontWeight: string }>,
    ).forEach(value => {
      expect(result.fonts[value.fontFamily]).toBeDefined();
      expect(result.fontWeights[value.fontWeight]).toBeDefined();
    });
    done();
  });
});
