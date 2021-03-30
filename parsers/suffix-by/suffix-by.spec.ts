import seeds from '../../tests/seeds';
import suffixBy from './suffix-by.parser';
import { Token } from '../../types';
import libs from '../global-libs';

describe('suffix-by', () => {
  it('Get tokens - apply parsers', async done => {
    const result = await suffixBy(
      seeds().tokens.filter(({ type }) => type === 'vector') as Array<Token>,
      { key: 'name', suffix: '.svg' },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    expect(result.every(vector => vector.name?.endsWith('.svg'))).toEqual(true);
    done();
  });
});
