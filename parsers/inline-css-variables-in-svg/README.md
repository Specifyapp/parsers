# Inline CSS variables in svg

## Description

This parser helps you replace all the `stroke` and `fill` attribute raw color value by its corresponding design token as a CSS variable. If no design token match, the raw value will be left as is.

`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#6d28d9">...</svg>`
↓<br>
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--primary-color)">...</svg>`
## Interface

```ts
interface parser {
  name: 'inline-css-variables-in-svg';
  options: {
    cssVariablesFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase' | 'none';
  };
}
```

### Options

| Parameter            | Required | Type                                             | Default     | Description                                                                                         |
| -------------------- | -------- | ------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------- |
| `cssVariablesFormat` | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase` `none` | `kebabCase` | The case transformation you want to apply to the name of the CSS variable that will be exported. |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of objects with at least the key `value.url` or `value.content`.

```ts
type input = Array<
  Record<string, any> & {
    type: string;
    name: string;
    value: ({ url?: string } | { content?: string }) & { [key: string]: any };
  }
>;
```

### Output

Input type extended with `value.content` and `value.fileName`

```ts
type output = Array<
  Record<string, any> & {
    type: string;
    value: { content: string; fileName: string; [key: string]: any };
  }
>;
```

## Basic usage

### Config

```jsonc
"parsers": [
  {
    "name": "inline-css-variables-in-svg"
  }
  // …
]
```

### Before/After

Here, we suppose we have defined the followings tokens:

- `Colors/Black`: `rgba(0, 0, 0, 1)`
- `Colors/Primary`: `rgba(255, 0, 0, 1)`

And `cssVariablesFormat` is `kebabCase`

#### Input
##### Color
```jsonc
[
  {
    "type": "color",
    "value": {
      "a": 0.96,
      "b": 20,
      "g": 227,
      "r": 122
    },
    "name": "Primary Color"
  }
]
```
##### SVG
```jsonc
[
  {
    "type": "vector",
    "name": "activity.svg",
    "value": {
      "url": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/99b5/b311/257c650341b701d691be78f247b9cf5e"
    }
    // …
  }
]
```

The `url` value returns:
```xml
<svg
  viewBox="0 0 20 20"
  stroke="#6d28d9"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M36.6667 20H30L25 35L15 5L10 20H3.33334" />
</svg>
```
#### Output

```xml
<svg
  viewBox="0 0 20 20"
  stroke="var(--primary-color)"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M36.6667 20H30L25 35L15 5L10 20H3.33334" />
</svg>
```
