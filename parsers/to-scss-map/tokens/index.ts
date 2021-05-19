import { DesignTokensType } from '../../../types';
import { ScssMapHandlerType } from '../to-scss-map.type';

import borderHandler from './border';
import borderRadiusHandler from './borderRadius';
import colorHandler from './color';
import depthHandler from './depth';
import durationHandler from './duration';
import gradientHandler from './gradient';
import measurementHandler from './measurement';
import opacityHandler from './opacity';
import shadowHandler from './shadow';
import textStyleHandler from './textStyle';

const handlers: Record<DesignTokensType, Array<ScssMapHandlerType>> = {
  color: [colorHandler],
  depth: [depthHandler],
  border: [borderHandler, borderRadiusHandler],
  duration: [durationHandler],
  gradient: [gradientHandler],
  measurement: [measurementHandler],
  opacity: [opacityHandler],
  shadow: [shadowHandler],
  textStyle: [textStyleHandler],
};

export function parseFloatIfString(value: string | number) {
  return typeof value === 'string' ? parseFloat(value) : value;
}

export function sortObjectByValue(obj: Record<string, string | number>) {
  return Object.entries(obj)
    .sort(([, a], [, b]) => parseFloatIfString(a) - parseFloatIfString(b))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

export function sortObjectByKey(obj: Record<string, string | number>) {
  return Object.entries(obj)
    .sort(([a], [b]) => a.charCodeAt(0) - b.charCodeAt(0))
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

export default handlers;
