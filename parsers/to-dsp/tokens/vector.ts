import got from 'got';
import { DownloadableFile, DspEntity, VectorToken } from '../../../types';

export class Vector extends VectorToken {
  constructor(token: Partial<VectorToken>) {
    super(token);
  }

  toDsp(): DspEntity {
    return {
      class: 'token',
      type: 'custom',
      id: this.id!,
      name: this.name,
      value: `assets/${this.name}`,
      tags: ['specify', 'vector'],
    };
  }

  async toDspAssets(): Promise<DownloadableFile> {
    const response = await got(this.value.url);

    return {
      name: `assets/${this.name}`,
      value: {
        content: response.body,
      },
    };
  }
}
