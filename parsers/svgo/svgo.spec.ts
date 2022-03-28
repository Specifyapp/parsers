import { seeds } from '../../tests/seeds';
import { svgo } from './svgo.parser';
import SVGO from 'svgo';

describe('Optimize vector', () => {
  describe('SVGO v1', () => {
    it('Get tokens - apply parsers', async () => {
      const tokens = seeds(['vector']);
      const result = await svgo(tokens, undefined);
      if (result instanceof Error) return fail(result);
      expect(result.find(({ name }) => name === 'alert-circle')!.value.content).toEqual(
        '<svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 36.667c9.205 0 16.667-7.462 16.667-16.667 0-9.205-7.462-16.667-16.667-16.667-9.205 0-16.667 7.462-16.667 16.667 0 9.205 7.462 16.667 16.667 16.667ZM20 13.333V20M20 26.667h.017" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      );
      expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
        '<svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.333 28.333H6.667A3.333 3.333 0 0 1 3.333 25V8.333A3.333 3.333 0 0 1 6.667 5h26.666a3.333 3.333 0 0 1 3.334 3.333V25a3.333 3.333 0 0 1-3.334 3.333h-1.666" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m20 25 8.333 10H11.667L20 25Z" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      );
      expect(result.find(({ name }) => name === 'airplay')!.value).toEqual(
        expect.objectContaining({
          format: 'svg',
          content: expect.any(String),
        }),
      );
      return;
    });
    it('Get tokens - apply parsers - with config', async () => {
      const tokens = seeds(['vector']);
      const result = await svgo(tokens, {
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
      });
      if (result instanceof Error) return fail(result);
      expect(result.find(({ name }) => name === 'alert-circle')!.value.content).toEqual(
        '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 20C36.6667 10.7952 29.2047 3.33331 20 3.33331C10.7953 3.33331 3.33334 10.7952 3.33334 20C3.33334 29.2047 10.7953 36.6666 20 36.6666Z" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 13.3333V20" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 26.6667H20.0167" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      );
      expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
        '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.33333 28.3333H6.66666C5.78261 28.3333 4.93476 27.9821 4.30964 27.357C3.68452 26.7319 3.33333 25.8841 3.33333 25V8.33333C3.33333 7.44928 3.68452 6.60143 4.30964 5.97631C4.93476 5.35119 5.78261 5 6.66666 5H33.3333C34.2174 5 35.0652 5.35119 35.6903 5.97631C36.3155 6.60143 36.6667 7.44928 36.6667 8.33333V25C36.6667 25.8841 36.3155 26.7319 35.6903 27.357C35.0652 27.9821 34.2174 28.3333 33.3333 28.3333H31.6667" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 25L28.3333 35H11.6667L20 25Z" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      );
      return;
    });

    it('should send error', async () => {
      try {
        await svgo(
          // @ts-ignore
          'Wrong data (should be catch by ts in real life)',
          undefined,
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

      const tokens = seeds(['vector']);
      const result = await svgo(tokens, {
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
      });
      if (result instanceof Error) return fail(result);
      // Dimensions not removed
      expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
        `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.33333 28.3333H6.66666C5.78261 28.3333 4.93476 27.9821 4.30964 27.357C3.68452 26.7319 3.33333 25.8841 3.33333 25V8.33333C3.33333 7.44928 3.68452 6.60143 4.30964 5.97631C4.93476 5.35119 5.78261 5 6.66666 5H33.3333C34.2174 5 35.0652 5.35119 35.6903 5.97631C36.3155 6.60143 36.6667 7.44928 36.6667 8.33333V25C36.6667 25.8841 36.3155 26.7319 35.6903 27.357C35.0652 27.9821 34.2174 28.3333 33.3333 28.3333H31.6667" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 25L28.3333 35H11.6667L20 25Z" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
      );

      return;
    });

    it('should remove dimensions', async () => {
      const tokens = seeds(['vector']);
      const result = await svgo(tokens, {
        svgo: {
          plugins: [
            {
              removeDimensions: true,
            },
          ],
        },
      });
      if (result instanceof Error) return fail(result);
      expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
        '<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M8.333 28.333H6.667A3.333 3.333 0 0 1 3.333 25V8.333A3.333 3.333 0 0 1 6.667 5h26.666a3.333 3.333 0 0 1 3.334 3.333V25a3.333 3.333 0 0 1-3.334 3.333h-1.666" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m20 25 8.333 10H11.667L20 25Z" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      );

      return;
    });
  });
  describe('SVGO v2', () => {
    it('Get tokens - apply parsers', async () => {
      const tokens = seeds(['vector']);
      const result = await svgo(tokens, {
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
      });
      if (result instanceof Error) return fail(result);
      expect(result.find(({ name }) => name === 'alert-circle')!.value.content).toEqual(
        '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M20 36.667c9.205 0 16.667-7.462 16.667-16.667 0-9.205-7.462-16.667-16.667-16.667-9.205 0-16.667 7.462-16.667 16.667 0 9.205 7.462 16.667 16.667 16.667ZM20 13.333V20M20 26.667h.017" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      );
      expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
        '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M8.333 28.333H6.667A3.333 3.333 0 0 1 3.333 25V8.333A3.333 3.333 0 0 1 6.667 5h26.666a3.333 3.333 0 0 1 3.334 3.333V25a3.333 3.333 0 0 1-3.334 3.333h-1.666" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/><path d="m20 25 8.333 10H11.667L20 25Z" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      );
      expect(result.find(({ name }) => name === 'airplay')!.value).toEqual(
        expect.objectContaining({
          format: 'svg',
          content: expect.any(String),
        }),
      );
      return;
    });
  });
  describe('Handle no svg vector', () => {
    it('PDF vector must output an url', async () => {
      const tokens = seeds(['vector']);
      const result = await svgo(tokens, undefined);
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
