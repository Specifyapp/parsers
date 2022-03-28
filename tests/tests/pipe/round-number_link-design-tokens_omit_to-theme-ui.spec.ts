import libs from '../../../parsers/global-libs';
import { seeds } from '../../seeds';
import { IToken } from '../../../types';
import { ThemeUiConfig } from '../../../parsers/to-theme-ui/to-theme-ui.type';
import { createConfig } from '../../../libs/create-config';
import {
  linkDesignTokens,
  omit,
  roundNumber,
  toScssMap,
  toThemeUi,
} from '../../../scripts/parsersPipeable';

describe('Pipe - round number -> link design tokens -> omit -> theme ui', () => {
  it('Should link measurement and letter spacing', async () => {
    try {
      const result = createConfig(
        roundNumber({
          keys: [
            'value[*].offsetX.value.measure',
            'value[*].offsetY.value.measure',
            'value[*].blur.value.measure',
            'value[*].spread.value.measure',
          ],
        }),
        linkDesignTokens(),
        omit({
          filter: {
            types: ['textStyle'],
          },
          keys: ['value.verticalAlign', 'value.textTransform', 'value.textDecoration'],
        }),
        toThemeUi({
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
        }),
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
