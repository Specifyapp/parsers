# TO CSS TEXTSTYLE

## Description

Create text styles css classes.

## Interface

  ```ts
interface parser {
  name: 'to-css-text-style',
  options?: {
    include?: Array<'color' | 'font-family' | 'font-size' | 'line-height' | 'letter-spacing' | 'text-align' | 'vertical-align' | 'text-transform' | 'font-variant' | 'text-decoration' | 'text-indent' | 'font' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textAlign' | 'textTransform' | 'fontVariant' | 'textDecoration' | 'textIndent'>,
    exclude?: Array<'color' | 'font-family' | 'font-size' | 'line-height' | 'letter-spacing' | 'text-align' | 'vertical-align' | 'text-transform' | 'font-variant' | 'text-decoration' | 'text-indent' | 'font' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textAlign' | 'textTransform' | 'fontVariant' | 'textDecoration' | 'textIndent'>,
    prefix?: string;
    suffix?: string;
    colorFormat?: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
    cssClassFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    fontFamilyFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    genericFamily?: 'serif' | 'sans-serif' | 'cursive' | 'fantasy' | 'monospace';
    relativeLineHeight?: boolean;
    prettierConfig?: Partial<{
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
    }>;
  }
}
```

### Options
| Parameter                  | Required   | Type                                                     | Default     | Description                                                                    |
| -------------------------- | ---------- | -------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `include`                  | optional   | `Array<string>`                                          |             | List of properties to include in css classes                                   |
| `exclude`                  | optional   | `Array<string>`                                          |             | List of properties to exclude in css classes                                   |
| `prefix`                   | optional   | `string`                                                 |             | A string will be append before the css class name                              |
| `suffix`                   | optional   | `string`                                                 |             | A string will be append after the css class name                               |
| `colorFormat`              | optional   | `rgb` `prgb` `hex` `hex6` `hex3` `hex4` `hex8` `name` `hsl` `hsv` | `rgb`       | A color format applied when a text style include a color                       |
| `cssClassFormat`           | optional   | `camelCase` `kebabCase` `snakeCase` `pascalCase`                        | `kebabCase` | The lodash function used to normalize the css class name                       |
| `fontFamilyFormat`         | optional   | `camelCase` `kebabCase` `snakeCase` `pascalCase`                        |             | The lodash function used to normalize the font family value                    |
| `genericFamily`            | optional   | `string`                                                 |             | The generic font family will be applied after the main font family             |
| `relativeLineHeight`       | optional   | `boolean`                                                |             | Convert line height to relative value                                          |
| `prettierConfig.endOfLine` | optional   | `auto, lf, crlf, cr`                                     | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line) |
| `prettierConfig.tabWidth`  | optional   | `number`                                                 | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)   |
| `prettierConfig.useTabs`   | optional   | `boolean`                                                | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)        |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

Array of object with at least the key `name` and the value that match the [TextStyle type](https://github.com/Specifyapp/parsers/blob/master/types/tokens/TextStyle.ts#L70)

### Input

```ts
 Array<{ name: string; value: TextStyleValue } & Record<any, any>>
```

### Output

```ts
string
```

## Usage
### Config

```json
{
  "name": "to-css-text-style",
  "options": {
    "exclude": ["color", "text-indent", "vertical-align", "text-align"],
    "prefix": "sp-",
    "suffix": "-text-style",
    "relativeLineHeight": true,
    "genericFamily": "serif"
  }
}
...
```
### Before/After

#### Input

```json
[
  {
    "name": "Body",
    "value": {
      "font": {
        "meta": {
          "source": "localStyles"
        },
        "name": "Inter-Medium",
        "type": "font",
        "value": {
          "isItalic": false,
          "fontFamily": "Inter",
          "fontWeight": 500,
          "fontPostScriptName": "Inter-Medium"
        },
        "originId": "Inter-Medium"
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
          "measure": 14
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
      }
    },
    "type": "textStyle",
    ...
  }
]
```
#### Output

```css
.sp-body-text-style {
  font-family: allan, serif;
  font-size: 14px;
  line-height: 1;
}
```
