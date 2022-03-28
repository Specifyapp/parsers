import { seeds } from '../../tests/seeds';
import { toScssMixinTextStyle } from './to-scss-mixin-text-style.parser';

describe('to-css-text-style', () => {
  it('Get tokens - execute parser', async () => {
    const result = await toScssMixinTextStyle(seeds(['textStyle']), undefined);
    expect(typeof result).toEqual('string');
    expect(
      result.includes(
        '@mixin title {\n' +
          '  color: rgb(30, 33, 43);\n' +
          '  font-family: Inter-SemiBold;\n' +
          '  font-weight: 600;\n' +
          '  font-size: 32px;\n' +
          '  line-height: 40px;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '  text-transform: uppercase;\n' +
          '  text-decoration: underline;\n' +
          '  text-indent: 5px;\n' +
          '}',
      ),
    ).toBeTruthy();
    return;
  });
  it('Get tokens - execute parser - with options include css properties', async () => {
    const input = seeds(['textStyle']);
    const result = await toScssMixinTextStyle(input, {
      include: ['font-family'],
    });
    expect(result.match(/{\n  font-family: (.*?);\n}/g)?.length).toEqual(input.length);
    return;
  });
  it('Get tokens - execute parser - with options include textStyle properties', async () => {
    const input = seeds(['textStyle']);
    const result = await toScssMixinTextStyle(input, {
      include: ['font'],
    });
    expect(result.match(/{\n  font-family: (.*?);\n  font-weight: (.*?)\n}/gm)?.length).toEqual(
      input.length,
    );
    return;
  });
  it('Get tokens - execute parser - with options exclude textStyle properties', async () => {
    const input = seeds(['textStyle']);
    const result = await toScssMixinTextStyle(input, {
      exclude: ['color'],
    });
    expect(result.includes('color')).toBeFalsy();
    return;
  });

  it('Get tokens - execute parser - with several options', async () => {
    const input = seeds(['textStyle']);
    const result = await toScssMixinTextStyle(input, {
      prefix: 'utils-',
      suffix: '-text-style',
      colorFormat: 'hex',
      cssClassFormat: 'camelCase',
      fontFamilyFormat: 'kebabCase',
      genericFamily: 'serif',
      relativeLineHeight: true,
    });
    expect(
      result.includes(
        '@mixin utilsBodyTextStyle {\n' +
          '  color: #1e212b;\n' +
          '  font-family: inter-medium, serif;\n' +
          '  font-weight: 500;\n' +
          '  font-size: 14px;\n' +
          '  line-height: 1.43;\n' +
          '  letter-spacing: 10px;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '}',
      ),
    ).toBeTruthy();
    expect(
      result.includes(
        '@mixin utilsTitleTextStyle {\n' +
          '  color: #1e212b;\n' +
          '  font-family: inter-semi-bold, serif;\n' +
          '  font-weight: 600;\n' +
          '  font-size: 32px;\n' +
          '  line-height: 1.25;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '  text-transform: uppercase;\n' +
          '  text-decoration: underline;\n' +
          '  text-indent: 5px;\n' +
          '}',
      ),
    ).toBeTruthy();
    return;
  });
});
