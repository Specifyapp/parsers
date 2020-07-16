import * as seeds from '../../seeds.json';
import sortBy from './sortby.parser';
import { Token } from '@specifyapp/types';
import libs from '../global-libs';

describe('sortBy', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await sortBy(seeds.tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return done.fail(result);
    expect(JSON.stringify(libs._.sortBy(seeds.tokens, ['name']))).toEqual(JSON.stringify(result))
    done();
  });
});
