import linkTokens from './link-design-tokens.parser';
import seeds from '../../tests/seeds';
import { ColorToken } from '../../types';
import { TextStyle } from './tokens';

describe('Link token', () => {
  it('Get tokens - apply parser', async done => {
    const response = await linkTokens(
      seeds().tokens.filter(({ type }) => type === 'textStyle' || type === 'color'),
    );
    const colorShouldMatch = response.find(
      ({ type, name }) => type === 'color' && name === 'Colors/Orange',
    ) as ColorToken;
    const textStyleInheritOfColor = response.find(({ type, value }) => {
      if (type === 'textStyle') {
        const color = (value as TextStyle['value']).color;
        return color && 'id' in color && color.id === colorShouldMatch!.id;
      }
      return false;
    });
    expect(textStyleInheritOfColor).toBeDefined();
    done();
  });
});
