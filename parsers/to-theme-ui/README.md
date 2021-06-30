# To Theme Ui 
## Description

Format design tokens to create a theme compatible with the [theme-ui specification](https://theme-ui.com/theme-spec).

## Interface

```ts
interface parser {
  name: 'to-theme-ui',
  options: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    variants: boolean;
    formatConfig: Partial<{
      module: 'es6' | 'commonjs' | 'json';
      objectName: string;
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
      singleQuote: boolean;
      exportDefault: boolean;
    }>;
    formatTokens?: {
      colorFormat?: {
        format: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
      };
      opacityFormat?: {
        type?: 'number' | 'string';
        unit: 'percent' | 'none';
      };
      fontSizeFormat?: {
        type: 'number' | 'string';
        unit?: 'px' | 'rem';
      };
    };
    presets?: {
      fontWeights?: {
        preset: 'base' | Record<string, string | number>;
        freeze?: boolean;
      };
      fontSizes?: {
        preset: 'base' | Array<string | number>;
        unit?: 'px' | 'rem';
        freeze?: boolean;
      };
    };
  }>
}
```

### Options
| Parameter                | Required  | Type                                                     | Default    | Description                                                                    |
| ------------------------ | --------- | -------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `formatName`             | optional     | `camelCase` `kebabCase` `snakeCase` `pascalCase`      | `kebabCase` | The case transformation you want to apply to your design token name            |
| `variants`             | optional     | `boolean`                        | `false` | Generate variants. Currently `texts` and `borders` are generated as variants. [source](https://theme-ui.com/theme-spec#variants).       |
| `formatConfig.module` | optional     | `es6` `commonjs` `json`                                     | `es6`           | Module loader used to export the result |
| `formatConfig.objectName` | optional     | `string`                                     | `theme`           | Name of exported variable |
| `formatConfig.endOfLine` | optional     | `auto` `lf` `crlf` `cr`                                     | `auto`           | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line) |
| `formatConfig.tabWidth`  | optional     | `number`                                                 | `2`           | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)   |
| `formatConfig.useTabs`   | optional     | `boolean`                                                | `true`           | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)        |
| `formatConfig.singleQuote`   | optional     | `boolean`                                                | `false`           | [Prettier documentation](https://prettier.io/docs/en/options.html#quotes)        |
| `formatConfig.exportDefault`   | optional     | `boolean`                                                | `true`           |       |
| `formatTokens.colorFormat.format`     | optional     | `rgb` `prgb` `hex` `hex6` `hex3` `hex4` `hex8` `name` `hsl` `hsv` | `rgb`           | The color format you want to apply to your potential color design token        |
| `formatTokens.opacityFormat.type`  | optional     | `number` `string`                                                 | `number` |  if unit is `percent` type will be `string`                        |
| `formatTokens.opacityFormat.unit`  | optional     | `percent` `none`                                                 | `none` |                          |
| `formatTokens.fontSizeFormat.type`  | optional     | `number` `string`                                                 | `number` |  if unit is `percent` type will be `string`                        |
| `formatTokens.fontSizeFormat.unit`  | optional     | `px` `rem`                                                 | `none` |                          |
| `presets.fontWeights.preset`  | optional     | `base` <code>Record<string, string &#124; number></code>        |   |                          |
| `presets.fontWeights.freeze`  | optional     | `boolean`          | false |          Prevent the edition of the preset                |
| `presets.fontSizes.preset`  | required     | `base` <code>Array<string &#124; number></code>          |  |                          |
| `presets.fontSizes.unit`  | optional     | `px` `rem`         | `px` |                          |
| `presets.fontSizes.freeze`  | optional     | `boolean`          | false |          Prevent the edition of the preset                |

### Preset
A preset is a list of elements that you can arbitrarily add to the final object.

There are two presets you can use:
- Font weight
- Font size

All presets can be frozen to prevent their edition.

#### Font Weight
Using the base preset will return the following object:

```json5
// base
{
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
}
```

On the other hand you can use a custom preset that match the following type:
```ts
Record<string, string | number>
```

#### Font Size
The base preset depends of the unit. 

Choosing `px` returns:
```json5
[
  '8.19px',
  '10.24px',
  '12.8px',
  '16px',
  '20px',
  '25px',
  '31.25px',
  '39.06px',
  '48.83px'
]
```
Choosing `rem` returns:
```json5
[
  '0.512rem',
  '0.64rem',
  '0.8rem',
  '1rem',
  '1.25rem',
  '1.563rem',
  '1.953rem',
  '2.441rem',
  '3.052rem',
]
```

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name, value and type:

```ts
Array<{name: string, value: any, type: string}>
```

### Output

String formated in js or json.

```ts
string;
```

## Basic Usage
### Config

```json
{
  "name": "to-theme-ui"
}
```
### Before/After

#### Input

```json
[
  {
    "name": "primary",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "base-space-01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "body",
    "value": {
      "font": {
        "id": "69d2d62e-4d62-45d7-b85f-5da2f9f0c0d4",
        "name": "Roboto-Regular",
        "value": {
          "fontFamily": "Roboto",
          "fontWeight": 400,
          "fontPostScriptName": "Roboto-Regular"
        },
        "type": "font"
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 16
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 20
        }
      },
      "fontVariant": [
        "small-caps"
      ]
    },
    "type": "textStyle"
  }
]
```
#### Output

```js
const theme = {
  sizes: {
    baseSpace01: "4px"
  },
  colors: {
    primary: "rgb(198, 189, 255)"
  },
  fonts: {
    robotoRegular: "Roboto-Regular"
  },
  fontWeights: {
    robotoRegular: 400
  },
  fontSizes: [16],
  lineHeights: {
    body: "20px"
  }
};

export default theme;
```

## Complex usage - with variant and preset
### Config

```json
{
  "name": "to-theme-ui",
  "options": {
    "variants": true,
    "formatTokens": {
      "colorFormat": {
        "format": "hex"
      },
      "fontSizeFormat": {
        "type": "string",
        "unit": "rem",
        "freeze": true
      }
    },
    "presets": {
      "fontWeights": {
        "preset": "base",
        "freeze": true
      }
    }
  }
}
```
### Before/After

#### Input

```json
[
  {
    "name": "primary",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "base-space-01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "body",
    "value": {
      "font": {
        "id": "69d2d62e-4d62-45d7-b85f-5da2f9f0c0d4",
        "name": "Roboto-Regular",
        "value": {
          "fontFamily": "Roboto",
          "fontWeight": 400,
          "fontPostScriptName": "Roboto-Regular"
        },
        "type": "font"
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 16
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 20
        }
      },
      "fontVariant": [
        "small-caps"
      ]
    },
    "type": "textStyle"
  }
]
```
#### Output

```js
const theme = {
  fontWeights: {
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },
  fontSizes: [
    "0.512rem",
    "0.64rem",
    "0.8rem",
    "0.875rem",
    "1rem",
    "1.25rem",
    "1.563rem",
    "1.953rem",
    "2.441rem",
    "3.052rem",
  ],
  colors: { primary: "#c6bdff" },
  sizes: { baseSpace01: "4px" },
  lineHeights: { body: "20px" },
  text: {
    body: {
      fontFamily: "Roboto-Regular",
      lineHeight: "20px",
      fontSize: "0.875rem",
      fontWeight: 400,
      textAlign: "left",
      verticalAlign: "top",
      fontVariant: "small-caps",
    },
  },
};

export default theme;
```

## ℹ️ Good to know
Use the [link-design-tokens](https://github.com/Specifyapp/parsers/tree/master/parsers/link-design-tokens) parser before this parser to reference color and measurement design tokens in [variants](https://theme-ui.com/theme-spec/#variants).


With this flow you will be able to link `fontSizes, colors` with variants like `texts` or `borders`. 
