# Filter

## Description

Filters the tokens by their name using a provided regular expression.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli).

## Interface

```ts
interface parser {
  name: 'filter';
  options: {
    key: string;
    regex:
      | {
          pattern: string;
          flags?: string;
        }
      | string;
  };
}
```

### Options

| Parameter       | Required | Type              | Default | Description                                                                                                                                                                                                                                                  |
| --------------- | -------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`           | required | `string`          |         | Key path to apply the filter function.                                                                                                                                                                                                                       |
| `regex`         | required | `object` `string` |         | If you need to define flags inside the [constructor of the regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor), use the `object` notation. Otherwise use the `string` notation. |
| `regex.pattern` | required | `string`          |         | The pattern of the regex used as first argument of the [constructor of the regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor).                                                 |
| `regex.flags`   | optional | `string`          |         | The flags to use for regex. In the regex constructor it's the second argument [constructor of the regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor).                          |

### Good to know

Under the hood the regex is built as:

`let re = new RegExp('ab+c', 'i') // constructor with string pattern as first argument`

Where `ab+c` is the regex option in `string` or the `regex.pattern` in object. The second argument is the flags in options.

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

```ts
type input = Array<Record<string, any>>;
```

### Output

```ts
type output = Array<Record<string, any>>;
```

## Basic Usage

### Config

```json
{
  "name": "filter",
  "options": {
    "key": "name",
    "regex": {
      "pattern": "Background",
      "flags": "g"
    }
  }
}
```

With this config, we will filter the elements containing the word "Background".

### Before/After

#### Input

```json5
[
  {
    // …
    name: 'BackgroundColor',
    value: {
      a: 1,
      b: 128,
      g: 255,
      r: 255,
    },
    type: 'color',
    // …
  },
  {
    // …
    name: 'Colors/Accent',
    value: {
      a: 1,
      b: 255,
      g: 189,
      r: 198,
    },
    type: 'color',
    // …
  },
]
```

#### Output

```json5
[
  {
    // …
    name: 'BackgroundColor',
    value: {
      a: 1,
      b: 128,
      g: 255,
      r: 255,
    },
    type: 'color',
    // …
  },
]
```
