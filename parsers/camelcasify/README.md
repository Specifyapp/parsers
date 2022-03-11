# Camelcasify

## Description
This parser helps you apply camelcase function on specific keys.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

## Interface

```ts
interface parser {
  name: 'camelcasify';
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

Array of object with the keys to apply `camelcase` function

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
    "name": "camelcasify",
    "options": {
      "keys": ["name"]
    }
  }
  // ...
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
    "type": "color",
    "value": {
      "a": 0.96,
      "b": 20,
      "g": 227,
      "r": 122
    },
    "name": "brandPrimaryColor"
  }
]
```
