# TO-CSS

## Description

Transform design tokens in CSS.

## Interface 
```ts
interface x {
  "name": "to-css-custom-properties",
  "options"?: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase';
    formatTokens: Partial<{
      color: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
    }>;
    formatConfig: Partial<{
      selector: string,
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
    }>;
  }>
}
```

## Options example
```json
{
  "name": "to-css-custom-properties",
  "options": {
    "formatName": "camelCase",
    "formatTokens":{
      "color": "hsl"
    },
    "formatConfig": {
      "selector": "body[data-theme=\"light\"]",
      "tabWidth": 4
    }
  }
}
```

## Types

### Input

Array of object with at least name, value and type

```ts
Array<{name: string, value: any, type: string}>
```

### Output

String formated in css

```ts
string
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
        "name": "Primary color"
    }
]
```

### Options used on parser

```
{
  "name": "to-css-custom-properties",
  "options": {
    "formatName": "camelCase",
    "formatTokens":{
      "color": "hsl"
    },
    "formatConfig": {
      "selector": "body[data-theme=\"light\"]"
      "tabWidth": 4
    }
  }
}
```

### Result

```css
body[data-theme="light"] {
    /* COLOR */
    --primaryColor: hsla(90, 84%, 48%, 0.96);
}
```
