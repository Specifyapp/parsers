import type { OptimizeOptions, DefaultPlugins, OptimizedSvg } from 'svgo';
import { DownloadableFile, VectorToken } from '../../types';
import {
  defaultPresetPlugins,
  DefaultPresetOverride,
  Plugins,
  PluginV1,
  PluginV2,
  DefaultPresetPluginsName,
  DefaultPresetPluginsParams,
} from './svgo.type';
import SVGO from 'svgo';
import { omit } from 'lodash';
import { SpServices } from '../global-libs';

export type InputDataType = Array<VectorToken>;

export type OptionsType =
  | undefined
  | {
      svgo?: Omit<OptimizeOptions, 'plugins'> &
        (
          | { plugins?: Array<DefaultPlugins | DefaultPlugins['name']> }
          | { plugins: Array<PluginV1> }
        );
    };

function getSyntaxPlugin(plugins: NonNullable<Plugins>): 'v1' | 'v2' {
  return plugins.some(plugin => typeof plugin === 'string' || 'name' in plugin) ? 'v2' : 'v1';
}

function migrateSvgoPlugins(plugins?: Plugins): Array<PluginV2> {
  if (!plugins) {
    return [{ name: 'preset-default' }];
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
      if (pluginName && defaultPresetPlugins.includes(pluginName)) {
        acc.overrides[pluginName as DefaultPresetPluginsName] = plugin[
          pluginName as keyof PluginV1
        ] as DefaultPresetPluginsParams;
      } else {
        const params = plugin[pluginName as keyof PluginV1];
        if (params !== false) {
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

export async function svgo<T extends InputDataType>(tokens: T, options: OptionsType) {
  try {
    options = options || {};
    options.svgo = options?.svgo || {};
    options.svgo.plugins = migrateSvgoPlugins(options.svgo.plugins);

    return await Promise.all(
      tokens.map(async token => {
        if (token.type === 'vector' && token.value.format === 'svg') {
          const baseString = await SpServices.assets.getSource<string>(token.value.url!, 'text');
          try {
            const result = SVGO.optimize(baseString, options?.svgo as OptimizeOptions);
            if (result.error) throw result.error;
            token.value.content = (result as OptimizedSvg).data!;
          } catch (err) {
            token.value.content = baseString;
          }
          return { ...token, value: omit(token.value, ['url']) };
        }

        return token;
      }),
    );
  } catch (err) {
    throw err;
  }
}
