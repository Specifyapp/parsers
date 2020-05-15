# CAMELCASIFY

## Description

Loop on all tokens and apply camelcase function on the given keys.

## Interface 
```ts
interface x {
  "name": "@specify/camelcasify",
  "params"?: {
    "keys": Array<string>
  }
}
```
### Params
| parameter | Require    | type      | default    | description                                      |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------ |
| `keys`    | optional   | `Array`   | `["name"]` |the list of keys where the function will be apply|
## Usage example 

```json
{
    "name": "@specify/camelcasify",
    "params": {
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
```
Array<{[key: string]: any}>
```
