import type { OptimizeOptions, DefaultPlugins, OptimizedSvg } from 'svgo';
import { LibsType } from '../global-libs';
import { DownloadableFile } from '../../types';
import {
  defaultPresetPlugins,
  DefaultPresetOverride,
  Plugins,
  PluginV1,
  PluginV2,
  DefaultPresetPluginsName,
  DefaultPresetPluginsParams,
} from './svgo.type';
import { CustomPlugin } from 'svgo';

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
        ({ plugins?: Array<PluginV2> } | { plugins: Array<PluginV1> });
    };

function getSyntaxPlugin(plugins: NonNullable<Plugins>): 'v1' | 'v2' {
  return plugins.some(plugin => typeof plugin === 'string' || 'name' in plugin) ? 'v2' : 'v1';
}

function migrateSvgoPlugins(plugins?: Plugins): Array<PluginV2> {
  if (!plugins) {
    return [{ name: 'preset-default' }];
  }

  const replaceFillAndStrokeByCurrentColorIndex = plugins.findIndex(
    elm =>
      (typeof elm === 'object' &&
        'name' in elm &&
        elm.name === 'replace-fill-and-stroke-by-current-color') ||
      (typeof elm === 'string' && elm === 'replace-fill-and-stroke-by-current-color'),
  );
  if (replaceFillAndStrokeByCurrentColorIndex !== -1) {
    plugins[replaceFillAndStrokeByCurrentColorIndex] = {
      type: 'perItem',
      name: 'replace-fill-and-stroke-by-current-color',
      fn: item => {
        if (!item.isElem()) return;
        if (!item.hasAttr('stroke') && !item.hasAttr('fill') && !item.hasAttr('color')) return;

        // @ts-ignore
        item.eachAttr(attr => {
          const name = attr.name;
          const value = attr.value;
          const isColorAttr = name === 'stroke' || name === 'fill' || name === 'color';

          if (!isColorAttr || value === 'none') return;

          item.attr(name).value = 'currentColor';
        });
      },
    } as CustomPlugin;
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
      if (defaultPresetPlugins.includes(pluginName)) {
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
        if (token.type === 'vector' && token.value.format === 'svg') {
          const baseString = await SpServices.assets.getSource<string>(token.value.url!, 'text');
          try {
            const result = SVGO.optimize(baseString, options?.svgo as OptimizeOptions);
            if (result.error) throw result.error;
            token.value.content = (result as OptimizedSvg).data!;
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
