# Round number

## Description
This parser helps you round any measurement design token with specific precision.

Some measurement token values like a font size, a line height or a shadow blur may need to be rounded. By specifying a mode, you can control the round function more precisely.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).
## Interface

```ts
interface parser {
  name: 'round-number';
  options: {
    keys: Array<string>;
    precision?: number;
    mode?: 'down' | 'up' | 'auto';
  };
}
```

### Options

| Parameter   | Required | Type             | Default | Description                                                                                                                                                                                                                                                                   |
| ----------- | -------- | ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`      | required | `Array<string>`  |         | List of key path to apply the rounding                                                                                                                                                                                                                                        |
| `precision` | optional | `number`         | `0`     | Number of decimal expected                                                                                                                                                                                                                                                    |
| `mode`      | optional | `down, up, auto` | `auto`  | up: rounds a number up to the next largest number with specific decimals </br></br> down: rounds a number down to the nearest less or equal number with specific decimals </br></br> auto: returns the value of a number rounded to the nearest number with specific decimals |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

```ts
type input = Array<Record<string, any>>;
```

### Output

```ts
type output = Array<Record<string, any>>;
```

## Basic Usage

### Config

The following config rounds the measure of a measurement design token:

```jsonc
"parsers": [
  {
    "name": "round-number",
    "options": {
      "keys": ["value.measure"],
      "precision": 1,
      "mode": "auto"
    }
  }
  // …
]
```
### Before/After

#### Input

```jsonc
[
  {
    "type": "measurement",
    "value": {
      "unit": "rem",
      "measure": 1.689 // <---
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

```jsonc
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
This config uses patterns. Here, the shadow has an array as a value. So we use `[*]` to round all the blur measures.

```jsonc
"parsers": [
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
  // …
]
```

### Before/After

#### Input

```jsonc
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

```jsonc
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
