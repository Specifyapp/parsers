import * as seeds from '../../seeds.json';
import snakecasify from './snakecasify.parser';
import { Token } from '@specifyapp/types';
import libs from '../global-libs';

describe('Snakecasify', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await snakecasify(seeds.tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(token.name?.includes(' ')).toEqual(false));
    done();
  });
});
