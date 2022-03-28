import { seeds } from '../../tests/seeds';
import { sortBy } from './sort-by.parser';
import _ from 'lodash';

describe('sort-by', () => {
  it('Get tokens - apply parsers', async () => {
    const result = await sortBy(seeds(), { keys: ['name'] });
    if (result instanceof Error) return fail(result);
    expect(JSON.stringify(_.sortBy(seeds(), ['name']))).toEqual(JSON.stringify(result));
    return;
  });
  it('Get tokens - apply parsers - wihtout options', async () => {
    const result = await sortBy(seeds(), undefined);
    if (result instanceof Error) return fail(result);
    expect(JSON.stringify(_.sortBy(seeds(), ['name']))).toEqual(JSON.stringify(result));
    return;
  });
});
