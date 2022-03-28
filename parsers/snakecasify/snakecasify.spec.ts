import { snakecasify } from './snakecasify.parser';
import { seeds } from '../../tests/seeds';

describe('Snakecasify', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await snakecasify(seeds(), { keys: ['name'] });
    if (result instanceof Error) return fail(result);
    result.forEach(token => expect(token.name?.includes(' ')).toEqual(false));
    return;
  });
  it('Get tokens - apply parsers - default', async () => {
    const result = await snakecasify(seeds(), undefined);
    if (result instanceof Error) return fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    return;
  });
  it('Get tokens - apply parsers - without tokens', async () => {
    const result = await snakecasify([], undefined);
    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(0);
    return;
  });
  it('Get tokens - apply parsers - unknown target key', async () => {
    const input = seeds();
    const result = await snakecasify(input, { keys: ['name', 'not exist'] });
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(input.length);
    return;
  });
  it('Get tokens - apply parsers - error', async () => {
    try {
      await snakecasify(
        // @ts-ignore
        'wrong type',
        { keys: ['name', 'not exist'] },
      );
    } catch (err) {
      return;
    }
  });
});
