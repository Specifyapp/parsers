# Kebabcasify

## Description

Loop on all tokens and apply kebabcase function on the given keys.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface 

```ts
interface parser {
  "name": "kebabcasify",
  "options"?: {
    "keys": Array<string>
    "excludeFileExtension"?: boolean
  }
}
```

### Options

| Parameter              | Required   | Type      | Default    | Description                                                                                                                |
| ---------------------- | ---------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `keys`                 | optional   | `Array`   | `["name"]` | The list of keys where the function will be applied                                                                        |
| `excludeFileExtension` | optional   | `Boolean` | `false`    | The fact that the function will only be applied on a filename. Useful for transforming strings containing a file extension |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with the keys to apply `kebabcase` function

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
  "name": "kebabcasify",
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
    "type": "color",
    "value": {
      "a": 0.96,
      "b": 20,
      "g": 227,
      "r": 122
    },
    "name": "brand-primary-color"
  }
]
```

