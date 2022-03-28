import { filter } from './filter.parser';
import libs from '../global-libs';
import { seeds } from '../../tests/seeds';

describe('Filter', () => {
  it('Should return the elements matching the RegEx', async () => {
    const result = await filter(seeds(), {
      key: 'name',
      regex: { pattern: 'Background', flags: 'g' },
    });
    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toEqual(true);
    result.forEach(element => {
      expect(typeof element).toBe(typeof {});
    });
    return;
  });

  it('Should return only the element matching the RegEx while ignoring the case', async () => {
    const tokens = seeds();
    const result = await filter(tokens, { key: 'type', regex: { pattern: 'VeCtOr', flags: 'i' } });
    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(tokens.filter(token => token.type === 'vector').length);
    return;
  });

  it('Should return all the elements when regex is empty', async () => {
    const result = await filter(seeds(), { key: 'name', regex: { pattern: '', flags: 'g' } });
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(seeds().length);
    return;
  });

  it('should throw error when key is wrong', async () => {
    await expect(
      filter(seeds(), { key: 'not exist', regex: { pattern: '', flags: 'g' } }),
    ).rejects.toThrow(Error);
  });

  it('Should return one element when RegEx is without flag', async () => {
    const result = await filter(seeds(), { key: 'name', regex: { pattern: 'Background' } });
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    return;
  });

  it('Should return one element when RegEx is with empty flag', async () => {
    const result = await filter(seeds(), {
      key: 'name',
      regex: { pattern: 'Background', flags: '' },
    });
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    return;
  });

  it('Should return one element when RegEx is not an object', async () => {
    const result = await filter(seeds(), { key: 'name', regex: 'Background' });
    if (result instanceof Error) return fail(result);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(1);
    return;
  });
});
