import { BitmapToken } from '../../../types';
import path from 'path';
import { OptionsType } from '../to-react-native.parser';

export class Bitmap extends BitmapToken {
  constructor(token: Partial<BitmapToken>) {
    super(token);
  }

  toReactNative(options: OptionsType, fileName: string): { theme: string } {
    if (!options?.assetsFolderPath) {
      return {
        theme: JSON.stringify({
          uri: `'${this.value.url}'`,
        }),
      };
    }

    const relPath =
      typeof options.assetsFolderPath === 'string'
        ? options.assetsFolderPath
        : options.assetsFolderPath!.bitmap;

    const fullPath = path.join(relPath || '', fileName);
    return {
      theme: `require('./${fullPath}')`,
    };
  }
}
