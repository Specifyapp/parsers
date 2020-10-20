
## Description

Allows to concatenate two strings

## Interface 

```ts
interface parser {
  "name": "suffix-by",
  "params"?: {
    "key"?: string
    "suffix": string,
    "types"?: Array<string>,
  }
}
```

### Params
| parameter | Require    | type             | default    | description                                       |
| --------- | ---------- | ---------------- | ---------- | ------------------------------------------------- |
| `key`     | optional   | `string`         | "name"     | the key of the value will be suffixed             |
| `suffix`  | required   | `string`         |            | the string used as content to suffix              |
| `types`   | optional   | `Array<string>`  |            | the types where the function will be apply        |

## Usage example 

```json
{
    "name": "suffix-by",
    "options": {
      "types": ["vector"],
      "suffix": ".svg",
      "key": "name"
    }
}
```

## Types

### input

Array of object with the keys to apply the suffix

```ts
Array<{[key: string]: any}>
```

### output
```
Array<{[key: string]: any}>
```
