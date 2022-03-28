import { nameAssetsFilesByPattern } from './name-assets-files-by-pattern.parser';
import { seeds } from '../../tests/seeds';

describe('Name assets files by pattern', () => {
  it('Get tokens - apply parser', async () => {
    const vectors = seeds(['vector']);
    const result = await nameAssetsFilesByPattern(vectors, {
      pattern: '{{name}}-{{type}}.{{format}}',
    });
    if (result instanceof Error) return fail(result);
    vectors.forEach(vector => {
      expect(vector.value.fileName).toEqual(`${vector.name}-vector.${vector.value.format}`);
    });
    return;
  });
  it('Get tokens - apply parser - bitmap', async () => {
    const bitmaps = seeds(['bitmap']);
    const result = await nameAssetsFilesByPattern(bitmaps, {
      pattern: '{{name}}{{#dimension}}@{{dimension}}{{/dimension}}.{{format}}',
    });
    if (result instanceof Error) return fail(result);
    bitmaps.forEach(bitmap => {
      expect(bitmap.value.fileName).toEqual(
        `${bitmap.name}${bitmap.value.dimension ? `@${bitmap.value.dimension}` : ''}.${
          bitmap.value.format
        }`,
      );
    });
    return;
  });
});
