import { BitmapToken } from '../../../types/tokens/Bitmap';
import { DspEntity } from '../dsp.type';
import { DownloadableFile } from '../../../types';

export class Bitmap extends BitmapToken {
  constructor(token: Partial<BitmapToken>) {
    super(token);
  }

  toDsp(): DspEntity {
    return {
      class: 'token',
      type: 'custom',
      id: this.id!,
      name: this.name,
      value: `assets/${this.name}`,
      tags: ['specify', 'bitmap'],
    };
  }

  async toDspAssets(): Promise<DownloadableFile> {
    return {
      name: `assets/${this.name}`,
      value: {
        url: this.value.url,
      },
    };
  }
}
