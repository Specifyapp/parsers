# To Style Dictionary

## Description
This parser helps you generate [Style Dictionary](https://amzn.github.io/style-dictionary/#/) configuration files for all your design tokens coming from Specify.

Learn more about how to configure Specify in the API documentation: [https://docs.specifyapp.com/getting-started/getting-started](https://docs.specifyapp.com/getting-started/getting-started).

## Interface

```ts
interface parser {
  name: 'to-style-dictionary';
  options: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    formatTokens: Partial<{
      colorFormat: {
        format: ColorsFormat;
      };
      fontSizeFormat: {
        unit: 'px' | 'rem' | 'none';
      };
      fontFormat: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>;
    }>;
    splitBy?: string;
    assetsBaseDirectory?: Partial<{
      fonts?: string;
      images?: string;
      icons?: string;
    }>;
    formatConfig?: Partial<{
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
    }>;
  }>;
}
```

### Options

| Parameter                          | Required | Type                                                              | Default     | Description                                                                                                                                                                                                |
| ---------------------------------- | -------- | ----------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formatName`                       | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase`                  | `camelCase` | The case transformation you want to apply to your design tokens' name.                                                                                                                                     |
| `formatTokens.colorFormat.format`  | optional | `rgb` `prgb` `hex` `hex6` `hex3` `hex4` `hex8` `name` `hsl` `hsv` | `hex`       | The color format you want to apply to your color design tokens.                                                                                                                                            |
| `formatTokens.fontSizeFormat.unit` | optional | `px` `rem`                                                        | `none`      |                                                                                                                                                                                                            |
| `formatTokens.fontFormat`          | optional | `woff2` `woff` `otf` `ttf` `eot`                                  | `ttf`       | The formats of your font files.                                                                                                                                                                            |
| `splitBy`                          | optional | `string`                                                          |             | The character used to define the nesting of the values in the object (e.g. The name of the color in [this example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-style-dictionary#input-2)) |
| `assetsBaseDirectory.fonts`        | optional | `string`                                                          | `none`      | The base directory containing your font files.                                                                                                                                                             |
| `assetsBaseDirectory.images`       | optional | `string`                                                          | `none`      | The base directory containing your images.                                                                                                                                                                 |
| `assetsBaseDirectory.icons`        | optional | `string`                                                          | `none`      | The base directory containing your icons.                                                                                                                                                                  |
| `formatConfig.endOfLine`           | optional | `auto` `lf` `crlf` `cr`                                           | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line)                                                                                                                             |
| `formatConfig.tabWidth`            | optional | `number`                                                          | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)                                                                                                                               |
| `formatConfig.useTabs`             | optional | `boolean`                                                         | `true`      | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)                                                                                                                                    |

## Output
Please keep in mind that this parser generates files. This is why you should always set a folder as the final `path` in your parent rule.

<details open>
<summary>See Do & Don't config examples</summary>

✅ Do
```
// ...
"rules": [
  {
    "name": "Design Tokens / Colors",
    "path": "tokens", // <-- path set as a folder
    "parsers": [
      {
        "name": "to-style-dictionary"
      }
    ]
  }
]
```

🚫 Don't
```
// ...
"rules": [
  {
    "name": "Design Tokens / Colors",
    "path": "tokens/colors.json", // <-- path set as a file
    "parsers": [
      {
        "name": "to-style-dictionary"
      }
    ]
  }
]
```
</details>

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of objects with at least `name`, `value` and `type`:

```ts
type input = Array<{ name: string; value: any; type: string }>;
```

### Output

An array of objects containing a `name` and a `value`. The value is an object containing either an `url` or a `content`. This object is considered as a `DownloadableFile`.

```ts
type output = Array<{
  name: string;
  value: {
    content?: string;
    url?: string;
  };
}>;
```

## Basic Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-style-dictionary"
  }
  // …
]
```

### Before/After

#### Input

```jsonc
[
  {
    "name": "primary",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "base-space-01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "body",
    "value": {
      "font": {
        "id": "69d2d62e-4d62-45d7-b85f-5da2f9f0c0d4",
        "name": "Roboto-Regular",
        "value": {
          "fontFamily": "Roboto",
          "fontWeight": 400,
          "fontPostScriptName": "Roboto-Regular"
        },
        "type": "font"
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 16
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 20
        }
      },
      "fontVariant": ["small-caps"]
    },
    "type": "textStyle"
  },
  {
    "name": "Roboto-Regular",
    "value": {
      "fontFamily": "Roboto",
      "fontWeight": 400,
      "fontPostScriptName": "Roboto-Regular"
    },
    "type": "font"
  }
]
```

#### Output

This will create multiple files inside a folder with the following structure:

```
🗂 folder-defined-in-the-rule
└── 🗂 color
│   └── base.json
├── 🗂 size
│   └── base.json
│   └── font.json
│   └── lineHeight.json
└── 🗂 asset
    └── font.json
```

In each of these files are the tokens usable in Style Dictionary

```jsonc
/* color/base.json */
{
  "color": {
    "base": {
      "primary": {
        "value": "#c6bdff"
      }
    }
  }
}
```

```jsonc
/* size/base.json */
{
  "size": {
    "base": {
      "baseSpace01": {
        "value": "4px"
      }
    }
  }
}
```

```jsonc
/* size/font.json */
{
  "size": {
    "base": {
      "body": {
        "value": "16px"
      }
    }
  }
}
```

```jsonc
/* size/lineHeight.json */
{
  "size": {
    "base": {
      "body": {
        "value": "20px"
      }
    }
  }
}
```

```jsonc
/* asset/font.json */
{
  "asset": {
    "font": {
      "robotoRegular": {
        "ttf": {
          "value": "Roboto-Regular.ttf"
        }
      }
    }
  }
}
```

## Complex usage - with specific config

### Config

```jsonc
"parsers": [
  {
    "name": "to-style-dictionary",
    "options": {
      "splitBy": "/",
      "assetsBaseDirectory": {
        "fonts": "assets/my-fonts/"
      }
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
    "name": "primary/main",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "primary/hover",
    "value": {
      "a": 1,
      "b": 255,
      "g": 159,
      "r": 168
    },
    "type": "color"
  },
  {
    "name": "secondary/main",
    "value": {
      "a": 1,
      "b": 31,
      "g": 174,
      "r": 222
    },
    "type": "color"
  },
  {
    "name": "base-space-01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "component/small-padding",
    "value": {
      "unit": "px",
      "measure": 2
    },
    "type": "measurement"
  },
  {
    "name": "body",
    "value": {
      "font": {
        "id": "69d2d62e-4d62-45d7-b85f-5da2f9f0c0d4",
        "name": "Roboto-Regular",
        "value": {
          "fontFamily": "Roboto",
          "fontWeight": 400,
          "fontPostScriptName": "Roboto-Regular"
        },
        "type": "font"
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 16
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 20
        }
      },
      "fontVariant": ["small-caps"]
    },
    "type": "textStyle"
  },
  {
    "name": "Roboto-Regular",
    "value": {
      "fontFamily": "Roboto",
      "fontWeight": 400,
      "fontPostScriptName": "Roboto-Regular"
    },
    "type": "font"
  }
]
```

#### Output

This will create multiple files inside a folder with the following structure:

```
🗂 folder-defined-in-the-rule
└── 🗂 color
│   └── base.json
├── 🗂 size
│   └── base.json
│   └── font.json
│   └── lineHeight.json
└── 🗂 asset
    └── font.json
```

In each of these files are the tokens usable in Style Dictionary

```jsonc
/* color/base.json */
{
  "color": {
    "base": {
      "primary": {
        "main": {
          "value": "#c6bdff"
        },
        "hover": {
          "value": "#a99fff"
        }
      },
      "secondary": {
        "main": {
          "value": "#deae1f"
        }
      }
    }
  }
}
```

```jsonc
/* size/base.json */
{
  "size": {
    "base": {
      "baseSpace01": {
        "value": "4px"
      },
      "component": {
        "smallPadding": {
          "value": "2px"
        }
      }
    }
  }
}
```

```jsonc
/* size/font.json */
{
  "size": {
    "base": {
      "body": {
        "value": "16px"
      }
    }
  }
}
```

```jsonc
/* size/lineHeight.json */
{
  "size": {
    "base": {
      "body": {
        "value": "20px"
      }
    }
  }
}
```

```jsonc
/* asset/font.json */
{
  "asset": {
    "font": {
      "robotoRegular": {
        "ttf": {
          "value": "assets/my-fonts/Roboto-Regular.ttf"
        }
      }
    }
  }
}
```