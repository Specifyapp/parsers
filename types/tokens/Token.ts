import { Source } from '../Providers/Sources';
import { TokensValues } from './index';

export interface TokenInterface {
  originId: string;
  name: string;
  type: string;
  value: TokensValues;
  meta?: any;
  createdAt?: string;
  updatedAt?: string;
  source?: Source;
}

export abstract class Token {
  originId: string;
  id?: string;
  type: string;
  value!: TokensValues;
  meta?: any;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  source?: Source;
  sourceId?: string;

  constructor(element?: Partial<Token>) {
    this.originId = element?.originId || '';
    this.type = '';
    this.meta = element?.meta || {};
    this.name = element?.name || 'No name';
    this.createdAt = element?.createdAt || undefined;
    this.updatedAt = element?.updatedAt || undefined;
    this.source = element?.source || undefined;
    this.sourceId = element?.sourceId || element?.source?.id || undefined;
    if (element?.id) this.id = element.id;
  }
}

export default Token;
