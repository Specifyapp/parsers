# To Typescript Definition

## Description

Format design tokens to create a Typescript types definition file.

This parser creates a Typescript types definition file with types names being tokens types, and the values of the types the name of the tokens.

## Interface

```ts
interface parser {
  name: 'to-typescript-definition';
  options: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase' | 'none';
    typesNamesMapping: Partial<{
      font: string;
      bitmap: string;
      vector: string;
      border: string;
      color: string;
      gradient: string;
      duration: string;
      measurement: string;
      opacity: string;
      shadow: string;
      textStyle: string;
      depth: string;
    }>;
  }>;
}
```

### Options

| Parameter                       | Required | Type                                                    | Default       | Description                                                         |
| ------------------------------- | -------- | ------------------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| `formatName`                    | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase` `none` | `kebabCase`   | The case transformation you want to apply to your design token name |
| `typesNamesMapping.font`        | optional | `string`                                                | `font`        | How you want the type font to be named                              |
| `typesNamesMapping.bitmap`      | optional | `string`                                                | `bitmap`      | How you want the type bitmap to be named                            |
| `typesNamesMapping.vector`      | optional | `string`                                                | `vector`      | How you want the type vector to be named                            |
| `typesNamesMapping.border`      | optional | `string`                                                | `border`      | How you want the type border to be named                            |
| `typesNamesMapping.color`       | optional | `string`                                                | `color`       | How you want the type color to be named                             |
| `typesNamesMapping.gradient`    | optional | `string`                                                | `gradient`    | How you want the type gradient to be named                          |
| `typesNamesMapping.duration`    | optional | `string`                                                | `duration`    | How you want the type duration to be named                          |
| `typesNamesMapping.measurement` | optional | `string`                                                | `measurement` | How you want the type measurement to be named                       |
| `typesNamesMapping.opacity`     | optional | `string`                                                | `opacity`     | How you want the type opacity to be named                           |
| `typesNamesMapping.shadow`      | optional | `string`                                                | `shadow`      | How you want the type shadow to be named                            |
| `typesNamesMapping.textStyle`   | optional | `string`                                                | `textStyle`   | How you want the type textStyle to be named                         |
| `typesNamesMapping.depth`       | optional | `string`                                                | `depth`       | How you want the type depth to be named                             |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name and type:

```ts
type input = Array<{ name: string; type: string }>;
```

### Output

String containing Typescript types exports

```ts
type output = string;
```

## Basic Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-typescript-definition"
  }
  // …
]
```

### Before/After

#### Input

```jsonc
[
  {
    "name": "primary",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "secondary",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "base-space-01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "base-space-02",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  }
]
```

#### Output

```ts
export type color = 'primary' | 'secondary';

export type measurement = 'base-space-01' | 'base-space-02';
```
