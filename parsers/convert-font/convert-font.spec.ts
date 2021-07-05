import Path from 'path';
import seeds from '../../tests/seeds';
import convertFont, { OptionsType } from './convert-font.parser';
import { AllowedFormat, FontToken } from '../../types';
import { LibsType } from '../global-libs';
import libs from '../global-libs';

describe('convert-font', () => {
  it('Default options', async done => {
    const fonts = seeds().tokens.filter(({ type }) => type === 'font') as Array<FontToken>;
    const result = await convertFont(fonts, undefined, libs as LibsType);
    if (result instanceof Error) return done.fail(result);
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(fonts.filter(({ value }) => !value.fontFileMissing).length * 2);
    result.forEach(item => {
      expect(typeof item.value.url).toMatch('string');
      expect(['woff2', 'woff'].includes(Path.extname(item.value.format).substring(1)));
    });
    const fontsWithoutMissing = fonts.filter(({ value }) => !value.fontFileMissing);
    expect(result.map(({ value }) => value.fileName)).toEqual(
      fontsWithoutMissing
        .map(font => ['woff2', 'woff'].map(format => `${font.name}.${format}`))
        .flat(2),
    );
    done();
  });
  it('Several options', async done => {
    const fonts = seeds().tokens.filter(({ type }) => type === 'font') as Array<FontToken>;
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
      expect(
        options.formats!.includes(Path.extname(item.value.format).substring(1) as AllowedFormat),
      );
      const expectedName = libs._.kebabCase(
        `${fonts[index].value.fontFamily}-${fonts[index].value.fontWeight}-${fonts[index].name}`,
      );
      expect(item.value.fileName).toEqual(`${expectedName}.woff`);
    });
    done();
  });
});
