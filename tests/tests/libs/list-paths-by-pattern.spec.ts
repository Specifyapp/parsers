import listPathsByPattern from '../../../libs/list-paths-by-pattern';
import seeds from '../../seeds';
import { ShadowToken } from '../../../types';
import _ from 'lodash';

describe('Libs - list path by pattern', () => {
  it('Should return as many elements as there are in the shadow array', async () => {
    const tokens = seeds().tokens;
    const pattern = 'value[*].blur.value.measure';
    tokens
      .filter(({ type }) => type === 'shadow')
      .forEach(token => {
        const result = listPathsByPattern(token, pattern);
        expect((token.value as ShadowToken['value']).length).toEqual(result.length);
        result.forEach((elm, index) => {
          expect(elm).toEqual(pattern.replace('[*]', `[${index}]`));
        });
      });
    return;
  });

  it('Should return as many elements as there are in seeds', async () => {
    const pattern = '[*][*].name';
    const base = [
      [
        {
          name: 1,
        },

        {
          name: 2,
        },
      ],
      [
        {
          name: 3,
        },

        {
          name: 4,
        },
      ],
    ];
    const result = listPathsByPattern(base, pattern);
    expect(result.length).toEqual(base.flat(2).length);
    result.forEach((path, index) => expect(_.get(base, path)).toEqual(index + 1));
    return;
  });

  it('Should not return any elements', async () => {
    const pattern = 'name[*]';
    const base = [
      {
        name: 'random-string',
      },

      {
        name: 2,
      },
    ];
    const result = listPathsByPattern(base, pattern);
    expect(result.length).toEqual(0);
    return;
  });

  it('Should return elements which exist included undefined, 0 or false ', async () => {
    const pattern = '[*].name';
    const base = [
      {
        name: false,
      },

      {
        name: 0,
      },
      {
        name: undefined,
      },
    ];
    const result = listPathsByPattern(base, pattern);
    expect(result.length).toEqual(3);
    return;
  });

  it('should loop through the matrix to find the bar key and loop through the array to find foo', async () => {
    const pattern = '[*][*].bar[*].foo';
    const token = [
      [
        {
          bar: 1,
        },
        {
          foo: 1,
        },
      ],
      [
        {
          foo: 1,
        },
        {
          bar: [
            {
              foo: 2,
            },
          ],
        },
      ],
    ];
    const result = listPathsByPattern(token, pattern);
    const expectedResult = ['[1][1].bar[0].foo'];
    expect(result).toEqual(expectedResult);
    return;
  });

  it('should work with a pattern that include specific index instead of *', async () => {
    const pattern = '[0][*].bar';
    const token = [
      [
        {
          bar: 1,
        },
        {
          bar: 2,
        },
      ],
      [
        {
          bar: 3,
        },
      ],
    ];
    const result = listPathsByPattern(token, pattern);
    const expectedResult = ['[0][0].bar', '[0][1].bar'];
    expect(result).toEqual(expectedResult);
    return;
  });
});
