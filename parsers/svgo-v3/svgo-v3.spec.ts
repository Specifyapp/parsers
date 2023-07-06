import seeds from '../../tests/seeds';
import optimizeVector, { InputDataType } from './svgo-v3.parser';
import libs, { LibsType } from '../global-libs';
import { VectorToken } from '../../types';

describe('Optimize vector', () => {
  it('Get tokens - apply parsers', async () => {
    const tokens = seeds().tokens.filter(token => token.type === 'vector');
    const result = await optimizeVector(tokens as InputDataType, undefined, libs as LibsType);
    if (result instanceof Error) return fail(result);
    expect(result).toMatchSnapshot();
    return;
  });
  it('Get tokens - apply parsers with svgo plugins', async () => {
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
  it('Get tokens - apply parsers with template in prefixIds plugin', async () => {
    const tokens = seeds().tokens.filter(token => token.type === 'vector');
    const result = await optimizeVector(
      tokens as InputDataType,
      {
        svgo: {
          plugins: [
            {
              name: 'removeDimensions',
            },
            {
              name: 'convertColors',
              params: {
                currentColor: true,
              },
            },
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: ['focusable="false"'],
              },
            },
            {
              name: 'prefixIds',
              params: {
                prefix: '{{name}}-id',
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
