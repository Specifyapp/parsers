import { seeds } from '../../tests/seeds';
import { suffixBy } from './suffix-by.parser';

describe('suffix-by', () => {
  it('Execute parser', async () => {
    const suffix = '.svg';
    const result = await suffixBy(seeds(), { key: 'name', suffix, types: ['vector'] });
    if (result instanceof Error) return fail(result);
    expect(
      result.every(token =>
        token.type === 'vector' ? token.name.endsWith(suffix) : !token.name.endsWith(suffix),
      ),
    ).toEqual(true);
    return;
  });
  it('Execute parser with minimum option', async () => {
    const result = await suffixBy(seeds(['vector']), { suffix: '.svg' });
    if (result instanceof Error) return fail(result);
    expect(result.every(vector => vector.name?.endsWith('.svg'))).toEqual(true);
    return;
  });
  it('Execute with template', async () => {
    const result = await suffixBy(seeds(['vector']), { suffix: '.{{type}}.{{value.format}}' });
    if (result instanceof Error) return fail(result);
    expect(
      result.every(
        vector => vector.name?.endsWith('.vector.svg') || vector.name?.endsWith('.vector.pdf'),
      ),
    ).toEqual(true);
    return;
  });
});
