# Name asset files by pattern

## Description

This parser helps you set a structured filename on your assets. It won't rename your asset but only add a new `filename` property on the asset object. The filename structure uses [mustache](https://github.com/janl/mustache.js#templates) as a template engine.

## Interface

```ts
interface parser {
  name: 'name-assets-files-by-pattern';
  options: {
    pattern: string;
  };
}
```

### Options

| Parameter | Required | Type     | Default | Description                                                                                                                        |
| --------- | -------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pattern` | required | `string` |         | The pattern used to generate files names. It must match [mustache](https://github.com/janl/mustache.js#templates) template syntax. |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object containing at least the keys described in the pattern option.

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
  "name": "name-assets-files-by-pattern",
  "options": {
    "pattern": "{{name}}-{{type}}.{{format}}"
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
    "name": "Warning"
  }
]
```

## Complex usage - with condition in template

### Config

```jsonc
{
  "name": "name-assets-files-by-pattern",
  "options": {
    "pattern": "{{name}}{{#dimension}}@{{dimension}}{{/dimension}}.{{format}}"
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
    "name": "bitmapExampleWithDimension"
  },
  {
    "type": "bitmap",
    "value": {
      "url": "https://...",
      "format": "webp"
    },
    "name": "bitmapExampleWithoutDimension"
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
      "dimension": "2x",
      "fileName": "bitmapExampleWithDimension@2x.png"
    },
    "name": "bitmapExampleWithDimension"
  },
  {
    "type": "bitmap",
    "value": {
      "url": "https://...",
      "format": "webp",
      "fileName": "bitmapExampleWithoutDimension.webp"
    },
    "name": "bitmapExampleWithoutDimension"
  }
]
```
