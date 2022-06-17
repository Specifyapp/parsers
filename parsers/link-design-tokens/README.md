# Link design tokens

## Description

This parser helps you have design tokens referencing other ones.
It replaces absolute values by their potential corresponding design token.

You may want to use this parser to make your borders, shadows and gradients reference other design token types like a measurement or a color.

For instance, a border design token is composed of:

- a border width (a measurement design token)
- a border type
- a border color (a color design token)

The border width and the border color absolute values will be replaced by their corresponding design tokens.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

**ℹ️ Good to know**
This parser is useful when used before the [`to-theme-ui`](https://github.com/Specifyapp/parsers/tree/master/parsers/to-theme-ui) parser.

## How it works

This parser will:

1. Index in a dictionary every measurement and color design tokens returned in your [rule](https://specifyapp.com/developers/configuration#heading-rules)
2. Hash their value with [the md5 algorithm](https://md5hashing.net/)
3. Associate their hash and `id`

The dictionary resembles this:

```ts
// interface LinkableTokensSignatures
{
  'color': {
    [md5(color.value)]: [color.id]
  },
  'measurement': {
    [md5(measurement.value)]: [measurement.id]
  }
}
```

Some design tokens include a `compute()` method. It dictates how their values should be transformed to contain references of other design tokens.

The parser will only loop over the design tokens including the `compute()` method.

It will replace the absolute child values they contain by the corresponding design token from the dictionary.

## Interface

```ts
interface parser {
  name: 'link-design-tokens';
}
```

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object containing at least the keys described in the pattern option.

```ts
type input = Array<{ id: string; type: string; value: string; name: string } & Record<any, any>>;
```

### Output

```ts
type output = Array<{ id: string; type: string; value: string; name: string } & Record<any, any>>;
```

## Basic usage

### Config

```jsonc
"parsers": [
  {
    "name": "link-design-tokens"
  }
  // ...
]
```

### Before/After

#### Input

```jsonc
[
  {
    "id": "1",
    "type": "color",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "name": "color-primary"
  },
  {
    "id": "2",
    "type": "border",
    "value": {
      "type": "solid",
      "color": {
        "value": {
          // <--- This absolute color value must be replaced by its corresponding design token
          "a": 1,
          "b": 255,
          "g": 189,
          "r": 198
        }
      },
      "width": {
        "value": {
          "unit": "px",
          "measure": 2
        }
      }
    },
    "name": "border-active"
  }
]
```

#### Output

```jsonc
[
  {
    "id": "1",
    "type": "color",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "name": "color-primary"
  },
  {
    "id": "2",
    "type": "border",
    "value": {
      "type": "solid",
      "color": {
        // <--- The corresponding design token replaced the absolute color value 🎉
        "id": "1",
        "type": "color",
        "value": {
          "a": 1,
          "b": 255,
          "g": 189,
          "r": 198
        },
        "name": "color-primary"
      },
      "width": {
        "value": {
          "unit": "px",
          "measure": 2
        }
      }
    },
    "name": "border-active"
  }
]
```
