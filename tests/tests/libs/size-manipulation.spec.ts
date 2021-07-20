import convertMeasurement from '../../../libs/size-manipulation';

describe('Libs - size manipulation', () => {
  it('Should convert px to rem', async () => {
    expect(
      convertMeasurement(
        {
          unit: 'px',
          measure: 16,
        },
        'rem',
      ),
    ).toEqual({
      measure: 1,
      unit: 'rem',
    });
    return;
  });
  it('Should convert px to rem when input is a string', async () => {
    const result = convertMeasurement('16px', 'rem');
    expect(result).toEqual('1rem');
    return;
  });
  it('Should convert rem to px when input is a string', async () => {
    const result = convertMeasurement('16rem', 'px');
    expect(result).toEqual(`${16 * 16}px`);
    return;
  });
  it('Should trigger error when there is no unit', async () => {
    try {
      convertMeasurement('16', 'rem');
    } catch (err) {
      expect(err.message).toEqual('Unknown size unit');
    }
    return;
  });
  it('Should trigger error when there is unknown unit', async () => {
    try {
      // @ts-ignore
      convertMeasurement('16', 'patate');
    } catch (err) {
      expect(err.message).toEqual('Unknown size unit');
    }
    return;
  });
  it('Should convert rem to px', async () => {
    const result = convertMeasurement(
      {
        unit: 'rem',
        measure: 16,
      },
      'px',
    );
    expect(result).toEqual({
      measure: 16 * 16,
      unit: 'px',
    });
    return;
  });
  it('Should convert px to rem with custom coeff', async () => {
    const result = convertMeasurement(
      {
        unit: 'px',
        measure: 16,
      },
      'rem',
      10,
    );
    expect(result).toEqual({
      measure: 16 / 10,
      unit: 'rem',
    });
    return;
  });
});
