import libs, { LibsType } from '../../../parsers/global-libs';
import omit from '../../../parsers/omit/omit.parser';
import {
  default as toScssMap,
  InputDataType as ToScssMapInputType,
} from '../../../parsers/to-scss-map/to-scss-map.parser';
import {
  default as toScssMixin,
  InputDataType as toScssMixinInputType,
} from '../../../parsers/to-scss-mixin-text-style/to-scss-mixin-text-style.parser';
import seeds from '../../seeds';

describe('Pipe - omit -> to-scss-map', () => {
  it('Should omit font-family from textStyle with to-scss-map', async () => {
    try {
      const textStylesWithoutFontName = await omit(
        seeds().tokens.filter(({ type }) => type === 'textStyle'),
        {
          keys: ['value.font.name', 'value.font.value.fontPostScriptName'],
        },
        libs as LibsType,
      );
      const result = await toScssMap(
        textStylesWithoutFontName as unknown as ToScssMapInputType,
        undefined,
        libs as LibsType,
      );

      result.forEach(file => {
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
      const textStylesWithoutFontName = await omit(
        seeds().tokens.filter(({ type }) => type === 'textStyle'),
        {
          keys: ['value.font.name', 'value.font.value.fontPostScriptName'],
        },
        libs as LibsType,
      );
      const result = await toScssMixin(
        textStylesWithoutFontName as unknown as toScssMixinInputType,
        undefined,
        libs as LibsType,
      );
      expect(typeof result).toEqual('string');
      expect(result.includes('font-family')).toBeFalsy();
      expect(result.includes('font-weight')).toBeTruthy();
      return;
    } catch (err) {
      throw err;
    }
  });
});
