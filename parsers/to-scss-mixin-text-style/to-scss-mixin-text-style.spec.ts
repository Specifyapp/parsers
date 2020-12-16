import seeds from '../../seeds';
import { default as toScssMixinTextStyle, InputDataType } from './to-scss-mixin-text-style.parser';
import libs from '../global-libs';

describe('to-css-text-style', () => {
  it('Get tokens - execute parser', async done => {
    const result = await toScssMixinTextStyle(
      (seeds().tokens.filter(({ type }) => type === 'textStyle') as unknown) as InputDataType,
      undefined,
      libs,
    );
    if (result instanceof Error) return done.fail(result);
    expect(typeof result).toEqual('string');
    expect(
      result.includes(
        '@mixin ts-with-allan-again {\n' +
          '  color: rgb(196, 196, 196);\n' +
          '  font-family: Allan;\n' +
          '  font-size: 12px;\n' +
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
    const result = await toScssMixinTextStyle(
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
    const result = await toScssMixinTextStyle(
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
    const result = await toScssMixinTextStyle(
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
    const result = await toScssMixinTextStyle(
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
        '@mixin utilsLocalTextStylesTextStyle {\n' +
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
        '@mixin utilsFontMissingTextStyle {\n' +
          '  color: #c4c4c4;\n' +
          '  font-family: fira-code, serif;\n' +
          '  font-size: 12px;\n' +
          '  line-height: 1.17;\n' +
          '  text-align: left;\n' +
          '  vertical-align: top;\n' +
          '}',
      ),
    ).toBeTruthy();
    done();
  });
});
