# Inline CSS variables in svg

## Description

This parser will replace all the `stroke` and `fill` values by a Css variable if it can finds the color in the tokens, otherwise it'll let the raw value.

## Interface

```ts
interface parser {
  name: 'inline-css-variables-in-svg';
  options: {
    cssVariablesFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
  };
}
```

### Options

| Parameter            | Required | Type                                             | Default     | Description                                                                                         |
| -------------------- | -------- | ------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------- |
| `cssVariablesFormat` | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase` | `kebabCase` | The case transformation you want to apply to the name of JavaScript variable that will be exported. |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least the key `value.url` or `value.content`.

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

```xml
<svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    stroke="#ff0000"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M36.6667 20H30L25 35L15 5L10 20H3.33334"
        stroke="black"
        stroke-width="3.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
```

#### Output

```xml
<svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    stroke="var(--colors-primary)"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M36.6667 20H30L25 35L15 5L10 20H3.33334"
        stroke="var(--colors-black)"
        stroke-width="3.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
```
