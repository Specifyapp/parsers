import seeds from '../../tests/seeds';
import suffixBy from './suffix-by.parser';
import { Token } from '../../types';
import libs from '../global-libs';

describe('suffix-by', () => {
  it('Execute parser', async () => {
    const suffix = '.svg';
    const result = await suffixBy(seeds().tokens, { key: 'name', suffix, types: ['vector'] }, libs);
    if (result instanceof Error) return fail(result);
    expect(
      result.every(token =>
        token.type === 'vector' ? token.name.endsWith(suffix) : !token.name.endsWith(suffix),
      ),
    ).toEqual(true);
    return;
  });
  it('Execute parser with minimum option', async () => {
    const result = await suffixBy(
      seeds().tokens.filter(({ type }) => type === 'vector') as Array<Token>,
      { suffix: '.svg' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(result.every(vector => vector.name?.endsWith('.svg'))).toEqual(true);
    return;
  });
  it('Execute with template', async () => {
    const result = await suffixBy(
      seeds().tokens.filter(({ type }) => type === 'vector') as Array<Token>,
      { suffix: '.{{type}}.{{value.format}}' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(result.every(vector => vector.name?.endsWith('.vector.svg'))).toEqual(true);
    return;
  });
});
