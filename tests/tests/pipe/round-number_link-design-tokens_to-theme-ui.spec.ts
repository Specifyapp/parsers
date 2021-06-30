import toThemeUi from '../../../parsers/to-theme-ui/to-theme-ui.parser';
import linkTokens from '../../../parsers/link-design-tokens/link-design-tokens.parser';
import roundNumber from '../../../parsers/round-number/round-number.parser';
import libs from '../../../parsers/global-libs';
import seeds from '../../seeds';
import { IToken } from '../../../types';

describe('Pipe - link design tokens -> theme ui', () => {
  it('Should link measurement and letter spacing', async done => {
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
      await toThemeUi(
        linkedTokens,
        {
          formatConfig: {
            module: 'json',
          },
          variants: true,
        },
        libs,
      );
    } catch (err) {
      fail();
    }

    done();
  });
});
