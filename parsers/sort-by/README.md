# Sort By

## Description
This parser helps loop on several design tokens and sort them according to their respective key values.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

## Interface

```ts
interface parser {
  name: 'sort-by';
  options?: {
    keys: Array<string>;
  };
}
```

### Options

| Parameter | Required | Type    | Default    | Description                                         |
| --------- | -------- | ------- | ---------- | --------------------------------------------------- |
| `keys`    | optional | `Array` | `["name"]` | The list of keys where the function will be applied |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with the keys to apply `sort` function

```ts
type input = Array<{ [key: string]: any }>;
```

### Output

```ts
type output = Array<{ [key: string]: any }>;
```

## Usage

### Config

```jsonc
"parsers": [
  {
    "name": "sort-by",
    "options": {
      "keys": ["name"]
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
      "a": 1,
      "b": 17,
      "g": 125,
      "r": 249
    },
    "name": "Global / Blue Base"
  },
  {
    "type": "color",
    "value": {
      "a": 1,
      "b": 245,
      "g": 72,
      "r": 63
    },
    "name": "Global / Red Base"
  },
  {
    "type": "color",
    "value": {
      "a": 1,
      "b": 255,
      "g": 142,
      "r": 5
    },
    "name": "Global / Orange Base"
  }
]
```

#### Output

```jsonc
[
  {
    "type": "color",
    "value": {
      "a": 1,
      "b": 17,
      "g": 125,
      "r": 249
    },
    "name": "Global / Blue Base" // <---
  },
  {
    "type": "color",
    "value": {
      "a": 1,
      "b": 255,
      "g": 142,
      "r": 5
    },
    "name": "Global / Orange Base" // <---
  },
  {
    "type": "color",
    "value": {
      "a": 1,
      "b": 245,
      "g": 72,
      "r": 63
    },
    "name": "Global / Red Base" // <---
  }
]
```
