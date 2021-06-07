# To Tailwind

## Description

Format design tokens to create a theme compatible with the [TailwindCSS specification](https://tailwindcss.com/docs/theme).
The theme is also compatible with [WindiCSS](https://windicss.org/).

This parser creates a file containing the whole theme. It can then be used in the `tailwind.config.js`.

## Interface

```ts
interface parser {
  name: 'to-tailwind';
  options: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase';
    formatTokens: Partial<{
      colorFormat: {
        format: ColorsFormat;
      };
      fontSizeFormat: {
        unit: 'px' | 'rem';
      };
    }>;
    formatConfig: Partial<{
      module: 'es6' | 'commonjs';
      objectName: string;
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
      singleQuote: boolean;
      exportDefault: boolean;
    }>;
  }>;
}
```

### Options

| Parameter                          | Required | Type                                                              | Default     | Description                                                                    |
| ---------------------------------- | -------- | ----------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `formatName`                       | optional | `camelCase` `kebabCase` `snakeCase`                               | `kebabCase` | The case transformation you want to apply to your design token name            |
| `formatConfig.module`              | optional | `es6` `commonjs` `json`                                           | `es6`       | Module loader used to export the result                                        |
| `formatConfig.objectName`          | optional | `string`                                                          | `theme`     | Name of exported variable                                                      |
| `formatConfig.endOfLine`           | optional | `auto` `lf` `crlf` `cr`                                           | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line) |
| `formatConfig.tabWidth`            | optional | `number`                                                          | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)   |
| `formatConfig.useTabs`             | optional | `boolean`                                                         | `true`      | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)        |
| `formatConfig.singleQuote`         | optional | `boolean`                                                         | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#quotes)      |
| `formatConfig.exportDefault`       | optional | `boolean`                                                         | `true`      |                                                                                |
| `formatTokens.colorFormat.format`  | optional | `rgb` `prgb` `hex` `hex6` `hex3` `hex4` `hex8` `name` `hsl` `hsv` | `hex`       | The color format you want to apply to your potential color design token        |
| `formatTokens.fontSizeFormat.unit` | optional | `px` `rem`                                                        | `none`      |                                                                                |

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
  "name": "to-tailwind"
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
      "fontVariant": ["small-caps"]
    },
    "type": "textStyle"
  }
]
```

#### Output

```js
const theme = {
  colors: {
    primary: '#c6bdff',
  },
  fontSize: { body: '16px' },
  lineHeight: { body: '20px' },
  fontFamily: {
    body: ['Roboto-Regular'],
  },
  spacing: {
    'base-space-01': '4px',
  },
};

export default theme;
```

## Complex usage - with specific config

### Config

```json
{
  "name": "to-tailwind",
  "options": {
    "formatTokens": {
      "colorFormat": {
        "format": "rgb"
      }
    },
    "formatConfig": {
      "objectName": "extend",
      "module": "commonjs"
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
      "fontVariant": ["small-caps"]
    },
    "type": "textStyle"
  }
]
```

#### Output

```js
const extend = {
  colors: {
    primary: 'rgb(198, 189, 255)',
  },
  fontSize: { body: '16px' },
  lineHeight: { body: '20px' },
  fontFamily: {
    body: ['Roboto-Regular'],
  },
  spacing: {
    'base-space-01': '4px',
  },
};

module.exports = extend;
```

## ℹ️ Good to know

In your `tailwind.config.js` file, you can easily use the theme in the extend object.

Example:

```js
const themeBySpecify = require('./theme-by-specify');

module.exports = {
  // Whole config
  theme: {
    extend: {
      // add the colors only from Specify
      colors: themeBySpecify.colors,
      spacing: {
        // use the spacing from Specify and add a custom spacing
        ...themeBySpecify.spacing
        'custom-spacing': '8px',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
```
