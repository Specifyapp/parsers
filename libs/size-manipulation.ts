import { MeasurementValue } from '../types';

function convertMeasurement(
  from: MeasurementValue,
  toUnit: 'px' | 'rem',
  basePixelValue?: number | undefined,
): MeasurementValue;
function convertMeasurement(
  from: string,
  toUnit: 'px' | 'rem',
  basePixelValue?: number | undefined,
): string;
function convertMeasurement(
  from: string | MeasurementValue,
  toUnit: 'px' | 'rem',
  basePixelValue = 16,
): MeasurementValue | string {
  if (!['px', 'rem'].includes(toUnit)) throw new Error('Unknown size unit');
  let fromValue = typeof from === 'object' && 'measure' in from ? from.measure : parseFloat(from);
  const fromUnit = typeof from === 'string' ? from.match(/[\d.\-\+]*\s*(.*)/)![1] || '' : from.unit;
  let pxValue;
  if (fromUnit === 'px') {
    pxValue = fromValue;
  } else if (fromUnit === 'rem') {
    pxValue = fromValue * basePixelValue;
  }
  if (!pxValue) throw new Error('Unknown size unit');

  const result = {
    unit: toUnit === 'px' ? 'px' : 'rem',
    measure: toUnit === 'px' ? pxValue : pxValue / basePixelValue,
  };
  return typeof from === 'string' ? `${result.measure}${result.unit}` : result;
}

export default convertMeasurement;
