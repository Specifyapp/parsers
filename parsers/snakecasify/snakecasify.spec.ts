import * as seeds from '../../seeds.json';
import snakecasify from './snakecasify.parser';
import { Token } from '@specifyapp/types';
import libs from '../global-libs';

describe('Snakecasify', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await snakecasify(seeds.tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(token.name.includes(' ')).toEqual(false));
    done();
  });
  it('Get tokens - apply parsers - Bad options input value', async done => {
    const options = { keys: ['fzfzrfzr'] };
    try {
      // @ts-ignore
      await snakecasify(seeds.tokens as Array<Token>, options, libs);
    } catch (e) {
      expect(e.actual).toEqual(options);
      expect(e.parser).toEqual('snakecasify');
      expect(e.message).toEqual('Bad input value: options');
      expect(e.expected.includes('name') && e.expected.includes('[]')).toEqual(true);
      done();
    }
  });
  // it('Get tokens - apply parsers - Bad token input value', async done => {
  //   try {
  //     // @ts-ignore
  //     await snakecasify(undefined, { keys: ['name'] }, libs);
  //   } catch (e) {
  //     expect(e.actual).toEqual(undefined);
  //     expect(e.parser).toEqual('snakecasify');
  //     expect(e.message).toEqual('Bad input value: tokens');
  //     expect(
  //       e.expected.includes('name') && e.expected.includes('Partial') && e.expected.includes('[]'),
  //     ).toEqual(true);
  //     done();
  //   }
  // });
});
