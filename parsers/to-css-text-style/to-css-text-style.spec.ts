import seeds from '../../seeds';
import { default as toCssTextStyle, InputDataType } from './to-css-text-style.parser';
import libs, { LibsType } from '../global-libs';
import { TextStyleValue } from '../../types';

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
        '.ts-with-allan-again {\n' +
          '  color: rgb(196, 196, 196);\n' +
          '  font-family: Allan;\n' +
          '  font-size: 12.1px;\n' +
          '  line-height: 12px;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '  text-transform: uppercase;\n' +
          '  text-decoration: line-through;\n' +
          '  text-indent: 10px;\n' +
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
        '.utilsLocalTextStylesTextStyle {\n' +
          '  color: #c4c4c4;\n' +
          '  font-family: allan, serif;\n' +
          '  font-size: 16px;\n' +
          '  line-height: 1;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '}',
      ),
    ).toBeTruthy();
    expect(
      result.includes(
        '.utilsFontMissingTextStyle {\n' +
          '  color: #c4c4c4;\n' +
          '  font-family: fira-code, serif;\n' +
          '  font-size: 12.7px;\n' +
          '  line-height: 1.11;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '}',
      ),
    ).toBeTruthy();
    done();
  });
});
