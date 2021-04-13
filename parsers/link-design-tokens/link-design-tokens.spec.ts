import linkTokens from './link-design-tokens.parser';
import seeds from '../../tests/seeds';
import { ColorToken } from '../../types';
import { TextStyle } from './tokens';

describe('Link token', () => {
  it('Get tokens - apply parser', async done => {
    const tokens = seeds().tokens.filter(({ type }) => type === 'textStyle' || type === 'color');
    const response = await linkTokens(tokens);
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

    done();
  });
  it('Should return gradients and shadow without any change', async done => {
    const tokens = seeds().tokens.filter(({ type }) => type === 'gradient' || type === 'shadow');
    const response = await linkTokens(tokens);
    expect(JSON.stringify(tokens)).toEqual(JSON.stringify(response));
    expect(response.length).toEqual(tokens.length);
    done();
  });
  it('Should return same number of tokens', async done => {
    const tokens = seeds().tokens;
    const response = await linkTokens(tokens);
    expect(response.length).toEqual(tokens.length);
    done();
  });
});
