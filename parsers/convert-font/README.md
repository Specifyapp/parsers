# Convert Font

## Description

Convert font in several formats.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface 

```ts
interface parser {
  name: "convert-font",
  options?: {
    "formats"?: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>
    "fileNameKey"?: 'name' | 'fontFamily' | Array<string>
    "fileNameFormat"?: 'camelCase' | 'kebabCase' | 'snakeCase';
  }
}
```

### Options

| Parameter        | Required  | Type                                  | Default                                  | Description                                       |
| ---------------- | --------- | ------------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| `formats`        | optional     | `Array<string>`                       | `["woff2", "woff", "otf", "ttf", "eot"]` | The list of formats to convert |
| `fileNameKey`    | optional     | `name`, `fontFamily`, `Array<string>` | `name`                                   | The design token's keys that will be used to create the file name. These keys will be separated by a space to create the file name.|
| `fileNameFormat` | optional     | `camelCase` `kebabCase` `snakeCase`   |                                          | The function to normalize the file name |


## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least the key `name`

```ts
Array<{
  name: string;
  value: { fontPostScriptName: string; [Key: string]: any };
  [Key: string]: any;
}>
```

### Output

```ts
Array<{
  value: { fontPostScriptName: string; url: string ; [Key: string]: any };
  [Key: string]: any;
}>
```
## Usage

### Config
```json
{
  "name": "convert-font",
  "options": {
    "formats": ["woff2", "woff"],
    "fileNameKey":  ["fontFamily", "fontWeight"],
    "fileNameFormat": "kebabCase"
  }
}
...
```

### Result

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

