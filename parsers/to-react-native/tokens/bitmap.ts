import { BitmapToken } from '../../../types';
import { OptionsType } from '../to-react-native.parser';
import { pascalCase } from 'lodash';
import { join } from '../util/path';

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

    const symbol = `bitmap${pascalCase(this.name)}`;
    const fullPath = join(relPath || '', fileName);
    return {
      theme: symbol,
      imports: `import ${symbol} from '${fullPath}';\n`,
    };
  }
}
