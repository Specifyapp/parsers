# CONVERT FONT

## Description

Convert font in several formats.

## Interface 

```ts
interface parser {
  "name": "convert-font",
  "options"?: {
    "formats"?: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>
    "fileNameKey"?: 'name' | 'fontFamily' | Array<string>
    "fileNameFormat"?: 'camelCase' | 'kebabCase' | 'snakeCase';
  }
}
```

### Options

| parameter | Require    | type      | default    | description                                       |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------- |
| `formats`    | optional   | `Array<string>`   | `["woff2", "woff", "otf", "ttf", "eot"]` | the list of formats to convert |
| `fileNameKey`    | optional   | `name` `fontFamily` `Array<string>`   | `name` | The design token's keys that will be used to create the file name. These keys will be separated by a space to create the file name. |
| `fileNameFormat`    | optional   | `camelCase` `kebabCase` `snakeCase`   |  | The function to normalize the file name |

## Usage example 

```json
{
    "name": "convert-font",
    "options": {
      "formats": ["woff2", "woff"],
      "fileNameKey":  ["fontFamily", "fontWeight"],
      "fileNameFormat": "kebabCase"
    }
}
```

### Result example

```json
[
    {
      "name": "allan-700.woff2",
      "value": {
        "url": "https://beta.api.specifyapp.com/...",
        "fontFamily": "Allan",
        "fontWeight": 700,
        "fontPostScriptName": "Allan-Bold"
      }
    },
    {
      "name": "allan-700.woff",
      "value": {
        "url": "https://beta.api.specifyapp.com/...",
        "fontFamily": "Allan",
        "fontWeight": 700,
        "fontPostScriptName": "Allan-Bold"
      }
    }
]
```

## Types

### input

Array of object with the keys to apply kebabcase function

```ts
Array<{
  name: string;
  value: { fontPostScriptName: string; [Key: string]: any };
  [Key: string]: any;
}>
```

### output
```ts
Array<{
  value: { fontPostScriptName: string; url: string ; [Key: string]: any };
  [Key: string]: any;
}>
```
