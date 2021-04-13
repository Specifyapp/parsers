# Link design tokens

## Description

This parser replace absolute values by the design token corresponding.

If you have a border which include a width of `{ measure: 3, unit: 'px' }` and a measurement with the same value.
The parser will replace the value of `width` by the entire measurement token.

## How it works

At first we create a dictionary used as indexes with the `md5` of values. 
```ts
// interface LinkableTokensSignatures
{
  'color': {
    [md5(color.value)]: [color.id]
  },
  'measurement': {
    [md5(measurement.value)]: [measurement.id]
  }
}
```

After the creation of the indexes dictionary, we will loop over design tokens that include the `compute` method to replace value by the design token
associate in the dictionary. Each token has its method of replacing its values.
## Interface

```ts
interface parser {
  "name": "link-design-tokens",
}
```

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**
### Input

Array of object containing at least the keys described in the pattern option.

```ts
Array<{id: string, type: string, value: string, name: string} & Record<any, any>>
```

### Output

```ts
Array<{id: string, type: string, value: string, name: string} & Record<any, any>>
```

## Basic usage 
### Config

```json
{
    "name": "link-design-token"
}
...
```
### Before/After

#### Input

```json5
[
  {
    "id": "1",
    "type": "measurement",
    "value": {
      "unit": "px",
      "measure": 8
    },
    "name": "base"
  },
  {
    "id": "2",
    "type": "textStyle",
    "value": {
      "font": {
        "value": {
            "fontFamily": "Allan",
            "fontPostScriptName": "Allan-Regular"
          }
      },
      "fontSize": { // <---
        "value": {
          "unit": "px",
          "measure": 8
        }
      }
    },
    "name": "base"
  }
]
```
#### Output

```json5
[
  {
    "id": "1",
    "type": "measurement",
    "value": {
      "unit": "px",
      "measure": 8
    },
    "name": "base"
  },
  {
    "id": "2",
    "type": "textStyle",
    "value": {
      "font": {
        "value": {
          "fontFamily": "Allan",
          "fontPostScriptName": "Allan-Regular"
        }
      },
      "fontSize":  { // <---
        "id": "1",
        "type": "measurement",
        "value": {
          "unit": "px",
          "measure": 8
        },
        "name": "base"
      }
    },
    "name": "base"
  }
]
```
