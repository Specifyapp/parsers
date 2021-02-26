import { BitmapToken } from '../../../types';
import path from 'path';
import { FormatConfigType, FormatTokenType } from '../to-jss.parser';

export class Bitmap extends BitmapToken {
  constructor(token: Partial<BitmapToken>) {
    super(token);
  }

  toJss(formatTokens: FormatTokenType, formatConfig: FormatConfigType, fileName: string): string {
    if (!formatConfig?.assetsFolderPath) return `'${this.value.url}'`;
    const relPath =
      typeof formatConfig.assetsFolderPath === 'string'
        ? formatConfig.assetsFolderPath
        : formatConfig.assetsFolderPath!.bitmap;
    return `'${path.join(relPath || '', fileName)}'`;
  }
}
