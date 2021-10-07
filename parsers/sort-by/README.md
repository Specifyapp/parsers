# Sort By

## Description

Loop on all tokens and apply sort function on the given keys.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli).

## Interface 

```ts
interface parser {
  name: 'sort-by',
  options?: {
    keys: Array<string>
  }
}
```

### Options
| Parameter | Required | Type      | Default    | Description                                         |
| --------- | -------- | --------- | ---------- | --------------------------------------------------- |
| `keys`    | optional    | `Array`   | `["name"]` | The list of keys where the function will be applied |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with the keys to apply `sort` function

```ts
Array<{[key: string]: any}>
```

### Output

```ts
Array<{[key: string]: any}>
```

## Usage
### Config

```json
{
  "name": "sort-by",
  "options": {
    "keys": ["name"]
  }
}
...
```
### Before/After

#### Input

```json
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

```json
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
      "b": 255,
      "g": 142,
      "r": 5
    },
    "name": "Global / Orange Base"
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
  }
]
```
