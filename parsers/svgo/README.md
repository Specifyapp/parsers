# SVGO

## Description
This parser helps you optimize vectors using [svgo](https://github.com/svg/svgo).

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

## Interface

```ts
interface parser {
  name: 'svgo';
  options?: {
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/3fb92644d8dc475a52147c6315704ece24335469/types/svgo/index.d.ts#L752
    svgo?: OptimizeOptions;
  };
}
```

### Options

| Parameter | Required | Type              | Default                                  | Description                                       |
| --------- | -------- | ----------------- | ---------------------------------------- | ------------------------------------------------- |
| `svgo`    | optional | `OptimizeOptions` | `{ plugins: [{name: 'preset-default'}]}` | Inherits from [svgo](https://github.com/svg/svgo) |

## Output
Please keep in mind that this parser generates files. This is why you should always set a folder as the final `path` in your parent rule.

<details open>
<summary>See Do & Don't config examples</summary>

✅ Do
```
// ...
"rules": [
  {
    "name": "Icons",
    "path": "icons", // <-- path set as a folder
    "parsers": [
      {
        "name": "svgo"
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
    "name": "Icons",
    "path": "icons/icons.json", // <-- path set as a file
    "parsers": [
      {
        "name": "svgo"
      }
    ]
  }
]
```
</details>

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least the key `value.url` and `type`

```ts
type input = Array<
  Record<string, any> & {
    type: string;
    value: { url: string } & { [key: string]: any };
  }
>;
```

### Output

```ts
type output = Array<
  Record<string, any> & {
    type: string;
    value: { content: string } & { [key: string]: any };
  }
>;
```

## Usage

### Config

```jsonc
"parsers": [
  {
    "name": "svgo",
    "options": {
      "svgo": {
        "plugins": [
          {
            "removeDimensions": true
          },
          {
            "removeAttrs": {
              "attrs": "*:(fill|stroke)"
            }
          }
        ]
      }
    }
  }
  // …
]
```

### Before/After

#### Input

```jsonc
{
  "type": "vector",
  "name": "activity.svg",
  "value": {
    "url": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/99b5/b311/257c650341b701d691be78f247b9cf5e"
  }
  // …
}
```

Under the hood, the SVG string returned by the `url` property is the one you want to optimize:

```xml
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M36.6667 20H30L25 35L15 5L9.99999 20H3.33333" stroke="black" stroke-width="3.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### Output

```jsonc
{
  "type": "vector",
  "name": "activity.svg",
  "value": {
    "content": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\"><path d=\"M36.667 20H30l-5 15L15 5l-5 15H3.333\" stroke-width=\"3.333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>"
  }
  // …
}
```

ℹ️ Every SVGO option must be in its own object.
