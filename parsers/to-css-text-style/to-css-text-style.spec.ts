import seeds from '../../tests/seeds';
import { default as toCssTextStyle, InputDataType } from './to-css-text-style.parser';
import libs from '../global-libs';

describe('to-css-text-style', () => {
  it('Get tokens - execute parser', async done => {
    const result = await toCssTextStyle(
      (seeds().tokens.filter(({ type }) => type === 'textStyle') as unknown) as InputDataType,
      undefined,
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    expect(typeof result).toEqual('string');
    expect(
      result.includes(
        '.title {\n' +
          '  color: rgb(196, 196, 196);\n' +
          '  font-family: Inter;\n' +
          '  font-size: 32px;\n' +
          '  line-height: 40px;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '  text-decoration: underline;\n' +
          '  text-indent: 5px;\n' +
          '}',
      ),
    ).toBeTruthy();
    done();
  });
  it('Get tokens - execute parser - with options include css properties', async done => {
    const input = (seeds().tokens.filter(
      ({ type }) => type === 'textStyle',
    ) as unknown) as InputDataType;
    const result = await toCssTextStyle(
      input,
      {
        include: ['font-family'],
      },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    expect(result.match(/{\n  font-family: (.*?);\n}/g)?.length).toEqual(input.length);
    done();
  });
  it('Get tokens - execute parser - with options include textStyle properties', async done => {
    const input = (seeds().tokens.filter(
      ({ type }) => type === 'textStyle',
    ) as unknown) as InputDataType;
    const result = await toCssTextStyle(
      input,
      {
        include: ['font'],
      },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    expect(result.match(/{\n  font-family: (.*?);\n}/g)?.length).toEqual(input.length);
    done();
  });
  it('Get tokens - execute parser - with options exclude textStyle properties', async done => {
    const input = (seeds().tokens.filter(
      ({ type }) => type === 'textStyle',
    ) as unknown) as InputDataType;
    const result = await toCssTextStyle(
      input,
      {
        exclude: ['color'],
      },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    expect(result.includes('color')).toBeFalsy();
    done();
  });

  it('Get tokens - execute parser - with several options', async done => {
    const input = (seeds().tokens.filter(
      ({ type }) => type === 'textStyle',
    ) as unknown) as InputDataType;
    const result = await toCssTextStyle(
      input,
      {
        prefix: 'utils-',
        suffix: '-text-style',
        colorFormat: 'hex',
        cssClassFormat: 'camelCase',
        fontFamilyFormat: 'kebabCase',
        genericFamily: 'serif',
        relativeLineHeight: true,
      },
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    expect(
      result.includes(
        '.utilsBodyTextStyle {\n' +
          '  color: #c4c4c4;\n' +
          '  font-family: inter, serif;\n' +
          '  font-size: 14px;\n' +
          '  line-height: 1.43;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '}',
      ),
    ).toBeTruthy();
    expect(
      result.includes(
        '.utilsCodeTextStyle {\n' +
          '  color: #ff8e05;\n' +
          '  font-family: fira-code, serif;\n' +
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
          '  color: #c4c4c4;\n' +
          '  font-family: inter, serif;\n' +
          '  font-size: 32px;\n' +
          '  line-height: 1.25;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '  text-decoration: underline;\n' +
          '  text-indent: 5px;\n' +
          '}',
      ),
    ).toBeTruthy();
    done();
  });
});
