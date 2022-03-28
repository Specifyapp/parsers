import { VectorToken } from '../../../types/tokens/Vector';
import path from 'path';
import { FormatConfigType, FormatTokenType } from '../to-jss.parser';

export class Vector extends VectorToken {
  constructor(token: Partial<VectorToken>) {
    super(token);
  }

  toJss(formatTokens: FormatTokenType, formatConfig: FormatConfigType, fileName: string): string {
    if (!formatConfig?.assetsFolderPath) return `'${this.value.url}'`;
    const relPath =
      typeof formatConfig.assetsFolderPath === 'string'
        ? formatConfig.assetsFolderPath
        : formatConfig.assetsFolderPath!.vector;
    return `'${path.join(relPath || '', fileName)}'`;
  }
}
