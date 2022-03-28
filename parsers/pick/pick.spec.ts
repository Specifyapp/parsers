import { seeds } from '../../tests/seeds';
import { pick } from './pick.parser';
import { has } from 'lodash';

describe('Pick', () => {
  it('Execute parser', async () => {
    const result = await pick(seeds(), {
      keys: ['name', 'type'],
    });
    if (result instanceof Error) return fail(result);
    result.forEach(token => expect(Object.keys(token)).toEqual(['name', 'type']));
    return;
  });
  it('Execute parser without option', async () => {
    const result = await pick(seeds(), undefined);
    if (result instanceof Error) return fail(result);
    result.forEach(token => expect(Object.keys(token)).toEqual(['name']));
    return;
  });
  it('Execute parser with flatten option', async () => {
    const tokens = seeds();
    const result = await pick(tokens, {
      keys: ['id', 'name', 'meta.originFrameName'],
      flatten: true,
    });

    if (result instanceof Error) return fail(result);

    tokens.forEach(token => {
      const expectation = ['id', 'name'];
      if (token.meta?.originFrameName) expectation.push('originFrameName');
      expect(Object.keys(result.find(({ id }) => id === token.id)!)).toEqual(expectation);
    });
    return;
  });
  it('Execute parser with filter', async () => {
    const tokens = seeds();
    const result = await pick(tokens, {
      keys: ['value.font'],
      filter: {
        types: ['textStyle'],
      },
    });
    if (result instanceof Error) return fail(result);
    expect(tokens.length).toEqual(result.length);
    result.forEach(token => {
      if (token.type === 'textStyle') expect(has(token, 'value.color')).toEqual(false);
      if (token.type === 'border') expect(has(token, 'value.color')).toEqual(true);
    });
    return;
  });
});
