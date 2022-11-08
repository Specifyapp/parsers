import libs from '../global-libs';
import seeds from '../../tests/seeds';
import replaceValue from './to-tailwind-var.parser';
import toCssCustomPropertiesParser from '../to-css-custom-properties/to-css-custom-properties.parser';

describe('to-tailwind-var', () => {
  it('Should replace entire variable with color name', async () => {
    const tokens = seeds().tokens.filter(({ type }) => type === 'color');

    const result = await replaceValue(
      tokens,
      {
        filter: {
          types: ['color'],
        },
      },
      libs,
    );

    if (result instanceof Error) return fail(result);

    result.map(token => {
      expect(result.find(({ id }) => token.id === id)!.value).toEqual(`var(--${token.name})`);
    });
  });
  it('Should only replace color variables', async () => {
    const tokens = seeds().tokens;

    const result = await replaceValue(
      tokens,
      {
        filter: {
          types: ['color'],
        },
      },
      libs,
    );

    if (result instanceof Error) return fail(result);

    result.map(token => {
      if (token.type === 'color') {
        expect(result.find(({ id }) => token.id === id)!.value).toEqual(`var(--${token.name})`);
      } else {
        expect(result.find(({ id }) => token.id === id)!.value).toEqual(token.value);
      }
    });
  });
  it('Should replace variable with new formatted name', async () => {
    const formatName = 'kebabCase';

    const tokens = seeds().tokens;
    const result = await replaceValue(
      tokens,
      {
        filter: {
          types: ['color'],
        },
        formatName,
      },
      libs,
    );

    if (result instanceof Error) return fail(result);

    result.map(token => {
      if (token.type === 'color') {
        const formattedName = libs._[formatName](token.name);
        expect(result.find(({ id }) => token.id === id)!.value).toEqual(`var(--${formattedName})`);
      } else {
        expect(result.find(({ id }) => token.id === id)!.value).toEqual(token.value);
      }
    });
  });
});
