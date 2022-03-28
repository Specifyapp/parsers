import { roundNumber } from './round-number.parser';
import { BorderToken, MeasurementToken, ShadowToken, TextStyleToken, Token } from '../../types';
import { seeds } from '../../tests/seeds';

const countDecimals = function (value: number) {
  if (Math.floor(value) !== value) return value.toString().split('.')[1]!.length || 0;
  return 0;
};

describe('Rounding', () => {
  it('Should round measurement tokens with 2 decimals (default options)', async () => {
    const tokens = seeds();
    const measurementTokens = tokens.filter(token => token.type === 'measurement');
    const result = await roundNumber(measurementTokens, { keys: ['value.measure'] });
    if (result instanceof Error) return fail(result);
    expect(result.length).toEqual(measurementTokens.length);

    (result as Array<MeasurementToken>).forEach(token => {
      expect(countDecimals(token.value.measure)).toBeLessThanOrEqual(2);
    });

    return;
  });

  it('Should round measurement tokens with specific precision', async () => {
    const tokens = seeds();
    const measurementTokens = tokens.filter(token => token.type === 'measurement');
    const precision = 3;
    const result = await roundNumber(measurementTokens, { keys: ['value.measure'], precision });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(measurementTokens.length);

    (result as Array<MeasurementToken>).forEach((token, index) => {
      expect(countDecimals(token.value.measure)).toBeLessThanOrEqual(precision);
    });

    return;
  });

  it('Should truncate measurement if precision is 0', async () => {
    const tokens = seeds();
    const measurementTokens = tokens.filter(token => token.type === 'measurement');
    const precision = 0;
    const result = await roundNumber(measurementTokens, { keys: ['value.measure'], precision });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(measurementTokens.length);

    (result as Array<MeasurementToken>).forEach(token => {
      expect(countDecimals(token.value.measure)).toEqual(precision);
    });

    return;
  });

  it('Should round measurement tokens with mode (down)', async () => {
    const tokens = seeds();
    const measurementTokens = tokens.filter(token => token.type === 'measurement');
    const result = await roundNumber(measurementTokens, { keys: ['value.measure'], mode: 'down' });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(measurementTokens.length);

    (result as Array<MeasurementToken>).forEach(token => {
      expect(countDecimals(token.value.measure)).toBeLessThanOrEqual(2);

      if (token.name === 'feed reboot Investment Account') {
        expect(token.value.measure).toEqual(13.23);
      }
    });

    return;
  });

  it('Should round measurement tokens with mode (up)', async () => {
    const tokens = seeds();
    const measurementTokens = tokens.filter(token => token.type === 'measurement');
    const result = await roundNumber(measurementTokens, { keys: ['value.measure'], mode: 'up' });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(measurementTokens.length);

    (result as Array<MeasurementToken>).forEach(token => {
      expect(countDecimals(token.value.measure)).toBeLessThanOrEqual(2);

      if (token.name === 'feed reboot Investment Account') {
        expect(token.value.measure).toEqual(13.24);
      }
    });

    return;
  });

  it("Should not round if the pattern doesn't match", async () => {
    const tokens = seeds();
    const measurementTokens = tokens.filter(token => token.type === 'measurement');
    const result = await roundNumber(measurementTokens, { keys: ['value[*].measure'] });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(measurementTokens.length);
    expect(result).toEqual(measurementTokens);

    return;
  });

  it('Should round measurement tokens in a more complex token (Text Style)', async () => {
    const tokens = seeds();
    const textStyleTokens = tokens.filter(token => token.type === 'textStyle');
    const result = await roundNumber(textStyleTokens, { keys: ['value.fontSize.value.measure'] });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(textStyleTokens.length);

    (result as Array<TextStyleToken>).forEach(token => {
      expect(countDecimals(token.value.fontSize.value.measure)).toBeLessThanOrEqual(2);
    });

    return;
  });

  it('Should round with multiple keys', async () => {
    const tokens = seeds();
    const textStyleTokens = tokens.filter(token => token.type === 'textStyle');
    const result = await roundNumber(textStyleTokens, {
      keys: ['value.fontSize.value.measure', 'value.lineHeight.value.measure'],
    });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(textStyleTokens.length);

    (result as Array<TextStyleToken>).forEach(token => {
      expect(countDecimals(token.value.fontSize.value.measure)).toBeLessThanOrEqual(2);
      expect(countDecimals(token.value.lineHeight!.value.measure)).toBeLessThanOrEqual(2);
    });

    return;
  });

  it('Should round with multiple keys and multiple types', async () => {
    const tokens = seeds();
    const textStyleAndBorderTokens = tokens.filter(token =>
      ['textStyle', 'border'].includes(token.type),
    );
    const result = await roundNumber(textStyleAndBorderTokens, {
      keys: ['value.fontSize.value.measure', 'value.width.value.measure'],
    });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(textStyleAndBorderTokens.length);

    (result as Array<TextStyleToken | BorderToken>).forEach(token => {
      if (token.type === 'textStyle') {
        expect(
          countDecimals((token as TextStyleToken).value.fontSize.value.measure),
        ).toBeLessThanOrEqual(2);
      } else {
        expect(countDecimals((token as BorderToken).value.width.value.measure)).toBeLessThanOrEqual(
          2,
        );
      }
    });

    return;
  });

  it('Should round within array (blur of shadows)', async () => {
    const tokens = seeds();
    const shadowTokens = tokens.filter(token => token.type === 'shadow');
    const result = await roundNumber(shadowTokens, { keys: ['value[*].blur.value.measure'] });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(shadowTokens.length);

    (result as Array<ShadowToken>).forEach(token => {
      token.value.forEach(shadow => {
        expect(countDecimals(shadow.blur.value.measure)).toBeLessThanOrEqual(2);
      });
    });

    return;
  });

  it('Should round only when it founds the pattern', async () => {
    const tokens = seeds();
    const result = await roundNumber(tokens, {
      keys: ['value[*].blur.value.measure', 'value.fontSize.value.measure'],
    });
    if (result instanceof Error) return fail(result);

    expect(result.length).toEqual(tokens.length);

    result.forEach(token => {
      if (token.type === 'shadow') {
        (token as ShadowToken).value.forEach(shadow => {
          expect(countDecimals(shadow.blur.value.measure)).toBeLessThanOrEqual(2);
        });
      }

      if (token.type === 'textStyle') {
        expect(
          countDecimals((token as TextStyleToken).value.fontSize.value.measure),
        ).toBeLessThanOrEqual(2);
      }
    });

    return;
  });
});
