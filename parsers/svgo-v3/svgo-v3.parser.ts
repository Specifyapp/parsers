import { cloneDeep } from 'lodash';
import { Config, CustomPlugin, optimize, PluginConfig } from 'svgo-v3';
import { LibsType } from '../global-libs';
import { DownloadableFile } from '../../types';
import Template from '../../libs/template';
import { BuiltinsWithOptionalParams } from 'svgo-v3/plugins/plugins-types';

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
      svgo?: Config & { plugins?: Array<Exclude<PluginConfig, CustomPlugin>> };
    };

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { _, SpServices }: Pick<LibsType, '_' | 'SpServices'>,
): Promise<OutputDataType | Error> {
  try {
    options = options || {};

    return (await Promise.all(
      tokens.map(async token => {
        if (token.type === 'vector' && token.value.format === 'svg') {
          const baseString = await SpServices.assets.getSource<string>(token.value.url!, 'text');
          try {
            const config = cloneDeep(options);
            if (config?.svgo?.plugins) {
              const prefixPluginIndex =
                config?.svgo?.plugins?.findIndex(
                  plugin => typeof plugin === 'object' && plugin.name === 'prefixIds',
                ) ?? -1;
              const prefixPlugin = config?.svgo?.plugins[prefixPluginIndex];
              if (
                prefixPlugin &&
                typeof prefixPlugin === 'object' &&
                'name' in prefixPlugin &&
                prefixPlugin.name === 'prefixIds' &&
                typeof prefixPlugin.params?.prefix === 'string'
              ) {
                (
                  config.svgo.plugins![prefixPluginIndex] as {
                    params: BuiltinsWithOptionalParams['prefixIds'];
                  }
                ).params.prefix = new Template(prefixPlugin.params.prefix).render(token);
              }
            }
            const result = optimize(baseString, config?.svgo);
            token.value.content = result.data;
          } catch (err) {
            token.value.content = baseString;
          }
          return { ...token, value: _.omit(token.value, ['url']) };
        }

        return token;
      }),
    )) as OutputDataType;
  } catch (err) {
    throw err;
  }
}
