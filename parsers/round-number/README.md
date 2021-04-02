# Round number

## Description

Round any measurement with specific precision.
Some measurement token values like a font size, a line height or a shadow blur may need to be rounded.
By specifying a mode, you can control the round function more precisely.

## Interface

```ts
interface parser {
  "name": "round-number",
  "options": {
    keys: Array<string>;
    precision?: number;
    mode?: 'down' | 'up' | 'auto';
  }
}
```

### Options

| Parameter              | Required   | Type             | Default    | Description                                                                                                                |
| ---------------------- | ---------- | --------------   | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `keys`                 | required   | `Array<string>`  |            | List of key path to apply the rounding |
| `precision`            | optional   | `number`         | `0`        | Number of decimal expected   |
| `mode`                 | optional   | `down, up, auto` | `auto`     | up:  rounds a number up to the next largest number with specific decimals </br></br> down:  rounds a number down to the nearest less or equal number with specific decimals </br></br> auto: returns the value of a number rounded to the nearest number with specific decimals |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**
### Input


```ts
Array<Record<string, any>>
```

### Output

```ts
Array<Record<string, any>>
```

## Basic Usage
### Config

```json
{
  "name": "round-number",
  "options": {
    "keys": ["value.measure"],
    "precision": 1,
    "mode": "auto"
  }
}
```

With this config, we will round the measure of a measurement token 
### Before/After

#### Input

```json5
[
  {
    "type": "measurement",
    "value": {
      "unit": "rem",
      "measure": 1.689  // <---
    },
    "name": "size-01"
  },
  {
    "type": "measurement",
    "value": {
      "unit": "rem",
      "measure": 2.34 // <---
    },
    "name": "size-02"
  }
]
```
#### Output

```json5
[
  {
    "type": "measurement",
    "value": {
      "unit": "rem",
      "measure": 1.7 // <---
    },
    "name": "size-01"
  },
  {
    "type": "measurement",
    "value": {
      "unit": "rem",
      "measure": 2.3 // <---
    },
    "name": "size-02"
  }
]
```

## Complex Usage - Rounding text style font size and shadows blur
### Config

```json5
{
  "name": "round-number",
  "options": {
    "keys": [
      "value.fontSize.value.measure",
      "value.lineHeight.value.measure",
      "value[*].blur.value.measure"
    ],
    "mode": "down"
  }
}
```

This config uses patterns. Here the shadow has an array as a value. So we use `[*]` to round all the blur measures
### Before/After

#### Input

```json5
[
  {
    "type": "textStyle",
    "name": "app-code",
    "value": {
      "font": {
        "name": "FiraCode-Medium",
        "type": "font",
        "value": {
          "isItalic": false,
          "fontFamily": "Fira Code",
          "fontWeight": 500,
          "fontPostScriptName": "FiraCode-Medium"
        }
      },
      "color": {
        "value": {
          "a": 1,
          "b": 196,
          "g": 196,
          "r": 196
        }
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 12.7 // <--
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 14.0625 // <--
        }
      }
    }
  },
  {
    "type": "shadow",
    "name": "Elevation-2",
    "value": [
      {
        "blur": {
          "value": {
            "unit": "px",
            "measure": 28.33 // <--
          }
        },
        "color": {
          "value": {
            "a": 0.1,
            "b": 0,
            "g": 0,
            "r": 0
          }
        },
        "isInner": false,
        "offsetX": {
          "value": {
            "unit": "px",
            "measure": 0
          }
        },
        "offsetY": {
          "value": {
            "unit": "px",
            "measure": 4
          }
        }
      },
      {
        "blur": {
          "value": {
            "unit": "px",
            "measure": 4.66 // <--
          }
        },
        "color": {
          "value": {
            "a": 0.1,
            "b": 0,
            "g": 0,
            "r": 0
          }
        },
        "isInner": false,
        "offsetX": {
          "value": {
            "unit": "px",
            "measure": 0
          }
        },
        "offsetY": {
          "value": {
            "unit": "px",
            "measure": 4
          }
        }
      }
    ]
  }
]
```
#### Output

```json5
[
  {
    "type": "textStyle",
    "name": "app-code",
    "value": {
      "font": {
        "name": "FiraCode-Medium",
        "type": "font",
        "value": {
          "isItalic": false,
          "fontFamily": "Fira Code",
          "fontWeight": 500,
          "fontPostScriptName": "FiraCode-Medium"
        }
      },
      "color": {
        "value": {
          "a": 1,
          "b": 196,
          "g": 196,
          "r": 196
        }
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 12 // <--
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 14 // <--
        }
      }
    }
  },
  {
    "type": "shadow",
    "name": "Elevation-2",
    "value": [
      {
        "blur": {
          "value": {
            "unit": "px",
            "measure": 28 // <--
          }
        },
        "color": {
          "value": {
            "a": 0.1,
            "b": 0,
            "g": 0,
            "r": 0
          }
        },
        "isInner": false,
        "offsetX": {
          "value": {
            "unit": "px",
            "measure": 0
          }
        },
        "offsetY": {
          "value": {
            "unit": "px",
            "measure": 4
          }
        }
      },
      {
        "blur": {
          "value": {
            "unit": "px",
            "measure": 4 // <--
          }
        },
        "color": {
          "value": {
            "a": 0.1,
            "b": 0,
            "g": 0,
            "r": 0
          }
        },
        "isInner": false,
        "offsetX": {
          "value": {
            "unit": "px",
            "measure": 0
          }
        },
        "offsetY": {
          "value": {
            "unit": "px",
            "measure": 4
          }
        }
      }
    ]
  }
]
```
