# PICK

## Description

Loop on all tokens and get only keys given in params.

## Interface 
```ts
interface parser {
  "name": "pick",
  "options"?: {
    "keys": Array<string>
  }
}
```

## Options example
```json
{
  "name": "pick",
  "options": {
    "keys": ["name", "type"]
  }
}
```

## Types

### Input

Array of object with at least a name's key

```ts
Array<{[key: string]: any}>
```

### Output

Array of object with the keys given in options

```ts
Array<{[key: string]: any}>
```

## Before / After

### Before

```json
[
    {
        "type": "color",
        "value": {
            "a": 0.96,
            "b": 20,
            "g": 227,
            "r": 122
        },
        "name": "Generic Borders generate"
    }
]
```

### Options used on parser

```
{
  "name": "pick",
  "options": {
    "keys": ["name"]
  }
}
```

### Result

```json
[
  {
    "name": "Generic Borders generate"
  }
]
```
