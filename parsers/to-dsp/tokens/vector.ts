import { DownloadableFile, VectorToken } from '../../../types';
import { DspEntity } from '../dsp.type';
import { LibsType } from '../../global-libs';

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

  async toDspAssets(SpServices: LibsType['SpServices']): Promise<DownloadableFile> {
    const response =
      this.value.content || (await SpServices.assets.getSource<string>(this.value.url!, 'text'));

    return {
      name: `assets/${this.name}`,
      value: {
        content: response,
      },
    };
  }
}
