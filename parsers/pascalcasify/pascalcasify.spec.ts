import pascalcasify from './pascalcasify.parser';
import { Token } from '../../types';
import libs from '../global-libs';
import seeds from '../../seeds';

describe('Pascalcasify', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await pascalcasify(seeds().tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    done();
  });
});
