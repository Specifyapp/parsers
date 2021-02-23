import nameAssetsFilesByPattern from './name-assets-files-by-pattern.parser';
import { VectorToken, BitmapToken } from '../../types';
import libs from '../global-libs';
import seeds from '../../seeds';

describe('Name assets files by pattern', () => {
  it('Get tokens - apply parser', async done => {
    const vectors = seeds().tokens.filter(({ type }) => type === 'vector') as Array<VectorToken>;
    const result = await nameAssetsFilesByPattern(
      vectors,
      { pattern: '{{name}}-{{type}}.{{format}}' },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    vectors.forEach(vector => {
      expect(vector.value.fileName).toEqual(`${vector.name}-vector.svg`);
    });
    done();
  });
  it('Get tokens - apply parser - bitmap', async done => {
    const bitmaps = seeds().tokens.filter(({ type }) => type === 'bitmap') as Array<BitmapToken>;
    const result = await nameAssetsFilesByPattern(
      bitmaps,
      { pattern: '{{name}}{{#dimension}}@{{dimension}}{{/dimension}}.{{format}}' },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    bitmaps.forEach(bitmap => {
      expect(bitmap.value.fileName).toEqual(
        `${bitmap.name}${bitmap.value.dimension ? `@${bitmap.value.dimension}` : ''}.${
          bitmap.value.format
        }`,
      );
    });
    done();
  });
});
