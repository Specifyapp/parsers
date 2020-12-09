import { MeasurementValue } from '../types';

export default function convertMeasurement(
  from: MeasurementValue | string,
  toUnit: 'px' | 'rem',
  basePixelValue = 16,
): MeasurementValue {
  if (!['px', 'rem'].includes(toUnit)) throw new Error('Unknown size unit');
  let fromValue = typeof from === 'object' && 'measure' in from ? from.measure : parseFloat(from);
  const fromUnit =
    typeof from === 'string'
      ? from.match(/[\d.\-\+]*\s*(.*)/)![1] || ''
      : (from as MeasurementValue).unit;

  let pxValue;
  if (fromUnit === 'px') {
    pxValue = fromValue;
  } else if (fromUnit === 'rem') {
    pxValue = fromValue * basePixelValue;
  }
  if (!pxValue) throw new Error('Unknown size unit');

  // Convert length in pixels to the output unit
  if (toUnit === 'px') {
    return {
      unit: 'px',
      measure: pxValue,
    };
  }
  return {
    unit: 'rem',
    measure: pxValue / basePixelValue,
  };
}
