import seeds from '../../tests/seeds';
import toFlutter from './to-flutter.parser';
import { colorToFlutter } from './tokens/color';

describe('To Flutter', () => {
  it('Should generate list of files containing design tokens', async () => {
    const tokens = seeds().tokens;
    const result = await toFlutter(tokens, undefined);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toMatchSnapshot();
  });

  it('should convert a color to a flutter format', () => {
    expect(colorToFlutter({ r: 255, g: 255, b: 0, a: 0 })).toBe('0x00FFFF00');
    expect(colorToFlutter({ r: 255, g: 255, b: 0, a: 255 })).toBe('0xFFFFFF00');
  });

  it('Should generate the color theme with custom file name, custom class name and custom type', async () => {
    const tokens = seeds().tokens;
    const result = await toFlutter(
      tokens.filter(({ type }) => type === 'color'),
      {
        formatByType: {
          color: {
            fileName: 'custom-colors-file-name.dart',
            className: 'LightTheme',
            classType: 'Color',
          },
        },
      },
    );
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toMatchSnapshot();
  });

  it('Should generate the measurement theme with custom file name, class name, ratio and type', async () => {
    const tokens = seeds().tokens;
    const result = await toFlutter(
      tokens.filter(({ type }) => type === 'measurement'),
      {
        formatByType: {
          measurement: {
            fileName: 'custom-measurements-file-name.dart',
            className: 'CustomTheme',
            classType: 'double',
            devicePixelRatio: 3.0,
          },
        },
      },
    );
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toMatchSnapshot();
  });

  it('Should generate the text styles theme with custom file name, class name and type', async () => {
    const tokens = seeds().tokens;
    const result = await toFlutter(
      tokens.filter(({ type }) => type === 'textStyle'),
      {
        formatByType: {
          textStyle: {
            fileName: 'custom-text-styles-file-name.dart',
            className: 'CustomTheme',
            classType: 'TextStyle',
          },
        },
      },
    );

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toMatchSnapshot();
  });
});
