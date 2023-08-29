# Convert Font

## Description
This parser helps you convert font in several formats.

Learn more about how to configure Specify in the API documentation: [https://docs.specifyapp.com/getting-started/getting-started](https://docs.specifyapp.com/getting-started/getting-started).

## Interface

```ts
interface parser {
  name: 'convert-font';
  options?: {
    formats?: Array<'woff2' | 'woff' | 'otf' | 'ttf' | 'eot'>;
    fileNameKey?: 'name' | 'fontFamily' | 'fontPostScriptName' | Array<string>;
    fileNameFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
  };
}
```

### Options

| Parameter        | Required | Type                                                        | Default             | Description                                                                                                                         |
| ---------------- | -------- | ----------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `formats`        | optional | `Array<string>`                                             | `["woff2", "woff"]` | The list of formats to convert                                                                                                      |
| `fileNameKey`    | optional | `name`, `fontFamily`, `fontPostScriptName`, `Array<string>` | `name`              | The design token's keys that will be used to create the file name. These keys will be separated by a space to create the file name. |
| `fileNameFormat` | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase`            |                     | The function to normalize the file name                                                                                             |

## Output
Please keep in mind that this parser generates files. This is why you should always set a folder as the final `path` in your parent rule.

<details open>
<summary>See Do & Don't config examples</summary>

✅ Do
```
// ...
"rules": [
  {
    "name": "Design Tokens / Fonts",
    "path": "fonts", // <-- path set as a folder
    "parsers": [
      {
        "name": "convert-font"
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
    "name": "Design Tokens / Fonts",
    "path": "fonts/fonts.json", // <-- path set as a file
    "parsers": [
      {
        "name": "convert-font"
      }
    ]
  }
]
```
</details>

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least the key `name`

```ts
type input = Array<{
  name: string;
  value: { fontPostScriptName: string; [Key: string]: any };
  [Key: string]: any;
}>;
```

### Output

```ts
type output = Array<{
  value: { fontPostScriptName: string; url: string; [Key: string]: any };
  [Key: string]: any;
}>;
```

## Usage

### Config
```jsonc
"parsers": [
  {
    "name": "convert-font",
    "options": {
      "formats": ["woff2", "woff"],
      "fileNameKey":  ["fontFamily", "fontWeight"],
      "fileNameFormat": "kebabCase"
    }
  }
  // ...
]
```

### Result

```jsonc
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

## ℹ️ Good to know

We decided to exclude the `eot`, `otf` and `ttf` file formats in the [`formats`](#Options) parameter. If you are mostly targeting users with modern browsers, [you can get away with a progressive method](https://css-tricks.com/understanding-web-fonts-getting/#font-formats) of using `@font-face` that only serves WOFF and WOFF2 formats.

However, you can still add `eot`, `otf` and `ttf` file formats in the [`formats`](#Interface) parameter if you need to support older browsers.
