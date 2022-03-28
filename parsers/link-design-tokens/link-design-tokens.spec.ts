import { linkDesignTokens } from './link-design-tokens.parser';
import { seeds } from '../../tests/seeds';
import { ColorToken } from '../../types';
import { TextStyle } from './tokens';

describe('Link token', () => {
  it('Get tokens - apply parser', async () => {
    const tokens = seeds(['textStyle', 'color']);
    const response = await linkDesignTokens(tokens);
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
    expect(response.length).toEqual(tokens.length);

    return;
  });
  it('Should return gradients and shadow without any change', async () => {
    const tokens = seeds(['gradient', 'shadow']);
    const response = await linkDesignTokens(tokens);
    expect(JSON.stringify(tokens)).toEqual(JSON.stringify(response));
    expect(response.length).toEqual(tokens.length);
    return;
  });
  it('Should return same number of tokens', async () => {
    const tokens = seeds();
    const response = await linkDesignTokens(tokens);
    expect(response.length).toEqual(tokens.length);
    return;
  });
});
