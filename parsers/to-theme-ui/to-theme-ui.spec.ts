import libs from '../global-libs';
import seeds from '../../tests/seeds';
import toThemeUi, { OptionsType } from './to-theme-ui.parser';
import * as _ from 'lodash';
import { ThemeUiConfig, ThemeUiType } from './to-theme-ui.type';

type ObjectOfStringNumber = { [key: string]: number };
type ObjectOfStringString = { [key: string]: string };
describe('To theme ui', () => {
  it('Get tokens - apply parsers', async () => {
    const str = await toThemeUi(seeds().tokens, undefined, libs);

    seeds().tokens.forEach(({ type, name }) => {
      if (!['vector', 'bitmap', 'opacity'].includes(type)) {
        expect(str).toEqual(expect.stringMatching(_.camelCase(name)));
      }
    });
    return;
  });
  it('Get tokens - apply parsers - json', async () => {
    const str = await toThemeUi(
      seeds().tokens,
      {
        formatConfig: {
          module: 'json',
        },
      },
      libs,
    );
    const result = JSON.parse(str) as ThemeUiConfig;

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
    (
      [
        'durations',
        'sizes',
        'borderWidths',
        'borderStyles',
        'lineHeights',
        'shadows',
        'colors',
      ] as Array<ThemeUiType>
    ).forEach(key => {
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
    return;
  });
  it('Get tokens - apply parsers - with variant', async () => {
    const str = await toThemeUi(
      seeds().tokens,
      {
        formatConfig: {
          module: 'json',
        },
        variants: true,
      },
      libs,
    );
    const result = JSON.parse(str) as ThemeUiConfig;

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
    return;
  });
  it('Should return variant that matched frozen presets', async () => {
    const str = await toThemeUi(
      seeds().tokens,
      {
        formatTokens: {
          fontSizeFormat: {
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
    );
    const result = JSON.parse(str) as ThemeUiConfig;
    Object.values(
      result.text as Record<string, { fontFamily: string; fontWeight: string }>,
    ).forEach(value => {
      expect(result.fonts[value.fontFamily]).toBeDefined();
      expect(result.fontWeights[value.fontWeight]).toBeDefined();
    });
    result.opacities.forEach((opacity: string) => {
      expect(opacity).toMatch(/[0-9]+%/);
    });
    return;
  });
  it('Should return variant that matched non frozen presets', async () => {
    const tokens = seeds().tokens;
    const str = await toThemeUi(
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
    );
    const result = JSON.parse(str) as ThemeUiConfig;

    expect(Object.keys(result.fontWeights).length).toBeGreaterThan(
      tokens.filter(({ type }) => type === 'textStyle').length,
    );
    Object.values(
      result.text as Record<string, { fontFamily: string; fontWeight: string }>,
    ).forEach(value => {
      expect(result.fonts[value.fontFamily]).toBeDefined();
      expect(result.fontWeights[value.fontWeight]).toBeDefined();
    });
    return;
  });
  it('Should return variant that matched custom presets', async () => {
    const tokens = seeds().tokens;
    const str = await toThemeUi(
      tokens,
      {
        formatConfig: {
          module: 'json',
        },
        variants: true,
        presets: {
          fontWeights: {
            preset: {
              thin: 100,
              extraLight: 200,
              light: 300,
              normal: 400,
              regular: 400,
              medium: 500,
              semiBold: 600,
              bold: 700,
              extraBold: 800,
              black: 900,
            },
          },
          fontSizes: {
            preset: [4, 8, 12],
          },
        },
      },
      libs,
    );
    const result = JSON.parse(str) as ThemeUiConfig;

    expect(Object.keys(result.fontWeights).length).toBeGreaterThan(
      tokens.filter(({ type }) => type === 'textStyle').length,
    );
    expect(Object.keys(result.fontSizes).length).toBeGreaterThan(
      tokens.filter(({ type }) => type === 'textStyle').length,
    );
    Object.values(
      result.text as Record<string, { fontFamily: string; fontWeight: string }>,
    ).forEach(value => {
      expect(result.fonts[value.fontFamily]).toBeDefined();
      expect(result.fontWeights[value.fontWeight]).toBeDefined();
    });
    return;
  });
  it('Should return variant that matched nothing', async () => {
    const tokens = seeds().tokens.filter(({ type }) => type !== 'measurement' && type !== 'color');
    const str = await toThemeUi(
      tokens,
      {
        formatConfig: {
          module: 'json',
        },
        variants: true,
      },
      libs,
    );
    const result = JSON.parse(str) as ThemeUiConfig;
    expect(result.colors).toBeFalsy();
    expect(result.sizes).toBeFalsy();
    return;
  });

  it('Module Format - es6 - export default', async () => {
    const objectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { exportDefault: true, objectName },
    };

    const result = await toThemeUi(seeds().tokens, options, libs);
    expect(result.includes(`export default ${objectName}`)).toBeTruthy();
    expect(result.includes(`export const ${objectName}`)).toBeFalsy();
    expect(result.includes('module.exports')).toBeFalsy();
  });

  it('Module Format - es6', async () => {
    const objectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { exportDefault: false, objectName },
    };

    const result = await toThemeUi(seeds().tokens, options, libs);

    expect(result.includes(`export default ${objectName}`)).toBeFalsy();
    expect(result.includes(`export const ${objectName}`)).toBeTruthy();
    expect(result.includes('module.exports')).toBeFalsy();
  });

  it('Module Format - commonjs - export default ', async () => {
    const objectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { module: 'commonjs', exportDefault: true, objectName },
    };

    const result = await toThemeUi(seeds().tokens, options, libs);

    expect(result.includes(`export default ${objectName}`)).toBeFalsy();
    expect(result.includes(`export const ${objectName}`)).toBeFalsy();
    expect(result.includes(`module.exports = ${objectName}`)).toBeTruthy();
  });

  it('Module Format - commonjs', async () => {
    const objectName = 'moduleTheme';

    const options: OptionsType = {
      formatConfig: { module: 'commonjs', exportDefault: false, objectName },
    };

    const result = await toThemeUi(seeds().tokens, options, libs);
    expect(result.includes(`export default ${objectName}`)).toBeFalsy();
    expect(result.includes(`export const ${objectName}`)).toBeFalsy();
    expect(result.includes(`module.exports = { ${objectName} }`)).toBeTruthy();
  });
});
