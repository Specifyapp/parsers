import type { OptimizeOptions, DefaultPlugins } from 'svgo';
import { LibsType } from '../global-libs';
import { DownloadableFile } from '../../types';
import {
  defaultPresetPlugins,
  DefaultPresetOverride,
  Plugins,
  PluginV1,
  PluginV2,
  DefaultPresetPluginsName, DefaultPresetPluginsParams,
} from './svgo.type';

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
      svgo?: Omit<OptimizeOptions, 'plugins'> &
        ({ plugins?: Array<DefaultPlugins | DefaultPlugins['name']>} | {plugins: Array<PluginV1>});
    };

function getSyntaxPlugin(
  plugins: NonNullable<Plugins>,
): 'v1' | 'v2' {
  return plugins.some(plugin => typeof plugin === 'string' || 'name' in plugin) ? 'v2' : 'v1';
}

function migrateSvgoPlugins(
  plugins?: Plugins,
): Array<PluginV2> {

  if(!plugins){
    return [{ name: 'preset-default'}]
  }

  if (getSyntaxPlugin(plugins) === 'v2') {
    return plugins as Array<PluginV2>;
  }

  const { overrides, pluginsV2 } = (plugins as Array<PluginV1>).reduce<{
    overrides: DefaultPresetOverride;
    pluginsV2: Array<DefaultPlugins>;
  }>(
    (acc, plugin) => {
      const pluginName = Object.keys(plugin)[0];
      if ((defaultPresetPlugins).includes(pluginName)) {
        acc.overrides[pluginName as DefaultPresetPluginsName] = plugin[pluginName as keyof PluginV1] as DefaultPresetPluginsParams;
      } else {
        const params = plugin[pluginName as keyof PluginV1]
        if(params !== false){
          acc.pluginsV2.push({
            name: pluginName,
            params: params,
          } as DefaultPlugins);
        }

      }
      return acc;
    },
    { overrides: {}, pluginsV2: [] },
  );
  return [
    {
      name: 'preset-default',
      params: {
        overrides,
      },
    },
    ...pluginsV2,
  ];
}

export default async function (
  tokens: InputDataType,
  options: OptionsType,
  { SVGO, _, SpServices }: Pick<LibsType, 'SVGO' | '_' | 'SpServices'>,
): Promise<OutputDataType | Error> {
  try {

    options = options || {};
    options.svgo = options?.svgo || {};
    options.svgo.plugins = migrateSvgoPlugins(options.svgo.plugins);

    return (await Promise.all(
      tokens.map(async token => {
        if (token.type === 'vector') {
          const baseString = await SpServices.assets.getSource<string>(token.value.url!, 'text');
          try {
            token.value.content = SVGO.optimize(baseString, options?.svgo as OptimizeOptions).data;
          }catch (err){
            token.value.content = baseString
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
