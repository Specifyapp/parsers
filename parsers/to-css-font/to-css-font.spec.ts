import seeds from '../../seeds';
import toCssFont from './to-css-font.parser';
import { Token } from '../../types';

describe('to-css-font', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await toCssFont(
      seeds().tokens.filter(({ type }) => type === 'font') as Array<Token>,
    );
    if (result instanceof Error) return done.fail(result);
    expect(
      result.includes(
        `@font-face {
  font-family: "Frozen withdrawal Gorgeous";
  src: url("Frozen withdrawal Gorgeous.eot");
  src: url("Frozen withdrawal Gorgeous.woff2") format("woff2"),
    url("Frozen withdrawal Gorgeous.woff") format("woff"),
    url("Frozen withdrawal Gorgeous.otf") format("truetype"),
    url("Frozen withdrawal Gorgeous.ttf") format("truetype");
  font-weight: 700;
}`,
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
        `@font-face {
  font-family: credit-card-account-open-architected-solid-state, sans-serif;
  src: url("../../assets/Credit Card Account Open-architected solid state.woff2")
      format("woff2"),
    url("../../assets/Credit Card Account Open-architected solid state.woff")
      format("woff");
}`,
      ),
    ).toBeTruthy();
    done();
  });
});
