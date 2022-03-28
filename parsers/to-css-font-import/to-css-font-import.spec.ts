import { seeds } from '../../tests/seeds';
import { toCssFontImport } from './to-css-font-import.parser';

describe('to-css-font-import', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await toCssFontImport(seeds(['font']));
    expect(
      result.includes(
        '@font-face {\n' +
          '  font-family: "FiraCode-Medium";\n' +
          '  src: url("FiraCode-Medium.woff2") format("woff2"),\n' +
          '    url("FiraCode-Medium.woff") format("woff");\n' +
          '  font-weight: 500;\n' +
          '  font-display: swap;\n' +
          '}',
      ),
    ).toBeTruthy();
    return;
  });
  it('Get tokens - apply parsers - with options', async () => {
    const result = await toCssFontImport(seeds(['font']), {
      fontsPath: '../../assets/',
      formats: ['woff2', 'woff', 'eot'],
      fontFamilyTransform: 'kebabCase',
      includeFontWeight: false,
      genericFamily: 'sans-serif',
    });
    expect(
      result.includes(
        '@font-face {\n' +
          '  font-family: inter-semi-bold, sans-serif;\n' +
          '  src: url("../../assets/Inter-SemiBold.woff2") format("woff2"),\n' +
          '    url("../../assets/Inter-SemiBold.woff") format("woff");\n' +
          '  src: url("../../assets/Inter-SemiBold.eot");\n' +
          '  font-display: swap;\n' +
          '}',
      ),
    ).toBeTruthy();
    return;
  });
});
