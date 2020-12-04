# TO CSS FONT

## Description

Create the code used to import font file.

## Interface 

```ts
interface parser {
  "name": "to-css-font",
  "options"?: {
    "formats"?: Array<"woff2"|"woff"|"otf"|"ttf"|"eot">
    "fontsPath"?: string
    "fontFamilyTransform"?: 'camelCase' | 'kebabCase' | 'snakeCase';
    "includeFontWeight"?: boolean;
    "genericFamily"?: 'serif' | 'sans-serif' | 'cursive' | 'fantasy' | 'monospace';
  }
}
```

### Options
| parameter | Require    | type      | default    | description                                       |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------- |
| `formats`    | optional   | `Array<string>`   | `["woff2", "woff", "otf", "ttf", "eot"]` | the list of formats to import |_
| `fontsPath`    | optional   | `string` |  | the path of font's directory |
| `fontFamilyTransform`    | optional   | `string` |  | the function to normalize the font-family property |
| `includeFontWeight`    | optional   | `boolean` | true | Allow to include the font-weight property in the result |
| `genericFamily`    | optional   | `string` |  | The generic font family will be applied after the main font family |

## Usage example 

```json
{
    "name": "to-css-font",
    "options": {
      "formats": ["woff2", "woff"]
    }
}
```
### Result example

```css
@font-face {
 font-family: "Open Sans";
 src: url("OpenSans-Regular-webfont.woff2") format("woff2"),
   url("OpenSans-Regular-webfont.woff") format("woff");
 font-weight: 700;
}
```
## Types

### input

Array of object with at least the key `name`

```ts
Array<{name: string, [Key: string] : any}>
```

### output
```
string
```
