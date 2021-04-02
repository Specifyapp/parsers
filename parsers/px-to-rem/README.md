# PX to REM
## Description

Convert pixel measurement to rem.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface

```ts
interface parser {
  "name": "px-to-rem",
  "options": {
    "basePixelValue"?: number;
    "keys": Array<string>
  }
}
```

### Options
| Parameter        | Required | Type            | Default  | Description                              |
| ---------------- | -------- | --------------- | -------- | ---------------------------------------- |
| `basePixelValue` | optional    | `number`        | 16       | Base font size of your HTML document     |
| `keys`           | required     | `Array<string>` |          | List of key paths to apply the convertion |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

Array of object with at least the keys describe in the keys option. 
Values must match the type [MeasurementValue](https://github.com/Specifyapp/parsers/blob/master/types/tokens/Measurement.ts#L3)

### Input
__

```ts
 Array<Record<string, unknown>>
```

### Output

```ts
Array<Record<string, unknown>>
```

## Usage
### Config
```json
{
  "name": "px-to-rem",
  "options": {
    "keys": ["fontSize"]
  }
}
...
```

### Before/After

#### Input
```json
{
  ...
  "fontSize": {
    "value": {
      "unit": "px",
      "measure": 14
    }
  },
  ...
}
```
#### Output

```json
[
  {
    ...
    "value": {
      "fontSize": {
        "measure": 0.875,
        "unit": "rem"
      },
    },
    ...
  }
]
```
