# TO CSS TEXTSTYLE

## Description

Create text styles css classes.

## Interface

  ```ts
interface parser {
  "name": "to-css-textStyle",
  "options"?: {
    include?: Array<'color' | 'font-family' | 'font-size' | 'line-height' | 'letter-spacing' | 'text-align' | 'vertical-align' | 'text-transform' | 'font-variant' | 'text-decoration' | 'text-indent' | 'font' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textAlign' | 'textTransform' | 'fontVariant' | 'textDecoration' | 'textIndent'>,
    exclude?: Array<'color' | 'font-family' | 'font-size' | 'line-height' | 'letter-spacing' | 'text-align' | 'vertical-align' | 'text-transform' | 'font-variant' | 'text-decoration' | 'text-indent' | 'font' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'textAlign' | 'textTransform' | 'fontVariant' | 'textDecoration' | 'textIndent'>,
    prefix?: string;
    suffix?: string;
    colorFormat?: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
    cssClassFormat?: 'camelCase' | 'kebabCase' | 'snakeCase';
    fontFamilyFormat?: 'camelCase' | 'kebabCase' | 'snakeCase';
    genericFamily?: 'serif' | 'sans-serif' | 'cursive' | 'fantasy' | 'monospace';
    prettierConfig?: Partial<{
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
    }>;
  }
}
```

### Options
| parameter | Require    | type      | default    | description                                       |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------- |
| `include`    | optional   | `Array<string>`   |  | List of properties to include in css classes |
| `exclude`    | optional   | `Array<string>`   |  | List of properties to exclude in css classes |
| `prefix`    | optional   | `string`   |  | A string will be append before the css class name |
| `suffix`    | optional   | `string`   |  | A string will be append after the css class name |
| `colorFormat`    | optional   | `rgb, prgb, hex, hex6, hex3, hex4, hex8, name, hsl, hsv`   | `rgb` | A color format applied when a text style include a color |
| `cssClassFormat`    | optional   | `camelCase, kebabCase, snakeCase`   | `kebabCase` | The lodash function used to normalize the css class name |
| `fontFamilyFormat`    | optional   | `camelCase, kebabCase, snakeCase`   |  | The lodash function used to normalize the font family value |
| `genericFamily`    | optional   | `string` |  | The generic font family will be applied after the main font family |
| `prettierConfig.endOfLine`    | optional   | `auto, lf, crlf, cr`   | `auto` | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line) |
| `prettierConfig.tabWidth`    | optional   | `number`   | `2` | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width) |
| `prettierConfig.useTabs`    | optional   | `boolean`   | `false` | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs) |

## Usage example

```json
{
    "name": "to-css-text-style",
    "options": {
      "exclude": ["color", "text-indent"],
      "prefix": "utils-",
      "suffix": "-text-style",
      "genericFamily": "serif"
    }
}
```
### Result example

```css
.utils-main-text-style {
    font-family: allan, serif;
    font-size: 12px;
    line-height: 12px;
    text-align: left;
    vertical-align: top;
    text-transform: uppercase;
    text-decoration: line-through;
}
```
## Types

Array of object with at least the key `name` and the value that match the [TextStyle type](https://github.com/Specifyapp/parsers/blob/master/types/tokens/TextStyle.ts#L70)

### input
__

```ts
 Array<{ name: string; value: TextStyleValue } & Record<any, any>>
```

### output
```ts
string

```
