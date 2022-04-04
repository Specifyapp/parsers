import libs from '../global-libs';
import seeds from '../../tests/seeds';
import replaceString from './replace-string.parser';

describe('Replace string', () => {
  it('Should return string with characters after the last slash with flags', async () => {
    const tokens = seeds().tokens;
    const result = await replaceString(
      tokens,
      { keys: ['name'], regex: { pattern: '(.*?)\\/', flags: 'g' }, trim: true },
      libs,
    );
    if (result instanceof Error) return fail(result);
    result.map(token => {
      expect(token.name).not.toContain('/');
      expect(token.name.charAt(0)).not.toContain(' ');
      expect(token.name.charAt(token.name.length - 1)).not.toContain(' ');
    });
  });
  it('Should return string with characters after the first slash', async () => {
    const tokens = seeds().tokens;
    const result = await replaceString(
      tokens,
      { keys: ['name'], regex: { pattern: '(.*?)\\/' }, trim: true },
      libs,
    );
    if (result instanceof Error) return fail(result);
    result.map(token => {
      expect(token.name).not.toContain('/');
      expect(token.name.charAt(0)).not.toContain(' ');
      expect(token.name.charAt(token.name.length - 1)).not.toContain(' ');
    });
  });
  it('Should replace all space by dash', async () => {
    const tokens = seeds().tokens;
    const result = await replaceString(
      tokens,
      { keys: ['name'], regex: { pattern: ' ', flags: 'g' }, replaceBy: '-' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    tokens.map(token => {
      expect(result.find(({ id }) => token.id === id)!.name).toEqual(token.name.replace(/ /g, '-'));
    });
  });
  it('Should replace space by size', async () => {
    const tokens = seeds().tokens;
    const result = await replaceString(
      tokens,
      { keys: ['name'], regex: 'space', replaceBy: 'size', trim: true },
      libs,
    );
    if (result instanceof Error) return fail(result);
    result.map(token => {
      expect(token.name).not.toContain('space');
      expect(token.name.charAt(0)).not.toContain(' ');
      expect(token.name.charAt(token.name.length - 1)).not.toContain(' ');
    });
    tokens.map(token => {
      if (token.name.includes('space')) {
        expect(result.find(({ id }) => token.id === id)).toContain('size');
      }
    });
  });
  it('Should replace nothing', async () => {
    const tokens = seeds().tokens;
    const result = await replaceString(
      tokens,
      { keys: ['name'], regex: '', replaceBy: 'nothing' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    tokens.map(token => {
      expect(result.find(({ id }) => token.id === id)).toEqual(token);
    });
  });
  it('Should selector match nothing', async () => {
    const tokens = seeds().tokens;
    const result = await replaceString(
      tokens,
      { keys: ['not-exist'], regex: '', replaceBy: 'nothing' },
      libs,
    );
    if (result instanceof Error) return fail(result);
    tokens.map(token => {
      expect(result.find(({ id }) => token.id === id)).toEqual(token);
    });
  });
  it('Should replace string input', async () => {
    const input = ':root { color: red; }';
    const result = await replaceString(input, { regex: ':root ', replaceBy: '' }, libs);
    expect(result).toEqual(input.replace(':root ', ''));
  });
});
