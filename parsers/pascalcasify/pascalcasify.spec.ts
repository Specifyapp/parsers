import pascalcasify from './pascalcasify.parser';
import { Token } from '../../types';
import libs from '../global-libs';
import seeds from '../../tests/seeds';

describe('Pascalcasify', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await pascalcasify(seeds().tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    return;
  });
  it('Get tokens - apply parsers - default', async () => {
    const result = await pascalcasify(seeds().tokens as Array<Token>, undefined, libs);
    if (result instanceof Error) return fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    return;
  });
  it('Get tokens - apply parsers - without tokens', async () => {
    const result = await pascalcasify([], undefined, libs);
    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(0);
    return;
  });
  it('Get tokens - apply parsers - unknown target key', async () => {
    const input = seeds().tokens;
    const result = await pascalcasify(input, { keys: ['name', 'not exist'] }, libs);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(input.length);
    return;
  });
  it('Get tokens - apply parsers - error', async () => {
    try {
      await pascalcasify(
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
