import { DepthValue } from '../../../types';
import { sortObjectByValue } from './index';
import { ScssMapHandlerType } from '../to-scss-map.type';

const handler: ScssMapHandlerType = {
  name: 'depth',
  run: value => {
    return (value as DepthValue).depth;
  },
  sort(list: Record<string, any>) {
    return sortObjectByValue(list);
  },
};

export default handler;
