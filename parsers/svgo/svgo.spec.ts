import seeds from '../../tests/seeds';
import optimizeVector, { InputDataType } from './svgo.parser';
import libs, { LibsType } from '../global-libs';
import SVGO from 'svgo';

describe('Optimize vector', () => {
  it('Get tokens - apply parsers', async () => {
    const tokens = seeds().tokens;
    const result = await optimizeVector(tokens as InputDataType, undefined, libs as LibsType);
    if (result instanceof Error) return fail(result);
    expect(result.find(({ name }) => name === 'alert-circle')!.value.content).toEqual(
      '<svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 36.667c9.205 0 16.667-7.462 16.667-16.667 0-9.205-7.462-16.667-16.667-16.667-9.205 0-16.667 7.462-16.667 16.667 0 9.205 7.462 16.667 16.667 16.667zM20 13.333V20M20 26.667h.017" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    );
    expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
      '<svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.333 28.333H6.667A3.333 3.333 0 013.333 25V8.333A3.333 3.333 0 016.667 5h26.666a3.333 3.333 0 013.334 3.333V25a3.333 3.333 0 01-3.334 3.333h-1.666" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 25l8.333 10H11.667L20 25z" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
    expect(result.find(({ name }) => name === 'alert-circle')!.value.content).toEqual(
      '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 20C36.6667 10.7952 29.2047 3.33331 20 3.33331C10.7953 3.33331 3.33334 10.7952 3.33334 20C3.33334 29.2047 10.7953 36.6666 20 36.6666Z" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 13.3333V20" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 26.6667H20.0167" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    );
    expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
      '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.33333 28.3333H6.66666C5.78261 28.3333 4.93476 27.9821 4.30964 27.357C3.68452 26.7319 3.33333 25.8841 3.33333 25V8.33333C3.33333 7.44928 3.68452 6.60143 4.30964 5.97631C4.93476 5.35119 5.78261 5 6.66666 5H33.3333C34.2174 5 35.0652 5.35119 35.6903 5.97631C36.3155 6.60143 36.6667 7.44928 36.6667 8.33333V25C36.6667 25.8841 36.3155 26.7319 35.6903 27.357C35.0652 27.9821 34.2174 28.3333 33.3333 28.3333H31.6667" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 25L28.3333 35H11.6667L20 25Z" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    );
    return;
  });

  interface SvgInfo {
    path?: string;
  }

  interface OptimizedSvg {
    data: string;
    info: {
      width: string;
      height: string;
    };
    path?: string;
  }
  it('should send error', async () => {
    class customSVGO extends SVGO {
      constructor(config?: SVGO.Options) {
        super(config);
      }
      optimize(svgString: string, info?: SvgInfo): Promise<OptimizedSvg> {
        throw new Error('Needed error');
        return super.optimize(svgString, info);
      }
    }
    const tokens = seeds().tokens;
    try {
      await optimizeVector(tokens as InputDataType, undefined, {
        ...libs,
        SVGO: customSVGO,
      } as LibsType);
    } catch (error) {
      expect(error.message).toEqual('Needed error');
    }

    return;
  });

  it('should send an error after optimize', async () => {
    class customSVGO extends SVGO {
      constructor(config?: SVGO.Options) {
        super(config);
      }
      optimize(svgString: string, info?: SvgInfo): Promise<OptimizedSvg> {
        const p: Promise<OptimizedSvg> = new Promise((resolve, reject) => {
          reject('Error here');
        });

        return p;
      }
    }
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
      {
        ...libs,
        SVGO: customSVGO,
      } as LibsType,
    );
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
    expect(result.find(({ name }) => name === 'airplay')!.value.content).toEqual(
      '<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M8.333 28.333H6.667A3.333 3.333 0 013.333 25V8.333A3.333 3.333 0 016.667 5h26.666a3.333 3.333 0 013.334 3.333V25a3.333 3.333 0 01-3.334 3.333h-1.666" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 25l8.333 10H11.667L20 25z" stroke="#000" stroke-width="3.333" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    );

    return;
  });
});
