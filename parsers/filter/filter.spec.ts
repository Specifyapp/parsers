import filter from './filter.parser';
import { Token } from '../../types';
import libs from '../global-libs';
import seeds from '../../tests/seeds';

describe('Filter', () => {
  it('Should return the elements matching the RegEx', async () => {
    const result = await filter(
      seeds().tokens as Array<Token>,
      { key: 'name', regex: { pattern: 'Background', flags: 'g' } },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toEqual(true);
    result.forEach(element => {
      expect(typeof element).toBe(typeof {});
    });
    return;
  });

  it('Should return only the element matching the RegEx while ignoring the case', async () => {
    const tokens = seeds().tokens as Array<Token>;
    const result = await filter(
      tokens,
      { key: 'type', regex: { pattern: 'VeCtOr', flags: 'i' } },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(tokens.filter(token => token.type === 'vector').length);
    return;
  });

  it('Should return all the elements when regex is empty', async () => {
    const result = await filter(
      seeds().tokens as Array<Token>,
      { key: 'name', regex: { pattern: '', flags: 'g' } },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(seeds().tokens.length);
    return;
  });

  it('Should return one element when RegEx is without flag', async () => {
    const result = await filter(
      seeds().tokens as Array<Token>,
      { key: 'name', regex: { pattern: 'Background' } },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    return;
  });

  it('Should return one element when RegEx is with empty flag', async () => {
    const result = await filter(
      seeds().tokens as Array<Token>,
      { key: 'name', regex: { pattern: 'Background', flags: '' } },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    return;
  });

  it('Should return one element when RegEx is not an object', async () => {
    const result = await filter(
      seeds().tokens as Array<Token>,
      { key: 'name', regex: 'Background' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    return;
  });

  it('Should work on non-string values', async () => {
    const result = await filter(seeds().tokens, { key: 'meta.dimension', regex: '2' }, libs);
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    return;
  });
});
