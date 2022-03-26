import tokens from './fixtures/seeds.json';
import { Token } from '../types';
import { cloneDeep } from 'lodash';

export const seeds = () => cloneDeep(tokens as Array<Token>);
