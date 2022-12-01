# Prefix By

## Description
This parser helps you concatenate two strings.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

## Interface

```ts
interface parser {
  name: 'prefix-by';
  options?: {
    key?: string;
    prefix: string;
    applyOn?: Array<string>;
  };
}
```

### Options

| Parameter | Required | Type            | Default | Description                                                                                                                       |
| --------- | -------- | --------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `key`     | optional | `string`        | "name"  | The key of the value will be prefixed                                                                                             |
| `prefix`  | required | `string`        |         | The pattern used generate prefix string. It must match [mustache](https://github.com/janl/mustache.js#templates) template syntax. |
| `applyOn`   | optional | `Array<string>` |         | The types of design tokens and assets on which the function is applied                                                                                      |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with the keys to apply the prefix

```ts
type input = Array<{ [key: string]: any }>;
```

### Output

```ts
type output = Array<{ [key: string]: any }>;
```

## Basic usage #1: Prefixing design tokens

### Config

```jsonc
"parsers": [
  {
    "name": "prefix-by",
    "options": {
      "applyOn": ["color"],
      "prefix": "ds-",
      "key": "name"
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
    "type": "color",
    "name": "red-100",
    "value": {
      "a": 1,
      "b": 226,
      "g": 226,
      "r": 254,
    },
  }
]
```

#### Output

```jsonc
[
  {
    "type": "color",
    "name": "ds-red-100",
    "value": {
      "a": 1,
      "b": 226,
      "g": 226,
      "r": 254,
    },
  }
]
```

## Basic usage #2: Adding a comment at the beginning of a file
This parser should be used once your final design tokens are generated. This example shows how it works for CSS but you're free to add a prefix as a comment for whatever code SPecify generates for you (SCSS, Sass, JavaScript...).
### Config

```jsonc
"parsers": [
  {
    "name": "prefix-by",
    "options": {
      "prefix": "/* This is a CSS comment \non several lines */",
    }
  }
  // …
]
```

### Before/After

#### Input

```css
:root {
  --red-100: rgb(254, 226, 226);
}
```

#### Output

```css
/* This is a CSS comment
on several lines */

:root {
  --red-100: rgb(254, 226, 226);
}
```