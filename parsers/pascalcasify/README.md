# PASCALCASIFY

## Description

Loop on all tokens and apply pascalcase function on the given keys.

## Interface

```ts
interface x {
  "name": "pascalcasify",
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

## Example 

```json
{
    "name": "pascalcasify",
    "options": {
      "keys": ["name"],
      "excludeFileExtension": "true"
    }
}
```

## Types

### input

Array of object with the keys to apply pascalcase function

```ts
Array<{[key: string]: any}>
```

### output


```
Array<{[key: string]: any}>
```
