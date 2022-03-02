# Replace string

## Description

Replace any string matched by a regex by a new string.

## Example Use case

Let's say you have some a color named "Red" in your Figma local styles in a "Colors" folder. The color name returned by Figma is "Colors / Red".
This parser helps you rename your design tokens without characters before the last slash:

- before: "Colors / Red"
- after: "Red"

## Interface

```ts
interface parser {
  name: 'replace-string';
  options: {
    keys: Array<string>;
    regex:
      | {
          pattern: string;
          flags?: string;
        }
      | string;
    replaceBy?: string;
    trim?: boolean;
  };
}
```

### Options

| Parameter       | Required | Type              | Default          | Description                                                                                                                                                                                                                                            |
| --------------- | -------- | ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `keys`          | required | `Array<string>`   |                  | List of key path to apply the replace function                                                                                                                                                                                                         |
| `regex`         | required | `object` `string` |                  | if string: the parameter used for the [constructor of the regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor). If your use case need to use flags prefer object notation. |
| `regex.pattern` | required | `string`          |                  | the pattern of the regex used as first argument of the [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor)                                                         |
| `regex.flags`   | optional | `string`          |                  | the flags to use for regex. In the regex constructor it's the second argument [constructor of the regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#literal_notation_and_constructor)                     |
| `replaceBy`     | optional | `string`          | `[empty string]` | The value will used as replacement. [This method](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/replace) is used to apply the replacement.                                                                      |
| `trim`          | optional | `boolean`         | `false`          | Set true to remove spaces before and after the transformed values. [This method](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/Trim) is used to trim                                                            |

### Good to know

Under the hood the regex is build like:

`let re = new RegExp('ab+c', 'i') // constructor with string pattern as first argument`

Where `ab+c` is the regex option in `string` or the `regex.pattern` in object. The second argument is the flags in options.

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

```ts
Array<Record<string, any>>
```

### Output

```ts
Array<Record<string, any>>
```

## Basic Usage

### Config

```json
{
  "name": "replace-string",
  "options": {
    "keys": ["name"],
    "regex": {
      "pattern": "(.*?)\\/",
      "flags": "g"
    },
    "trim": true
  }
}
```

With this config, we will change name by keeping only characters after the last slash

### Before/After

#### Input

```json5
[
  {
    // ...
    name: 'Colors/Accent',
    value: {
      a: 1,
      b: 255,
      g: 189,
      r: 198,
    },
    type: 'color',
    // ...
  },
]
```

#### Output

```json5
[
  {
    // ...
    name: 'Accent',
    value: {
      a: 1,
      b: 255,
      g: 189,
      r: 198,
    },
    type: 'color',
    // ...
  },
]
```
