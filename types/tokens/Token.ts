import { Source } from '../Providers';
import { TokensType, TokensValues } from './index';
import crypto from 'crypto';
import { LinkableTokensSignaturesValue } from '../utils/utils';

export interface IToken {
  originId?: string;
  id: string;
  type: TokensType;
  value: TokensValues;
  name: string;
  meta?: any;
  createdAt?: string;
  updatedAt?: string;
  source?: Source;
  sourceId?: string;
  repositoryId?: string;
}

export abstract class Token<T extends TokensValues> implements IToken {
  originId: string;
  id: string;
  type: TokensType;
  value!: T;
  meta?: any;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  source?: Source;
  sourceId?: string;
  repositoryId?: string;

  constructor(element: Partial<Token<TokensValues>>) {
    this.originId = element?.originId || '';
    this.type = element.type!;
    this.meta = element?.meta || {};
    this.name = element?.name || 'No name';
    this.createdAt = element?.createdAt || undefined;
    this.updatedAt = element?.updatedAt || undefined;
    this.source = element?.source || undefined;
    this.sourceId = element?.sourceId || element?.source?.id || undefined;
    this.id = element.id!;
    // if (element?.id) this.id = element.id;
  }

  computeSignature(value: string) {
    return crypto.createHash('md5').update(value).digest('hex');
  }

  match<T extends { id: string }, U>(
    value: U,
    indexes: LinkableTokensSignaturesValue,
    tokens: Array<T>,
  ): T | { value: U } {
    const signature = this.computeSignature(JSON.stringify(value));
    return indexes[signature]
      ? tokens.find(({ id }) => id === indexes[signature]) || { value }
      : { value };
  }
}

export default Token;
