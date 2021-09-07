# Omit

## Description

Loop on all tokens and get only keys given in params.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface 
```ts
interface parser {
  name: 'omit',
  options?: {
    keys: Array<string>
    filter?: {
      types: Array<string>
    },
    flatten?: boolean
  }
}
```
### Options

| Parameter              | Required   | Type      | Default    | Description                                             |
| ---------------------- | ---------- | --------- | ---------- | ------------------------------------------------------- |
| `keys`                 | optional   | `Array`   | `[]`       | The list of keys where the function will be applied.    |
| `filter.types`         | optional   | `Array`   | `[]`       | The list of token types where the function will be applied.    |
| `flatten`              | optional   | `boolean` | `false`    | Allow flattening each object after omiting their values.|

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least a name's key

```ts
Array<{[key: string]: any}>
```

### Output

Array of object without the given keys

```ts
Array<{[key: string]: any}>
```
## Simple Usage
### Config

```json
{
  "name": "omit",
  "options": {
    "keys": ["value.a"]
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

```json
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

```json
{
  "name": "omit",
  "options": {
    "keys": ["value"],
    "flatten": true
  }
}
...
```
### Before/After

#### Input

```json
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

```json
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
