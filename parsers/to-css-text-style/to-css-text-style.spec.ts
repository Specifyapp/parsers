import { seeds } from '../../tests/seeds';
import { toCssTextStyle } from './to-css-text-style.parser';

describe('to-css-text-style', () => {
  it('Get tokens - execute parser', async () => {
    const result = await toCssTextStyle(seeds(['textStyle']), undefined);
    expect(typeof result).toEqual('string');
    expect(
      result.includes(
        '.title {\n' +
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
    const result = await toCssTextStyle(input, {
      include: ['font-family'],
    });
    expect(result.match(/{\n  font-family: (.*?);\n}/g)?.length).toEqual(input.length);
    return;
  });
  it('Get tokens - execute parser - with options include textStyle properties', async () => {
    const input = seeds(['textStyle']);
    const result = await toCssTextStyle(input, {
      include: ['font'],
    });
    expect(result.match(/{\n  font-family: (.*?);\n  font-weight: (.*?);\n}/g)?.length).toEqual(
      input.length,
    );
    return;
  });
  it('Get tokens - execute parser - with options exclude textStyle properties', async () => {
    const input = seeds(['textStyle']);
    const result = await toCssTextStyle(input, {
      exclude: ['color'],
    });
    expect(result.includes('color')).toBeFalsy();
    return;
  });

  it('Get tokens - execute parser - with several options', async () => {
    const input = seeds(['textStyle']);
    const result = await toCssTextStyle(input, {
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
        '.utilsBodyTextStyle {\n' +
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
        '.utilsCodeTextStyle {\n' +
          '  color: #ff8e05;\n' +
          '  font-family: fira-code-medium, serif;\n' +
          '  font-weight: 500;\n' +
          '  font-size: 13px;\n' +
          '  line-height: 1.54;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '}',
      ),
    ).toBeTruthy();
    expect(
      result.includes(
        '.utilsTitleTextStyle {\n' +
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

  it('Get tokens - execute parser - with options exclude font-weight property', async () => {
    const input = seeds(['textStyle']);
    const result = await toCssTextStyle(input, {
      exclude: ['font-weight'],
    });
    expect(result.includes('font-weight')).toBeFalsy();
    return;
  });
  it('Get tokens - execute parser - with options include font-weight property', async () => {
    const input = seeds(['textStyle']);
    const result = await toCssTextStyle(input, {
      include: ['font-weight'],
    });
    expect(result.match(/{\n  font-weight: (.*?);\n}/g)?.length).toEqual(input.length);
    return;
  });
  it('Get tokens - execute parser - with options include font-weight property and exclude font-family', async () => {
    const input = seeds(['textStyle']);
    const result = await toCssTextStyle(input, {
      include: ['font-weight'],
      exclude: ['font-family'],
    });
    expect(result.match(/{\n  font-weight: (.*?);\n}/g)?.length).toEqual(input.length);
    return;
  });
  it('Should Throw error when typing is incorrect', async () => {
    const input = seeds(['textStyle']);
    await expect(
      toCssTextStyle(
        // @ts-ignore
        'should break',
        undefined,
      ),
    ).rejects.toThrowError(Error);
    return;
  });
});
