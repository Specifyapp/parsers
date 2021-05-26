import { LibsType } from '../global-libs';
import type SVGO from 'svgo';
import { DownloadableFile } from '../../types';

export type InputDataType = Array<
  Record<string, any> & {
    type: string;
    value: { url: string } & { [key: string]: any };
  }
>;
export type OutputDataType = Array<
  InputDataType[0] & {
    value: DownloadableFile & { [key: string]: any };
  }
>;
export type OptionsType =
  | undefined
  | {
      svgo?: SVGO.Options;
    };

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { SVGO, _, SpServices }: Pick<LibsType, 'SVGO' | '_' | 'SpServices'>,
): Promise<OutputDataType | Error> {
  try {
    const optimizer = new SVGO(options?.svgo || {});
    return (await Promise.all(
      tokens.map(async token => {
        if (token.type === 'vector') {
          const baseString = await SpServices.assets.getSource<string>(token.value.url!, 'text');
          token.value.content = await optimizer
            .optimize(baseString)
            .then(({ data }) => data)
            .catch(() => baseString);
          return { ...token, value: _.omit(token.value, ['url']) };
        }

        return token;
      }),
    )) as OutputDataType;
  } catch (err) {
    throw err;
  }
}
