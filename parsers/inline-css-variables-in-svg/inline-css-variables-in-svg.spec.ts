import seeds from '../../tests/seeds';
import { IToken } from '../../types';
import libs, { LibsType } from '../global-libs';
import svgWithCssVariables, {
  InputDataType,
  OptionsType,
} from './inline-css-variables-in-svg.parser';

const getValuesToTest = async (options?: OptionsType) => {
  const tokens = seeds().tokens.filter(({ type }) => type === 'vector' || type === 'color');

  const result = await svgWithCssVariables(tokens as InputDataType, options, libs as LibsType);

  if (result instanceof Error) return fail(result);

  const beforeSvgs = tokens.filter(
    ({ type, value }) => type === 'vector' && 'format' in value && value.format === 'svg',
  );

  const afterSvgs = result.filter(({ type, value }) => type === 'vector' && value.format === 'svg');

  return [beforeSvgs, afterSvgs];
};

describe('Svg with css variables', () => {
  it('Get tokens - apply parsers', async () => {
    const [beforeSvgs, afterSvgs] = await getValuesToTest();

    expect(beforeSvgs.length).toEqual(afterSvgs.length);

    for (let i = 0; i < beforeSvgs.length; i++) {
      const beforeSvg = (beforeSvgs[i] as IToken & { value: { content: string } }).value.content;
      const afterSvg = (afterSvgs[i] as IToken & { value: { content: string } }).value.content;

      if (
        (beforeSvg.includes('fill="black"') &&
          !afterSvg.includes('fill="var(--colors-pure-black)"')) ||
        (beforeSvg.includes('stroke="black"') &&
          !afterSvg.includes('stroke="var(--colors-pure-black)"'))
      ) {
        throw new Error("'black' hasn't been converted to variable");
      }

      if (
        (beforeSvg.includes('fill="#1A1A1C"') &&
          !afterSvg.includes('fill="var(--colors-almost-black)"')) ||
        (beforeSvg.includes('stroke="#1A1A1C"') &&
          !afterSvg.includes('stroke="var(--colors-almost-black)"'))
      ) {
        throw new Error("'#1A1A1C' hasn't been converted to variable");
      }
    }
  });

  it('Get tokens - apply parsers with none format', async () => {
    const [beforeSvgs, afterSvgs] = await getValuesToTest({ cssVariablesFormat: 'none' });

    expect(beforeSvgs.length).toEqual(afterSvgs.length);

    for (let i = 0; i < beforeSvgs.length; i++) {
      const beforeSvg = (beforeSvgs[i] as IToken & { value: { content: string } }).value.content;
      const afterSvg = (afterSvgs[i] as IToken & { value: { content: string } }).value.content;

      if (
        (beforeSvg.includes('fill="black"') &&
          !afterSvg.includes('fill="var(--\\"Colors/PureBlack\\")"')) ||
        (beforeSvg.includes('stroke="black"') &&
          !afterSvg.includes('stroke="var(--\\"Colors/PureBlack\\")"'))
      ) {
        throw new Error("'black' hasn't been converted to variable");
      }

      if (
        (beforeSvg.includes('fill="#1A1A1C"') &&
          !afterSvg.includes('fill="var(--\\"Colors/AlmostBlack\\")"')) ||
        (beforeSvg.includes('stroke="#1A1A1C"') &&
          !afterSvg.includes('stroke="var(--\\"Colors/AlmostBlack\\")"'))
      ) {
        throw new Error("'#1A1A1C' hasn't been converted to variable");
      }
    }
  });
});
