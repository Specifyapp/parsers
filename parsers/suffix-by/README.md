# Suffix By

## Description

Allows to concatenate two strings.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli).

## Interface

```ts
interface parser {
  name: 'suffix-by';
  options?: {
    key?: string;
    suffix: string;
    types?: Array<string>;
  };
}
```

### Options

| Parameter | Required | Type            | Default | Description                                                                                                                       |
| --------- | -------- | --------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `key`     | optional | `string`        | "name"  | The key of the value will be suffixed                                                                                             |
| `suffix`  | required | `string`        |         | The pattern used generate suffix string. It must match [mustache](https://github.com/janl/mustache.js#templates) template syntax. |
| `types`   | optional | `Array<string>` |         | The types where the function will be applied                                                                                      |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with the keys to apply the suffix

```ts
type input = Array<{ [key: string]: any }>;
```

### Output

```ts
type output = Array<{ [key: string]: any }>;
```

## Basic usage

### Config

```jsonc
{
  "name": "suffix-by",
  "options": {
    "types": ["vector"],
    "suffix": ".svg",
    "key": "name"
  }
}
// …
```

### Before/After

#### Input

```jsonc
[
  {
    "type": "vector",
    "value": {
      "url": "https://...",
      "format": "svg"
    },
    "name": "Warning"
  }
]
```

#### Output

```jsonc
[
  {
    "type": "vector",
    "value": {
      "url": "https://...",
      "format": "svg",
      "fileName": "Warning-vector.svg"
    },
    "name": "Warning.svg"
  }
]
```

## Complex usage - with condition in template

### Config

```jsonc
{
  "name": "suffix-by",
  "options": {
    "types": ["bitmap"],
    "suffix": "{{#value.dimension}}@{{value.dimension}}{{/value.dimension}}.{{value.format}}",
    "key": "name"
  }
}
// …
```

### Before/After

#### Input

```jsonc
[
  {
    "type": "bitmap",
    "value": {
      "url": "https://...",
      "format": "png",
      "dimension": "2x"
    },
    "name": "photo-example"
  },
  {
    "type": "bitmap",
    "value": {
      "url": "https://...",
      "format": "webp"
    },
    "name": "photo-example"
  }
]
```

#### Output

```jsonc
[
  {
    "type": "bitmap",
    "value": {
      "url": "https://...",
      "format": "png",
      "dimension": "2x"
    },
    "name": "photo-example@2x.png"
  },
  {
    "type": "bitmap",
    "value": {
      "url": "https://...",
      "format": "webp"
    },
    "name": "photo-example.webp"
  }
]
```
