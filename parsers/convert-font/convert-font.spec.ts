import * as seeds from '../../seeds.json';
import convertFont, { OptionsType } from './convert-font.parser';
import { FontFormatList, FontToken } from '../../types';
import { LibsType } from '../global-libs';
import libs from '../global-libs';

describe('convert-font', () => {
  it('Default options', async done => {
    const fonts = [seeds.tokens.find(({ type }) => type === 'font')] as Array<FontToken>;
    const result = await convertFont(fonts, undefined, libs as LibsType);
    if (result instanceof Error) return done.fail(result);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(5);
    result.forEach(item => {
      expect(typeof item.value.url).toMatch('string');
    });
    expect(result.map(({ name }) => name)).toEqual(
      FontFormatList.map(format => `${fonts[0].name}.${format}`),
    );
    done();
  });
  it('Several options', async done => {
    const fonts = seeds.tokens.filter(({ type }) => type === 'font') as Array<FontToken>;
    const options: OptionsType = {
      formats: ['woff'],
      fileNameKey: ['fontFamily', 'value.fontWeight', 'name'],
      fileNameFormat: 'kebabCase',
    };
    const result = await convertFont(fonts, options, libs as LibsType);
    if (result instanceof Error) return done.fail(result);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(fonts.length);
    result.forEach((item, index) => {
      expect(typeof item.value.url).toMatch('string');
      const expectedName = libs._.kebabCase(
        `${fonts[index].value.fontFamily}-${fonts[index].value.fontWeight}-${fonts[index].name}`,
      );
      expect(item.name).toEqual(`${expectedName}.woff`);
    });
    done();
  });
});
