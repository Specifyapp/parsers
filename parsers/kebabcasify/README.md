# Kebabcasify

## Description

Loop on all tokens and apply kebabcase function on the given keys.

## Interface 

```ts
interface x {
  "name": "@specify/kebabcasify",
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
    "name": "@specify/kebabcasify",
    "options": {
      "keys": ["name"]
    }
}
```

## Types

### input

Array of object with the keys to apply kebabcase function

```ts
Array<{[key: string]: any}>
```

### output
```
Array<{[key: string]: any}>
```
