import tokens from './fixtures/seeds.json';
import { IToken } from '../types/tokens/Token';
import * as _ from 'lodash';

export default (): {
  tokens: Array<IToken>;
} => _.cloneDeep({ tokens }) as { tokens: Array<IToken> };
