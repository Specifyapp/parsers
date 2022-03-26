import { DesignTokensType } from '../../../types';
import { ScssMapHandlerType } from '../to-scss-map.type';

import { handler as borderHandler } from './border';
import { handler as borderRadiusHandler } from './borderRadius';
import { handler as colorHandler } from './color';
import { handler as depthHandler } from './depth';
import { handler as durationHandler } from './duration';
import { handler as gradientHandler } from './gradient';
import { handler as measurementHandler } from './measurement';
import { handler as opacityHandler } from './opacity';
import { handler as shadowHandler } from './shadow';
import { handler as textStyleHandler } from './textStyle';

const handlers: Record<Pick<DesignTokensType, 'type'>['type'], Array<ScssMapHandlerType>> = {
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
