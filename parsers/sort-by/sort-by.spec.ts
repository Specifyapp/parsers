import seeds from '../../tests/seeds';
import sortBy from './sort-by.parser';
import { Token } from '../../types';
import libs from '../global-libs';

describe('sort-by', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await sortBy(seeds().tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return fail(result);
    expect(JSON.stringify(libs._.sortBy(seeds().tokens, ['name']))).toEqual(JSON.stringify(result));
    return;
  });
  it('Get tokens - apply parsers - wihtout options', async () => {
    const result = await sortBy(seeds().tokens, undefined, libs);
    if (result instanceof Error) return fail(result);
    expect(JSON.stringify(libs._.sortBy(seeds().tokens, ['name']))).toEqual(JSON.stringify(result));
    return;
  });
});
