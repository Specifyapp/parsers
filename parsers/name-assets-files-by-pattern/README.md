# Name asset files by pattern

## Description
This parser helps you set a structured filename on your assets. It won't rename your asset but only add a new `filename` property on the asset object. The filename structure uses [mustache](https://github.com/janl/mustache.js#templates) as a template engine.

Learn more about how to configure Specify in the API documentation: [https://docs.specifyapp.com/getting-started/getting-started](https://docs.specifyapp.com/getting-started/getting-started).

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

## Output
Please keep in mind that this parser generates files. This is why you should always set a folder as the final `path` in your parent rule.

<details open>
<summary>See Do & Don't config examples</summary>

✅ Do
```
// ...
"rules": [
  {
    "name": "Assets",
    "path": "assets", // <-- path set as a folder
    "parsers": [
      {
        "name": "name-assets-files-by-pattern"
      }
    ]
  }
]
```

🚫 Don't
```
// ...
"rules": [
  {
    "name": "Assets",
    "path": "assets/assets.json", // <-- path set as a file
    "parsers": [
      {
        "name": "name-assets-files-by-pattern"
      }
    ]
  }
]
```
</details>

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
"parsers": [
  {
    "name": "name-assets-files-by-pattern",
    "options": {
      "pattern": "{{name}}-{{type}}.{{format}}"
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
"parsers": [
  {
    "name": "name-assets-files-by-pattern",
    "options": {
      "pattern": "{{name}}{{#dimension}}@{{dimension}}{{/dimension}}.{{format}}"
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
      "fileName": "bitmapExampleWithDimension@2x.png" // <---
    },
    "name": "bitmapExampleWithDimension"
  },
  {
    "type": "bitmap",
    "value": {
      "url": "https://...",
      "format": "webp",
      "fileName": "bitmapExampleWithoutDimension.webp" // <---
    },
    "name": "bitmapExampleWithoutDimension"
  }
]
```
