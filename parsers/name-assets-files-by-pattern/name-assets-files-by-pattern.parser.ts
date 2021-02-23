import { LibsType } from '../global-libs';

type RAW_VALUE = 'text';
type ESCAPED_VALUE = 'name';
type UNESCAPED_VALUE = '&';
type SECTION = '#';
type INVERTED = '^';
type COMMENT = '!';
type PARTIAL = '>';
type EQUAL = '=';

type TemplateSpanType =
  | RAW_VALUE
  | ESCAPED_VALUE
  | SECTION
  | UNESCAPED_VALUE
  | INVERTED
  | COMMENT
  | PARTIAL
  | EQUAL;

type TemplateSpans = Array<
  | [TemplateSpanType, string, number, number]
  | [TemplateSpanType, string, number, number, TemplateSpans, number]
  | [TemplateSpanType, string, number, number, string, number, boolean]
>;

export type InputDataType = Array<Record<string, any>>;
export type OutputDataType = InputDataType;
export type OptionsType = {
  pattern: string;
};

function flattenVariablesFromParseTree(acc: TemplateSpans, variable: TemplateSpans[0]) {
  if (variable[0] === 'name' || variable[0] === '&') {
    acc = [...acc, variable];
  } else if (variable[0] === '#') {
    acc = [
      ...acc,
      (variable[4] as TemplateSpans).reduce(flattenVariablesFromParseTree, [])[0],
    ] as TemplateSpans;
  }
  return acc;
}

// get value from the asset.
// if the key is in the value property you can skip value.
// ex: "{{value.format}}" is same as "{{format}}"
function getValueFn(key: string, asset: InputDataType[0], { _ }: Pick<LibsType, '_'>) {
  return _.get(asset, key, _.get(asset, `value[${key}]`, ''));
}

export default async function (
  assets: InputDataType,
  options: OptionsType,
  libs: Pick<LibsType, 'Mustache' | '_'>,
): Promise<OutputDataType> {
  try {
    // Extract all variables name used in the template to attribute a allow the attribution of a specific function in the next step
    const keys = libs.Mustache.parse(options.pattern)
      .reduce(flattenVariablesFromParseTree, [])
      .map(v => v[1]);

    return assets.map(asset => {
      // Associate to each variable in the template a function to retrieve the correspondent value
      const views = keys.reduce<Record<string, (() => string) | InputDataType[0]>>((acc, key) => {
        libs._.set(acc, key, getValueFn(key, asset, libs));
        return acc;
      }, {});

      // set the current asset to make it available in "getValueFn".
      // attribute the fileName key from the template engine
      libs._.set(asset, 'value.fileName', libs.Mustache.render(options.pattern, views));
      return asset;
    });
  } catch (err) {
    throw err;
  }
}
