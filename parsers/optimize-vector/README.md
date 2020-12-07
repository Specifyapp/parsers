# OPTIMIZE VECTOR

## Description

SVG optimizer using [svgo](https://github.com/svg/svgo). 

## Interface

```ts
interface x {
  "name": "optimize-vector",
  "options"?: {
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/svgo/index.d.ts#L348
    "svgo"?:  SVGO.Options 
  }
}
```

### Options
| parameter | Require    | type      | default    | description                                       |
| --------- | ---------- | --------- | ---------- | ------------------------------------------------- |
| `svgo`    | optional   | `SVGO.Options`   | [Default config](https://github.com/svg/svgo#what-it-can-do) | Inherit from [svgo](https://github.com/svg/svgo) |

## Example 

```json
{
    "name": "optimize-vector"
}
```

## Types

### input

Array of object with the keys to apply pascalcase function

```ts
Array<
  Record<string, any> & {
    type: string;
    value: { url: string } & { [key: string]: any };
  }
>
```

### output


```ts
Array<
  Record<string, any> & {
    type: string;
    value: { content: string } & { [key: string]: any };
  }
>
```
