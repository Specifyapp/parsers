import * as seeds from '../../seeds.json';
import kebabcasify from './kebabcasify.parser';
import { Token } from '../../types';
import libs from '../global-libs';

describe('kebabcasify', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await kebabcasify(seeds.tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(token.name?.includes(' ')).toEqual(false));
    done();
  });
});
