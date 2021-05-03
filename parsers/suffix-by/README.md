# Suffix By

## Description

Allows to concatenate two strings.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface 

```ts
interface parser {
  name: 'suffix-by',
  options?: {
    key?: string
    suffix: string,
    types?: Array<string>,
  }
}
```

### Options
| Parameter | Required | Type             | Default | Description                                  |
| --------- | -------- | ---------------- | ------- | -------------------------------------------- |
| `key`     | optional | `string`         | "name"  | The key of the value will be suffixed        |
| `suffix`  | required | `string`         |         | The string used as content to suffix         |
| `types`   | optional | `Array<string>`  |         | The types where the function will be applied |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with the keys to apply the suffix

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
  "name": "suffix-by",
  "options": {
    "types": ["vector"],
    "suffix": ".svg",
    "key": "name"
  }
}
...
```
