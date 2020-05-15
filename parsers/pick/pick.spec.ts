import * as seeds from '../../../../tests/seeds.json';
import pick from './pick.parser';
import { Token } from '@specifyapp/types';
import libs from '../global-libs';

describe('Pick', () => {
  it('Execute parser', async done => {
    const result = await pick(
      seeds.tokens.filter(({ type }: { type: string }) => type === 'color') as Array<Token>,
      {
        keys: ['name', 'type'],
      },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(Object.keys(token)).toEqual(['name', 'type']));
    done();
  });
  it('Get tokens - apply parsers - Bad options input value', async done => {
    const options = { keys: ['fzfzrfzr'] };
    try {
      // @ts-ignore
      await pick(seeds.tokens as Array<Token>, options, libs);
    } catch (e) {
      expect(e.actual).toEqual(options);
      expect(e.parser).toEqual('pick');
      expect(e.message).toEqual('Bad input value: options');
      expect(e.expected.includes('name') && e.expected.includes('[]')).toEqual(true);
      done();
    }
  });
  it('Get tokens - apply parsers - Bad token input value', async done => {
    try {
      // @ts-ignore
      await pick(undefined, { keys: ['name'] }, libs);
    } catch (e) {
      expect(e.actual).toEqual(undefined);
      expect(e.parser).toEqual('pick');
      expect(e.message).toEqual('Bad input value: tokens');
      expect(
        e.expected.includes('name') && e.expected.includes('Partial') && e.expected.includes('[]'),
      ).toEqual(true);
      done();
    }
  });
});
