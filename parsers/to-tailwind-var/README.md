# TO TAILWIND VAR

## Description

This parser helps you convert the value of a token to match the name of the variable

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

## Interface

```ts
interface parser {
  name: 'to-tailwind-var';
  options: {
    filter?: {
      types: Array<string>;
    };
    formatName?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
  };
}
```

### Options

| Parameter      | Required | Type     | Default | Description                                                                                                                   |
| -------------- | -------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `filter.types` | optional | `Array`  | `[]`    | The list of token types where the function will be applied.                                                                   |
| `formatName`   | optional | `String` | `'`     | The case transformation you want to apply to your design token name. Learn more in [our dedicated section](#ℹ️-good-to-know). |

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

```ts
type input = string | Array<Record<string, any>>;
```

### Output

```ts
type output = Array<Record<string, any>>;
```

## Basic Usage

This parser will be used to create the variables to connect tailwind to global styles.

### Config

```jsonc
"parsers": [
  {
    "name": "to-tailwind-var",
    "options": {
      "filter": { "types": ["color"] },
      "formatName": "kebabCase"
    }
  }
  // …
]
```

### Input

Array of object with at least a name's key

```ts
type input = Array<{ [key: string]: any }>;
```

### Output

Array of object with the keys given in options

```ts
type output = Array<{ [key: string]: any }>;
```

## Simple Usage

### Before/After

#### Input

```js
[
  {
    type: 'color',
    value: {
      a: 0.96,
      b: 20,
      g: 227,
      r: 122,
    },
    name: 'brand-primary-color',
  },
];
```

#### Output

```jsonc
[
  {
    "name": "brand-primary-color",
    "type": "color",
    "value": "var(--brand-primary-color)"
  }
]
```

## Complex Usage - Create variables and change format

### Config

```jsonc
{
  "name": "to-tailwind-var",
  "options": {
    "filter": {
      "types" ["color"]
    },
    "formatName": "kebabCase"
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

```jsonc
[
  {
    "name": "Primary Color",
    "type": "color",
    "value": "var(--primary-color)"
  }
]
```
