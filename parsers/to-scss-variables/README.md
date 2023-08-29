# To SCSS Variables

## Description

This parser helps you transform design tokens in SCSS variables.

Learn more about how to configure Specify in the API documentation: [https://docs.specifyapp.com/getting-started/getting-started](https://docs.specifyapp.com/getting-started/getting-started).

## Interface

```ts
interface parser {
  name: 'to-scss-variables';
  options?: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    formatTokens: Partial<{
      color: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
    }>;
    formatConfig: Partial<{
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
    }>;
  }>;
}
```

### Options

| Parameter                | Required | Type                                                              | Default     | Description                                                                    |
| ------------------------ | -------- | ----------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `formatName`             | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase`                  | `kebabCase` | The case transformation you want to apply to your design token name            |
| `formatTokens.color`     | optional | `rgb` `prgb` `hex` `hex6` `hex3` `hex4` `hex8` `name` `hsl` `hsv` | `rgb`       | The color format you want to apply to your potential color design token        |
| `formatConfig.endOfLine` | optional | `auto` `lf` `crlf` `cr`                                           | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line) |
| `formatConfig.tabWidth`  | optional | `number`                                                          | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)   |
| `formatConfig.useTabs`   | optional | `boolean`                                                         | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)        |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name, value and type

```ts
type input = Array<{ name: string; value: any; type: string }>;
```

### Output

String formated in scss

```ts
type output = string;
```

## Basic Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-scss-variables"
  }
  // …
]
```

### Before/After

#### Input

```jsonc
[
  {
    "type": "color",
    "value": {
      "a": 0.96,
      "b": 20,
      "g": 227,
      "r": 122
    },
    "name": "Primary color"
  }
]
```

#### Output

```scss
/* COLOR */
$primary-color: rgba(122, 227, 20, 0.96);
```

## Complex Usage - Create CSS Custom Properties, change format color values and change CSS selector

### Config

```jsonc
{
  "name": "to-scss-variables",
  "options": {
    "formatTokens": {
      "color": "hsl"
    },
    "formatConfig": {
      "tabWidth": 4
    }
  }
}
```

### Before/After

#### Input

```jsonc
[
  {
    "type": "color",
    "value": {
      "a": 0.96,
      "b": 20,
      "g": 227,
      "r": 122
    },
    "name": "Primary color"
  }
]
```

#### Output

```scss
/* COLOR */
$primary-color: hsla(90, 84%, 48%, 0.96);
```
