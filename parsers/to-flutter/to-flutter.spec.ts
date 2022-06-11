import seeds from '../../tests/seeds';
import toFlutter from './to-flutter.parser';

describe('To Flutter', () => {
  it('Should generate list of files containing design tokens', async () => {
    const tokens = seeds().tokens;
    const result = await toFlutter(tokens, undefined);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toMatchSnapshot();
  });

  it('Should generate the color theme with custom file name and custom class name', async () => {
    const tokens = seeds().tokens;
    const result = await toFlutter(
      tokens.filter(({ type }) => type === 'color'),
      {
        formatByType: {
          color: {
            fileName: 'custom-colors-file-name.dart',
            className: 'LightTheme',
          },
        },
      },
    );
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toMatchSnapshot();
  });

  it('Should generate the measurement theme with custom file name, class name and ratio', async () => {
    const tokens = seeds().tokens;
    const result = await toFlutter(
      tokens.filter(({ type }) => type),
      {
        formatByType: {
          measurement: {
            fileName: 'custom-measurements-file-name.dart',
            className: 'CustomTheme',
            devicePixelRatio: 3.0,
          },
        },
      },
    );
    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toMatchSnapshot();
  });
});
