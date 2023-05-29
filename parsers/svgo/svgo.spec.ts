import seeds from '../../tests/seeds';
import optimizeVector, { InputDataType } from './svgo.parser';
import libs, { LibsType } from '../global-libs';
import SVGO from 'svgo';
import { VectorToken } from '../../types';

describe('Optimize vector', () => {
  describe('SVGO v1', () => {
    it('Get tokens - apply parsers', async () => {
      const tokens = seeds().tokens;
      const result = await optimizeVector(tokens as InputDataType, undefined, libs as LibsType);
      if (result instanceof Error) return fail(result);
      expect(result).toMatchSnapshot();
      return;
    });
    it('Get tokens - apply parsers - with config', async () => {
      const tokens = seeds().tokens;
      const result = await optimizeVector(
        tokens as InputDataType,
        {
          svgo: {
            plugins: [
              {
                cleanupAttrs: false,
              },
              {
                removeDoctype: false,
              },
              {
                removeXMLProcInst: false,
              },
              {
                removeComments: false,
              },
              {
                removeMetadata: false,
              },
              {
                removeTitle: false,
              },
              {
                removeDesc: false,
              },
              {
                removeUselessDefs: false,
              },
              {
                removeEditorsNSData: false,
              },
              {
                removeEmptyAttrs: false,
              },
              {
                removeHiddenElems: false,
              },
              {
                removeEmptyText: false,
              },
              {
                removeEmptyContainers: false,
              },
              {
                removeViewBox: false,
              },
              {
                cleanupEnableBackground: false,
              },
              {
                convertStyleToAttrs: false,
              },
              {
                convertColors: false,
              },
              {
                convertPathData: false,
              },
              {
                convertTransform: false,
              },
              {
                removeUnknownsAndDefaults: false,
              },
              {
                removeNonInheritableGroupAttrs: false,
              },
              {
                removeUselessStrokeAndFill: false,
              },
              {
                removeUnusedNS: false,
              },
              {
                cleanupIDs: false,
              },
              {
                cleanupNumericValues: false,
              },
              {
                moveElemsAttrsToGroup: false,
              },
              {
                moveGroupAttrsToElems: false,
              },
              {
                collapseGroups: false,
              },
              {
                removeRasterImages: false,
              },
              {
                mergePaths: false,
              },
              {
                convertShapeToPath: false,
              },
              {
                sortAttrs: false,
              },
              {
                removeDimensions: false,
              },
            ],
          },
        },
        libs as LibsType,
      );
      if (result instanceof Error) return fail(result);
      expect(result).toMatchSnapshot();
      return;
    });

    it('should send error', async () => {
      try {
        await optimizeVector(
          // @ts-ignore
          'Wrong data (should be catch by ts in real life)',
          undefined,
          libs as LibsType,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
      }

      return;
    });

    it('should send an error after optimize', async () => {
      const customSVGO: {
        optimize: typeof SVGO.optimize;
      } = {
        optimize() {
          throw new Error('Needed error');
        },
      };

      const tokens = seeds().tokens;
      const result = await optimizeVector(
        tokens as InputDataType,
        {
          svgo: {
            plugins: [
              {
                removeDimensions: true,
              },
              {
                removeAttrs: {
                  attrs: '(fill|stroke)',
                },
              },
            ],
          },
        },
        {
          ...libs,
          SVGO: customSVGO,
        } as LibsType,
      );
      if (result instanceof Error) return fail(result);
      expect(result).toMatchSnapshot();
      return;
    });

    it('should remove dimensions', async () => {
      const tokens = seeds().tokens;
      const result = await optimizeVector(
        tokens as InputDataType,
        {
          svgo: {
            plugins: [
              {
                removeDimensions: true,
              },
            ],
          },
        },
        libs as LibsType,
      );
      if (result instanceof Error) return fail(result);
      expect(result).toMatchSnapshot();
      return;
    });
  });
  describe('SVGO v2', () => {
    it('Get tokens - apply parsers', async () => {
      const tokens = seeds().tokens.filter(token => token.type === 'vector');
      const result = await optimizeVector(
        tokens as InputDataType,
        {
          svgo: {
            plugins: [
              {
                name: 'preset-default',
              },
              {
                name: 'removeAttrs',
                params: {
                  attrs: 'fill',
                },
              },
            ],
          },
        },
        libs as LibsType,
      );
      if (result instanceof Error) return fail(result);
      expect(result).toMatchSnapshot();
      return;
    });
    it('Get tokens - apply parsers with custom plugin', async () => {
      const tokens = seeds().tokens.filter(token => token.type === 'vector');
      const result = await optimizeVector(
        tokens as InputDataType,
        {
          svgo: {
            plugins: [
              {
                name: 'preset-default',
              },
              {
                name: 'removeAttrs',
                params: {
                  attrs: 'fill',
                },
              },
              {
                name: 'replace-fill-and-stroke-by-current-color',
              },
            ],
          },
        },
        libs as LibsType,
      );
      if (result instanceof Error) return fail(result);
      expect(result).toMatchSnapshot();
      return;
    });
    it('Get tokens - apply parsers with custom plugin declared in string', async () => {
      const tokens = seeds().tokens.filter(token => token.type === 'vector');
      const result = await optimizeVector(
        tokens as InputDataType,
        {
          svgo: {
            plugins: ['replace-fill-and-stroke-by-current-color'],
          },
        },
        libs as LibsType,
      );
      if (result instanceof Error) return fail(result);
      expect(result).toMatchSnapshot();
      return;
    });
  });
  describe('Handle no svg vector', () => {
    it('PDF vector must output an url', async () => {
      const tokens = seeds().tokens.filter(token => token.type === 'vector') as Array<VectorToken>;
      const result = await optimizeVector(tokens as InputDataType, undefined, libs as LibsType);
      if (result instanceof Error) return fail(result);
      result.forEach(vector => {
        if (vector.value.format === 'pdf') {
          expect(vector.value.content).toBeFalsy();
          expect(typeof vector.value.url).toBe('string');
        } else {
          expect(typeof vector.value.content).toBe('string');
          expect(vector.value.url).toBeFalsy();
        }
      });
    });
  });
});
