# To JSS

## Description
This parser helps you transform design tokens in JSS.

Learn more about how to configure Specify in the API documentation: [https://docs.specifyapp.com/getting-started/getting-started](https://docs.specifyapp.com/getting-started/getting-started).

**Supported JSS syntax**:

- [Basic syntax](https://cssinjs.org/jss-syntax?v=v10.4.0#basic-syntax) [_string_] (default)

```js
primaryBorder: '1px solid #55ff55',
```

- [Alternative syntax for space and comma separated values](https://cssinjs.org/jss-syntax?v=v10.4.0#alternative-syntax-for-space-and-comma-separated-values) [_array_]

```js
primaryBorder: [1, 'solid', '#55ff55'],
```

- [jss-plugin-expand syntax](https://cssinjs.org/jss-plugin-expand?v=v10.4.0#better-syntax-for-complex-properties) [_object_]

```js
primaryBorder: {
  width: 1,
  type: 'solid',
  color: '#55ff55'
},
```

### Optionnal format for font

By passing `"classObject"` to `textStyleFormat` the parser will generate a jss class object containing the `color` and `letter-spacing` properties (which aren't `font`'s sub-properties).

## Interface

```ts
interface parser {
  name: 'to-jss';
  options?: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    formatTokens: Partial<{
      colorFormat:
        | 'rgb'
        | 'prgb'
        | 'hex'
        | 'hex6'
        | 'hex3'
        | 'hex4'
        | 'hex8'
        | 'name'
        | 'hsl'
        | 'hsv';
      borderFormat: 'string' | 'array' | 'object';
      durationFormat: 'string' | 'number';
      opacityFormat: 'string' | 'number';
      depthFormat: 'string' | 'number';
      measurementFormat: 'string' | 'number';
      shadowFormat: 'string' | 'array' | 'object';
      gradientFormat: 'string' | 'array';
      textStyleFormat: 'string' | 'array' | 'object' | 'classObject';
      fontSizeUnit: 'px' | 'pt';
    }>;
    formatConfig: Partial<{
      jssObjectName: string;
      exportDefault: boolean;
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
      singleQuote: boolean;
      assetsFolderPath?: string | { vector?: string; bitmap?: string };
      assetsFilePattern?: string;
    }>;
  }>;
}
```

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name, value and type

```ts
type input = Array<{ name: string; value: any; type: string }>;
```

### Output

String formated in jss

```ts
type output = string;
```

## Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-jss",
    "options": {
      "formatName": "camelCase",
      "formatTokens":{
        "colorFormat": "hex8",
        "textStyleFormat": "classObject",
        "fontSizeUnit":  "px"
      },
      "formatConfig": {
        "jssObjectName": "lightTheme",
        "exportDefault": false,
        "tabWidth": 4,
        "singleQuote": true
      }
    }
  }
  // …
]
```

### Before/After

#### Input

```js
[
  {
    name: 'activity.svg',
    value: {
      url: 'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/a114/ce5c/947dcb83ea93c2da18ee2ea16f470a30',
    },
    type: 'vector',
  },
  {
    name: 'Body',
    value: {
      font: {
        meta: {
          source: 'localStyles',
        },
        name: 'Inter-Medium',
        type: 'font',
        value: {
          isItalic: false,
          fontFamily: 'Inter',
          fontWeight: 500,
          fontPostScriptName: 'Inter-Medium',
        },
      },
      color: {
        value: {
          a: 1,
          b: 196,
          g: 196,
          r: 196,
        },
      },
      fontSize: {
        value: {
          unit: 'px',
          measure: 14,
        },
      },
      textAlign: {
        vertical: 'top',
        horizontal: 'left',
      },
      lineHeight: {
        value: {
          unit: 'px',
          measure: 20,
        },
      },
    },
    type: 'textStyle',
  },
  {
    name: 'Colors / Accent',
    value: {
      a: 1,
      b: 239,
      g: 80,
      r: 102,
    },
    type: 'color',
  },
];
```

#### Output

```js
export const lightTheme = {
    vector: {
        activity:
            'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/96dc/8825/c166b559140a0a64b28441924700a0b2'
    },
    textStyle: {
        body: {
            color: '#1e212bff',
            font: {
                style: null,
                variant: null,
                weight: 500,
                size: 14,
                lineHeight: 20,
                family: 'Inter-Medium',
            },
            letterSpacing: 10,
        }
    },
    color: {
        colorsAccent: '#577cfeff',
    },
};
```
