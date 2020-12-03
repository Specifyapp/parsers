# KEBABCASIFY

## Description

Loop on all tokens and apply kebabcase function on the given keys.

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

| parameter              | Require    | type      | default    | description                                                                                                                |
| ---------------------- | ---------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `keys`                 | optional   | `Array`   | `["name"]` | the list of keys where the function will be applied                                                                        |
| `excludeFileExtension` | optional   | `Boolean` | `false`    | the fact that the function will only be applied on a filename. Useful for transforming strings containing a file extension |

## Usage example 

```json
{
    "name": "kebabcasify",
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
```ts
Array<{[key: string]: any}>
```
