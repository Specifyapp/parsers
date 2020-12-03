import * as seeds from '../../seeds.json';
import convertFont, { OptionsType } from './convert-font.parser';
import { FontFormatList, FontToken } from '../../types';
import { LibsType } from '../global-libs';
import libs from '../global-libs';

describe('convert-font', () => {
  it('Default options', async done => {
    const fonts = seeds.tokens.filter(({ type }) => type === 'font') as Array<FontToken>;
    const result = await convertFont(fonts, undefined, libs as LibsType);
    if (result instanceof Error) return done.fail(result);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(fonts.filter(({ value }) => !value.fontFileMissing).length * 5);
    result.forEach(item => {
      expect(typeof item.value.url).toMatch('string');
    });
    const fontsWithoutMissing = fonts.filter(({ value }) => !value.fontFileMissing);
    expect(result.map(({ name }, index) => name)).toEqual(
      fontsWithoutMissing
        .map(font => {
          return FontFormatList.map(format => `${font.name}.${format}`);
        })
        .flat(2),
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
    expect(result.length).toEqual(fonts.filter(({ value }) => !value.fontFileMissing).length);
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
