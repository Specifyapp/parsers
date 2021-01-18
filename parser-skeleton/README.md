# parser-name-skeleton

## Description

Describe your parser here. You can use other parsers as an inspiration.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface

```ts
interface parser {
  name: 'parser-skeleton';
  options?: {
    // Your options here
  };
}
```

### Options

| Parameter       | Required | Type   | Default | Description                   |
| --------------- | -------- | ------ | ------- | ----------------------------- |
| `parameterName` | optional | `Type` | ``      | The effect of this parameters |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with the keys to apply `parser-skeleton` function

```ts
// It is called PleaseChangethisType in your parser file
Array<Record<string, any>>;
```

### Output

```ts
// It is called PleaseChangethisTypeToo in your parser file
Array<Record<string, any>>;
```

## Usage

### Config

```json
{
    "name": "parser-skeleton",
    "options": {
      // Your example of options
    }
}
...
```

### Before/After

#### Input

```json
// Input example here
```

#### Output

```json
// Output example here
```
