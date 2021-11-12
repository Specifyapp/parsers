import libs, { LibsType } from '../../../parsers/global-libs';
import {
  default as toSvgo,
  InputDataType as SvgoInputDataType,
} from '../../../parsers/svgo/svgo.parser';
import {
  default as svgToJsx,
  InputDataType as SvgToJsxInputDataType,
} from '../../../parsers/svg-to-jsx/svg-to-jsx.parser';
import seeds from '../../seeds';

describe('Pipe - svgo -> svg-to-jsx', () => {
  it('Should compress svg and wrap it in a jsx component', async () => {
    try {
      const compressedToken = await toSvgo(
        seeds().tokens as SvgoInputDataType,
        undefined,
        libs as LibsType,
      );
      const result = await svgToJsx(
        compressedToken as unknown as SvgToJsxInputDataType,
        undefined,
        libs as LibsType,
      );
      if (result instanceof Error) return fail(result);
      result.forEach(file => {
        expect(typeof file.value.content).toEqual('string');
        expect(file.value.fileName.endsWith('.jsx')).toEqual(true);
        const reg = new RegExp(
          `export default \\(\\) => \\(\\n  <svg([\\s\\S]*)>([\\s\\S]*)<\\/svg>\\n\\);`,
          'gm',
        );
        expect(file.value.content).toMatch(reg);
      });
      return;
    } catch (err) {
      fail();
    }
    return;
  });
});
