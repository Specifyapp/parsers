import { seeds } from '../../seeds';
import { createConfig } from '../../../libs/create-config';
import { omit, toScssMap, toScssMixinTextStyle } from '../../../scripts/parsersPipeable';

describe('Pipe - omit -> to-scss-map', () => {
  it('Should omit font-family from textStyle with to-scss-map', async () => {
    try {
      const result = createConfig(
        omit({
          keys: ['value.font.name', 'value.font.value.fontPostScriptName'],
        }),
        toScssMap(),
      );

      (await result.run(seeds(['textStyle']))).forEach(file => {
        expect(typeof file.value.content).toEqual('string');
        expect(file.value.content?.includes('font-family')).toBeFalsy();
        expect(file.value.content?.includes('font-weight')).toBeTruthy();
      });
      return;
    } catch (err) {
      throw err;
    }
  });
  it('Should omit font-family from textStyle with to-scss-mixin-text-style', async () => {
    try {
      const result = await createConfig(
        omit({
          keys: ['value.font.name', 'value.font.value.fontPostScriptName'],
        }),
        toScssMixinTextStyle(),
      ).run(seeds(['textStyle']));
      expect(typeof result).toEqual('string');
      expect(result.includes('font-family')).toBeFalsy();
      expect(result.includes('font-weight')).toBeTruthy();
      return;
    } catch (err) {
      throw err;
    }
  });
});
