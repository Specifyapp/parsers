# Pick

## Description

Loop on all tokens and get only keys given in params.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers/cli](https://specifyapp.com/developers/cli)

## Interface 
```ts
interface parser {
  name: 'pick',
  options?: {
    keys: Array<string>
  }
}
```
### Options

| Parameter              | Required   | Type      | Default    | Description                                          |
| ---------------------- | ---------- | --------- | ---------- | ---------------------------------------------------- |
| `keys`                 | optional   | `Array`   | `["name"]` | The list of keys where the function will be applied. |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

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
## Usage
### Config

```json
{
  "name": "pick",
  "options": {
    "keys": ["name", "type"]
  }
}
...
```
### Before/After

#### Input

```js
[
  {
    "type": "color",
    "value": {
      "a": 0.96,
      "b": 20,
      "g": 227,
      "r": 122
    },
    "name": "Brand / Primary Color"
  }
]
```
#### Output

```json
[
  {
    "name": "Brand / Primary Color",
    "type": "color"
  }
]
```