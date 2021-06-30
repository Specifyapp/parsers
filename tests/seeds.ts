import { IToken } from '../types';
import tokens from './fixtures/seeds.json';
import * as _ from 'lodash';

export default (): {
  tokens: Array<IToken>;
} => _.cloneDeep({ tokens }) as { tokens: Array<IToken> };
