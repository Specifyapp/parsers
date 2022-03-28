import { createConfig } from '../../../libs/create-config';
import { svgo, svgToJsx } from '../../../scripts/parsersPipeable';
import { seeds } from '../../seeds';

describe('Pipe - svgo -> svg-to-jsx', () => {
  it('Should compress svg and wrap it in a jsx component', async () => {
    try {
      const result = createConfig(svgo(), svgToJsx());
      if (result instanceof Error) return fail(result);
      (await result.run(seeds())).forEach(file => {
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
