# OPTIMIZE VECTOR

## Description

SVG optimizer using [svgo](https://github.com/svg/svgo). 

## Interface

```ts
interface x {
  "name": "pascalcasify",
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
    "name": "pascalcasify",
    "options": {
      "keys": ["name"]
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
