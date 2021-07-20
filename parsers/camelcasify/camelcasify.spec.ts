import camelcasify from './camelcasify.parser';
import { Token } from '../../types';
import libs from '../global-libs';
import seeds from '../../tests/seeds';

describe('Camelcasify', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await camelcasify(seeds().tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    return;
  });
  it('Get tokens - apply parsers - default', async () => {
    const result = await camelcasify(seeds().tokens as Array<Token>, undefined, libs);
    if (result instanceof Error) return fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    return;
  });
  it('Get tokens - apply parsers - without tokens', async () => {
    const result = await camelcasify([], undefined, libs);
    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(0);
    return;
  });
  it('Get tokens - apply parsers - unknown target key', async () => {
    const input = seeds().tokens;
    const result = await camelcasify(input, { keys: ['name', 'not exist'] }, libs);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(input.length);
    return;
  });
  it('Get tokens - apply parsers - error', async () => {
    try {
      await camelcasify(
        // @ts-ignore
        'wrong type',
        { keys: ['name', 'not exist'] },
        libs,
      );
    } catch (err) {
      return;
    }
  });
});
