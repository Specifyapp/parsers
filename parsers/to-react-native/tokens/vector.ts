import { VectorToken } from '../../../types';
import { OptionsType } from '../to-react-native.parser';
import { pascalCase } from 'lodash';
import { join } from '../util/path';

export class Vector extends VectorToken {
  constructor(token: Partial<VectorToken>) {
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
        : options.assetsFolderPath!.vector;

    const symbol = `vector${pascalCase(this.name)}`;
    const fullPath = join(relPath || '', fileName);
    return {
      theme: symbol,
      imports: `import ${symbol} from '${fullPath}';\n`,
    };
  }
}
