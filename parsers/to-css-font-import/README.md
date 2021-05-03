# To CSS Font Imports

## Description

Create the code used to import font file.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface 

```ts
interface parser {
  name: 'to-css-font-import',
  options?: {
    formats?: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>
    fontsPath?: string
    fontFamilyTransform?: 'camelCase' | 'kebabCase' | 'snakeCase';
    includeFontWeight?: boolean;
    genericFamily?: 'serif' | 'sans-serif' | 'cursive' | 'fantasy' | 'monospace';
  }
}
```

### Options
| Parameter             | Required | Type            | Default                                  | Description                                                        |
| --------------------- | -------- | --------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `formats`             | optional | `Array<string>` | `["woff2", "woff", "otf", "ttf", "eot"]` | The list of formats to import                                      |
| `fontsPath`           | optional | `string`        |                                          | The path of font's directory                                       |
| `fontFamilyTransform` | optional | `string`        |                                          | The function to normalize the font-family property                 |
| `includeFontWeight`   | optional | `boolean`       | true                                     | Allow to include the font-weight property in the result            |
| `genericFamily`       | optional | `string`        |                                          | The generic font family will be applied after the main font family |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least the key `name`

```ts
Array<{name: string, [Key: string] : any}>
```

### Output

```ts
string
```


## Usage
### Config

```json
{
  "name": "to-css-font-import",
  "options": {
    "formats": ["woff2", "woff"]
  }
}
```
### Before/After

#### Input

```json
[
  {
    "type": "font",
    "name": "Inter-Medium",
    "value": {
      "isItalic": false,
      "provider": "Google Fonts",
      "fontFamily": "Inter",
      "fontWeight": 500,
      "fontFileMissing": false,
      "fontPostScriptName": "Inter-Medium",
      "url": "https://www.yourfonturl.com/Inter-Medium/Inter-Medium.ttf"
    },
    "meta": {
      "source": "localStyles"
    },
  }
]
```
#### Output

```css
@font-face {
  font-family: "Inter-Medium";
  src: url("Inter-Medium.woff2") format("woff2"),
       url("Inter-Medium.woff") format("woff");
  font-weight: 700;
}
```

