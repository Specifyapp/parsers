import seeds from '../../tests/seeds';
import libs, { LibsType } from '../global-libs';
import { InputDataType } from './svg-to-tailwind.parser';
import svgToTailwind from './svg-to-tailwind.parser';

describe('Svg to tailwind component', () => {
  it('Get tokens - apply parsers', async () => {
    const tokens = seeds().tokens.filter(({ type }) => type === 'vector');

    const result = await svgToTailwind(tokens as InputDataType, undefined, libs as LibsType);

    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toEqual(true);
    result.forEach(file => {
      expect(typeof file.value.content).toEqual('string');
      expect(file.value.fileName.endsWith('.tsx')).toEqual(true);

      console.warn(file);
    });
    return;
  });
});
