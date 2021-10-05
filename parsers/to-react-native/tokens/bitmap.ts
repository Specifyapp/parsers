import { BitmapToken } from '../../../types';
import path from 'path';
import { OptionsType } from '../to-react-native.parser';

export class Bitmap extends BitmapToken {
  constructor(token: Partial<BitmapToken>) {
    super(token);
  }

  toReactNative(options: OptionsType, fileName: string): { theme: string; imports: string } {
    if (!options?.assetsFolderPath) {
      return {
        theme: JSON.stringify({
          uri: `'${this.value.url}'`,
        }),
        imports: '',
      };
    }

    const relPath =
      typeof options.assetsFolderPath === 'string'
        ? options.assetsFolderPath
        : options.assetsFolderPath!.bitmap;

    const symbol = `asset${this.name.charAt(0).toUpperCase()}${this.name.slice(1)}`;
    const fullPath = path.join(relPath || '', fileName);
    return {
      theme: symbol,
      imports: `import ${symbol} from '${fullPath}';\n`,
    };
  }
}
