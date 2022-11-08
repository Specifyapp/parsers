import seeds from '../../tests/seeds';
import libs, { LibsType } from '../global-libs';
import { InputDataType } from './svg-to-tailwind.parser';
import svgToTailwind from './svg-to-tailwind.parser';
import fs from 'fs';
import path from 'path';

describe('Svg to tailwind component', () => {
  it('Get tokens - apply parsers', async () => {
    const tokens = seeds().tokens.filter(({ type }) => type === 'vector');

    const result = await svgToTailwind(tokens as InputDataType, undefined, libs as LibsType);

    if (result instanceof Error) return fail(result);
    expect(Array.isArray(result)).toEqual(true);
    result.forEach(file => {
      fs.writeFileSync(file.value.fileName, file.value.content);
      expect(typeof file.value.content).toEqual('string');
      expect(file.value.fileName.endsWith('.tsx')).toEqual(true);

      const reg = new RegExp(
        `export default \\(\\) => \\(\\n  <svg([\\s\\S]*)>([\\s\\S]*)<\\/svg>\\n\\);`,
        'gm',
      );
      // expect(file.value.content).toMatch(reg);
    });
    return;
  });
  // it('Should return filename with tsx extension', async () => {
  //   const tokens = seeds().tokens.filter(({ type }) => type === 'vector');
  //   const result = await svgToTailwind(
  //     tokens as InputDataType,
  //     { formatConfig: {  } },
  //     libs as LibsType,
  //   );
  //   if (result instanceof Error) return fail(result);
  //   result.forEach(file => {
  //     expect(file.value.fileName.endsWith('.tsx')).toEqual(true);
  //   });
  //   return;
  // });
});
