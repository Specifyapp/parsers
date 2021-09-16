import toThemeUi from '../../../parsers/to-theme-ui/to-theme-ui.parser';
import linkTokens from '../../../parsers/link-design-tokens/link-design-tokens.parser';
import roundNumber from '../../../parsers/round-number/round-number.parser';
import omit from '../../../parsers/omit/omit.parser';
import libs from '../../../parsers/global-libs';
import seeds from '../../seeds';
import { IToken } from '../../../types';
import { ThemeUiConfig } from '../../../parsers/to-theme-ui/to-theme-ui.type';

describe('Pipe - round number -> link design tokens -> omit -> theme ui', () => {
  it('Should link measurement and letter spacing', async () => {
    try {
      const roundedTokens = await roundNumber(
        seeds().tokens,
        {
          keys: [
            'value[*].offsetX.value.measure',
            'value[*].offsetY.value.measure',
            'value[*].blur.value.measure',
            'value[*].spread.value.measure',
          ],
        },
        libs,
      );
      const linkedTokens = await linkTokens(roundedTokens as Array<IToken>);
      const linkendTokensOmit = await omit(
        linkedTokens,
        {
          filter: {
            types: ['textStyle'],
          },
          keys: ['value.verticalAlign', 'value.textTransform', 'value.textDecoration'],
        },
        libs,
      );
      const result: ThemeUiConfig = JSON.parse(
        await toThemeUi(
          linkendTokensOmit as Array<IToken>,
          {
            formatConfig: {
              module: 'json',
            },
            variants: true,
            presets: {
              fontWeights: {
                preset: 'base',
                freeze: true,
              },
            },
          },
          libs,
        ),
      );
      expect(Object.keys(result.colors).includes(result.text.body.color)).toBeTruthy();
      expect(Object.keys(result.fontWeights).includes(result.text.body.fontWeight)).toBeTruthy();
      expect(Object.keys(result.lineHeights).includes(result.text.body.lineHeight)).toBeTruthy();
      expect(
        Object.keys(result.letterSpacings).includes(result.text.body.letterSpacing),
      ).toBeTruthy();
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  });
  it('Use theme-ui with small textStyle', async () => {
    const linkedTokens = await linkTokens(seeds().tokens as Array<IToken>);
    const linkendTokensOmit = await omit(
      linkedTokens,
      {
        filter: {
          types: ['textStyle'],
        },
        keys: [
          'value.verticalAlign',
          'value.textTransform',
          'value.textDecoration',
          'value.verticalAlign',
          'value.textAlign',
          'value.font',
          'value.lineHeight',
          'value.letterSpacing',
          'value.textIndent',
        ],
      },
      libs,
    );
    const result: ThemeUiConfig = JSON.parse(
      await toThemeUi(
        linkendTokensOmit as Array<IToken>,
        {
          formatConfig: {
            module: 'json',
          },
          variants: true,
        },
        libs,
      ),
    );
  });
});
