# CAMELCASIFY

## Description

Loop on all tokens and apply camelcase function on the given keys.

## Interface

```ts
interface parser {
  "name": "camelcasify",
  "options"?: {
    "keys": Array<string>
  }
}
```

### Options
| parameter | Require    | type      | default    | description                                       |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------- |
| `keys`    | optional   | `Array`   | `["name"]` | the list of keys where the function will be apply |

## Example 

```json
{
    "name": "camelcasify",
    "options": {
      "keys": ["name"]
    }
}
```

## Types

### input

Array of object with the keys to apply camelcase function

```ts
Array<{[key: string]: any}>
```

### output
```ts
Array<{[key: string]: any}>
```
