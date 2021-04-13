import snakecasify from './snakecasify.parser';
import { Token } from '../../types';
import libs from '../global-libs';
import seeds from '../../tests/seeds';

describe('Snakecasify', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await snakecasify(seeds().tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(token.name?.includes(' ')).toEqual(false));
    done();
  });
  it('Get tokens - apply parsers - default', async done => {
    const result = await snakecasify(seeds().tokens as Array<Token>, undefined, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    done();
  });
  it('Get tokens - apply parsers - without tokens', async done => {
    const result = await snakecasify([], undefined, libs);
    if (result instanceof Error) return done.fail(result);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(0);
    done();
  });
  it('Get tokens - apply parsers - unknown target key', async done => {
    const input = seeds().tokens;
    const result = await snakecasify(input, { keys: ['name', 'not exist'] }, libs);
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toEqual(input.length);
    done();
  });
  it('Get tokens - apply parsers - error', async done => {
    try {
      await snakecasify(
        // @ts-ignore
        'wrong type',
        { keys: ['name', 'not exist'] },
        libs,
      );
    } catch (err) {
      done();
    }
  });
});
