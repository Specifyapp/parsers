# PICK

## Description

Loop on all tokens and get only keys given in params.

## Interface 
```ts
interface x {
  "name": "@specify/pick",
  "params"?: {
    "keys": Array<string>
  }
}
```
## Usage example
```json
{
  "name": "@specify/pick",
  "params": {
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
Array of object with the keys given in params
```ts
Array<{[key: string]: any}>
```
