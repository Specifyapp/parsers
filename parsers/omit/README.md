# Omit

## Description
This parser helps you omit keys from a design token not given in parameters.

Learn more about how to configure Specify in the API documentation: [https://docs.specifyapp.com/getting-started/getting-started](https://docs.specifyapp.com/getting-started/getting-started).

## Interface

```ts
interface parser {
  name: 'omit';
  options?: {
    keys: Array<string>;
    filter?: {
      types: Array<string>;
    };
    flatten?: boolean;
  };
}
```

### Options

| Parameter      | Required | Type      | Default | Description                                                 |
| -------------- | -------- | --------- | ------- | ----------------------------------------------------------- |
| `keys`         | optional | `Array`   | `[]`    | The list of keys where the function will be applied.        |
| `filter.types` | optional | `Array`   | `[]`    | The list of token types where the function will be applied. |
| `flatten`      | optional | `boolean` | `false` | Allow flattening each object after omiting their values.    |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least a name's key

```ts
type input = Array<{ [key: string]: any }>;
```

### Output

Array of object without the given keys

```ts
type output = Array<{ [key: string]: any }>;
```

## Simple Usage

### Config

```jsonc
"parsers": [
  {
    "name": "omit",
    "options": {
      "keys": ["value.a"]
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
    "value": {
      "a": 0.96,
      "b": 20,
      "g": 227,
      "r": 122
    },
    "name": "Brand / Primary Color"
  }
]
```

#### Output

```jsonc
[
  {
    "name": "Brand / Primary Color",
    "value": {
      "b": 20,
      "g": 227,
      "r": 122
    },
    "type": "color"
  }
]
```

## Complexe Usage

### Config

```jsonc
{
  "name": "omit",
  "options": {
    "keys": ["value"],
    "flatten": true
  }
}
// …
```

### Before/After

#### Input

```jsonc
[
  {
    "name": "Border / Main",
    "type": "color",
    "value": {
      "type": "solid",
      "color": {
        "value": {
          "a": 0.5,
          "b": 239,
          "g": 80,
          "r": 102
        }
      },
      "width": {
        "value": {
          "unit": "px",
          "measure": 2
        }
      }
    },
    "meta": {
      "source": "frames",
      "sourceFile": "https://www.figma.com/file/9KvLO7F8VPrJ7GxGBWwCr9",
      "originFrameName": "Border · Frame Example"
    }
  }
]
```

#### Output

```jsonc
[
  {
    "name": "Border / Main",
    "type": "color",
    "source": "frames",
    "sourceFile": "https://www.figma.com/file/9KvLO7F8VPrJ7GxGBWwCr9",
    "originFrameName": "Border · Frame Example"
  }
]
```
