import { IToken } from '../types';
import tokens from './fixtures/seeds.json';

export default (): {
  tokens: Array<IToken>;
} => ({ tokens } as { tokens: Array<IToken> });
