import seeds from '../../tests/seeds';
import { default as pxToRem, InputDataType } from './px-to-rem.parser';
import libs, { LibsType } from '../global-libs';
import { TextStyleValue } from '../../types';

describe('px-to-rem', () => {
  it('Get tokens - execute parser', async done => {
    const inputData = (seeds().tokens.filter(
      ({ type }) => type === 'textStyle',
    ) as unknown) as InputDataType;
    const result = await pxToRem(inputData, { keys: ['value.fontSize'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach((textStyle, index) => {
      const unit = (textStyle.value as TextStyleValue).fontSize.value.unit;
      const measure = (textStyle.value as TextStyleValue).fontSize.value.measure;
      expect(unit).toEqual('rem');
      expect(measure * 16).toEqual(
        (inputData[index].value as TextStyleValue).fontSize.value.measure * 16,
      );
    });
    done();
  });
  it('Get tokens - execute parser - with predicate config', async done => {
    const inputData = (seeds().tokens.filter(
      ({ type }) => type === 'textStyle',
    ) as unknown) as InputDataType;
    const result = await pxToRem(inputData, { keys: ['fontSize'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach((textStyle, index) => {
      const unit = (textStyle.value as TextStyleValue).fontSize.value.unit;
      const measure = (textStyle.value as TextStyleValue).fontSize.value.measure;
      expect(unit).toEqual('rem');
      expect(measure * 16).toEqual(
        (inputData[index].value as TextStyleValue).fontSize.value.measure * 16,
      );
    });
    done();
  });
  it('Get tokens - execute parser - with basePixelValue', async done => {
    const inputData = (seeds().tokens.filter(
      ({ type }) => type === 'textStyle',
    ) as unknown) as InputDataType;
    const result = await pxToRem(inputData, { keys: ['fontSize.value'], basePixelValue: 20 }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach((textStyle, index) => {
      const unit = (textStyle.value as TextStyleValue).fontSize.value.unit;
      const measure = (textStyle.value as TextStyleValue).fontSize.value.measure;
      expect(unit).toEqual('rem');
      expect(measure * 20).toEqual(
        (inputData[index].value as TextStyleValue).fontSize.value.measure * 20,
      );
    });
    done();
  });
});
