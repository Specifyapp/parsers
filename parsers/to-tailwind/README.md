# To Tailwind

## Description
Format design tokens to create a theme compatible with the [TailwindCSS specification](https://tailwindcss.com/docs/theme).
The theme is also compatible with [WindiCSS](https://windicss.org/).

This parser creates a file containing the whole theme. It can then be used in the `tailwind.config.js`.

The theme created by this parser is compatible with the Tailwind versions >= `2.x`.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).
## Interface

```ts
interface parser {
  name: 'to-tailwind';
  options: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
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
    splitBy?: string;
    renameKeys: PartialRecord<TailwindType, string>;
  }>;
}
```

### Options

| Parameter                          | Required | Type                                                                                                                                                  | Default     | Description                                                                    |
| ---------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `formatName`                       | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase`                                                                                                      | `kebabCase` | The case transformation you want to apply to your design token name            |
| `formatConfig.module`              | optional | `es6` `commonjs` `json`                                                                                                                               | `es6`       | Module loader used to export the result                                        |
| `formatConfig.objectName`          | optional | `string`                                                                                                                                              | `theme`     | Name of exported variable                                                      |
| `formatConfig.endOfLine`           | optional | `auto` `lf` `crlf` `cr`                                                                                                                               | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line) |
| `formatConfig.tabWidth`            | optional | `number`                                                                                                                                              | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)   |
| `formatConfig.useTabs`             | optional | `boolean`                                                                                                                                             | `true`      | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)        |
| `formatConfig.singleQuote`         | optional | `boolean`                                                                                                                                             | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#quotes)      |
| `formatConfig.exportDefault`       | optional | `boolean`                                                                                                                                             | `true`      |                                                                                |
| `formatTokens.colorFormat.format`  | optional | `rgb` `prgb` `hex` `hex6` `hex3` `hex4` `hex8` `name` `hsl` `hsv`                                                                                     | `hex`       | The color format you want to apply to your potential color design token        |
| `formatTokens.fontSizeFormat.unit` | optional | `px` `rem`                                                                                                                                            | `none`      |                                                                                |
| `renameKeys`                       | optional | `{ colors?: string, spacing?: string... }` [full list](https://github.com/Specifyapp/parsers/blob/master/parsers/to-tailwind/to-tailwind.type.ts#L16) | `none`      | Used to rename the generated tokens based on their Tailwind theme keys         |
| `splitBy`                          | optional | `string`                                                                                                                                              | none        | The character used to define the nesting of the values in the generated object |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name, value and type:

```ts
type input = Array<{ name: string; value: any; type: string }>;
```

### Output

String formated in js or json.

```ts
type output = string;
```

## Basic Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-tailwind"
  }
  // …
]
```

### Before/After

#### Input

```jsonc
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

## Complex usage - with specific config for `colorFormat`

### Config

```jsonc
"parsers": [
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
  // …
]
```

### Before/After

#### Input

```jsonc
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

## Complex usage - with specific config for `renameKeys`

### Config

```jsonc
"parsers": [
  {
    "name": "to-tailwind",
    "options": {
      "renameKeys": {
        "colors": "custom-color-{{name}}",
        "spacing": "custom-spacing-{{name}}"
      },
      "formatName": "kebabCase",
      "formatConfig": {
        "objectName": "extend",
        "module": "commonjs"
      }
    }
  }
  // …
]
```

### Before/After

#### Input

```jsonc
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
  }
]
```

#### Output

```js
const extend = {
  colors: {
    'custom-color-primary': '#C6BDFF',
  },
  spacing: {
    'custom-spacing-base-space-01': '4px',
  },
};

module.exports = extend;
```

## Complex usage - with specific config for `splitBy`

### Config

```jsonc
"parsers": [
  {
    "name": "to-tailwind",
    "options": {
      "splitBy": "/",
      "formatConfig": {
        "objectName": "extend",
        "module": "commonjs"
      }
    }
  }
  // …
]
```

### Before/After

#### Input

```jsonc
[
  {
    "name": "danger/100",
    "value": {
      "a": 1,
      "b": 135,
      "g": 33,
      "r": 255
    },
    "type": "color"
  },
  {
    "name": "danger/200",
    "value": {
      "a": 1,
      "b": 33,
      "g": 33,
      "r": 255
    },
    "type": "color"
  }
]
```

#### Output

```js
const extend = {
  colors: {
    danger: {
      100: '#ff2187',
      200: '#ff2121',
    },
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
