import seeds from '../../seeds';
import pick from './pick.parser';
import { Token } from '../../types';
import libs from '../global-libs';

describe('Pick', () => {
  it('Execute parser', async done => {
    const result = await pick(
      seeds().tokens.filter(({ type }: { type: string }) => type === 'color') as Array<Token>,
      {
        keys: ['name', 'type'],
      },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => expect(Object.keys(token)).toEqual(['name', 'type']));
    done();
  });
});
