import { seeds } from '../../tests/seeds';
import { omit } from './omit.parser';
import { has } from 'lodash';

describe('Omit', () => {
  it('Execute parser', async () => {
    const tokens = seeds();
    const result = await omit(tokens, {
      keys: ['value.color'],
    });
    if (result instanceof Error) return fail(result);
    expect(tokens.length).toEqual(result.length);
    result.forEach(token => expect(has(token, 'value.color')).toEqual(false));
    return;
  });
  it('Execute parser with filter', async () => {
    const tokens = seeds();
    const result = await omit(tokens, {
      keys: ['value.color'],
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
  it('Execute parser with flatten option', async () => {
    const tokens = seeds();
    const result = await omit(tokens, {
      keys: ['value'],
      flatten: true,
    });
    expect(tokens.length).toEqual(result.length);
    if (result instanceof Error) return fail(result);
    result.forEach(token => {
      Object.keys(token).forEach(key => {
        expect(token['value']).toBeFalsy();
        // @ts-ignore
        expect(typeof token[key] !== 'object').toBeTruthy();
      });
    });
    return;
  });
});
