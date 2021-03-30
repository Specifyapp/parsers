import seeds from '../../tests/seeds';
import toCssFont from './to-css-font-import.parser';
import { Token } from '../../types';

describe('to-css-font-import', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toCssFont(
      seeds().tokens.filter(({ type }) => type === 'font') as Array<Token>,
    );
    if (result instanceof Error) return done.fail(result);
    expect(
      result.includes(
        '@font-face {\n' +
          '  font-family: "FiraCode-Medium";\n' +
          '  src: url("FiraCode-Medium.woff2") format("woff2"),\n' +
          '    url("FiraCode-Medium.woff") format("woff"),\n' +
          '    url("FiraCode-Medium.otf") format("truetype"),\n' +
          '    url("FiraCode-Medium.ttf") format("truetype");\n' +
          '  src: url("FiraCode-Medium.eot");\n' +
          '  font-weight: 500;\n' +
          '  font-display: swap;\n' +
          '}',
      ),
    ).toBeTruthy();
    done();
  });
  it('Get tokens - apply parsers - with options', async done => {
    const result = await toCssFont(
      seeds().tokens.filter(({ type }) => type === 'font') as Array<Token>,
      {
        fontsPath: '../../assets/',
        formats: ['woff2', 'woff'],
        fontFamilyTransform: 'kebabCase',
        includeFontWeight: false,
        genericFamily: 'sans-serif',
      },
    );
    if (result instanceof Error) return done.fail(result);
    expect(
      result.includes(
        '@font-face {\n' +
          '  font-family: inter-semi-bold, sans-serif;\n' +
          '  src: url("../../assets/Inter-SemiBold.woff2") format("woff2"),\n' +
          '    url("../../assets/Inter-SemiBold.woff") format("woff");\n' +
          '  font-display: swap;\n' +
          '}',
      ),
    ).toBeTruthy();
    done();
  });
});
