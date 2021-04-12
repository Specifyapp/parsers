import seeds from '../../tests/seeds';
import pick from './pick.parser';
import libs from '../global-libs';

describe('Pick', () => {
  it('Execute parser', async done => {
    const result = await pick(
      seeds().tokens,
      {
        keys: ['name', 'type'],
      },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(Object.keys(token)).toEqual(['name', 'type']));
    done();
  });
  it('Execute parser without option', async done => {
    const result = await pick(seeds().tokens, undefined, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(Object.keys(token)).toEqual(['name']));
    done();
  });
});
