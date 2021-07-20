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

  it('Should return ', async () => {
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
});
