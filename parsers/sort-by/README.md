# SORTBY

## Description

Loop on all tokens and apply sort function on the given keys.

## Interface 

```ts
interface parser {
  "name": "sort-by",
  "params"?: {
    "keys": Array<string>
  }
}
```

### Params
| parameter | Require    | type      | default    | description                                       |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------- |
| `keys`    | optional   | `Array`   | `["name"]` | the list of keys where the function will be apply |

## Usage example 

```json
{
    "name": "sort-by",
    "options": {
      "keys": ["name"]
    }
}
```

## Types

### input

Array of object with the keys to apply sort function

```ts
Array<{[key: string]: any}>
```

### output
```
Array<{[key: string]: any}>
```
