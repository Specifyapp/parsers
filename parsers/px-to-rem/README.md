# PX TO REM
## Description

Convert pixel measurement to rem.

## Interface

```ts
interface parser {
  "name": "px-to-rem",
  "options": {
    "baseFontSize"?: number;
    "keys": Array<string>
  }
}
```

### Options
| parameter | Require    | type      | default    | description                                       |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------- |
| `baseFontSize`    | optional   | `number`   | 16 | Font size of the root element  |
| `keys`    | required   | `Array<string>`   |  | List of key path to apply the convertion  |

## Usage example

```json
{
    "name": "px-to-rem",
    "options": {
      "keys": ["fontSize"]
    }
}
```
### Result example

```json
[
  {
    "value": {
      "fontSize": {
        "measure": 1.3,
        "unit": "rem"
      },
      ...
    },
    ...
  }
  ...
]
```
## Types

Array of object with at least the keys describe in the keys option. 
Values must match the type [MeasurementValue](https://github.com/Specifyapp/parsers/blob/master/types/tokens/Measurement.ts#L3)

### input
__

```ts
 Array<Record<string, unknown>>
```

### output
```ts
Array<Record<string, unknown>>
```
