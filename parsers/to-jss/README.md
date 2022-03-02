# To JSS

## Description

Transform design tokens in JSS.

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
{
  "name": "to-jss",
  "options": {
    "formatName": "camelCase",
    "formatTokens": {
      "colorFormat": "hex8",
      "textStyleFormat": "classObject",
      "fontSizeUnit": "px"
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
const lightTheme = {
  vector: {
    activitySvg:
      'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/a114/ce5c/947dcb83ea93c2da18ee2ea16f470a30',
    airplaySvg:
      'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/5148/a0f1/0663fcd2f52eec2c5dde0777fa3c46bd',
    alertCircleSvg:
      'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/f60c/0138/26feed37c70d80aa0ad4645e46ab0991',
    alertOctagonSvg:
      'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/c4b2/4bfb/f0eae481bb0c109c90cd6dc53e0f0ea4',
    alertTriangleSvg:
      'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/6bd2/c758/aa455203b7511cd948d58cbe421754f9',
    alignCenterSvg:
      'https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/6a6f/e126/49e0b9d2833cf674438551c2ab458538',
  },
  color: {
    colorsAccent: '#6650efff',
    colorsBlack: '#1e212bff',
    colorsGreen: '#58cd52ff',
    colorsGrey: '#ccd5e1ff',
    colorsOrange: '#ff8e05ff',
    colorsRed: '#f5483fff',
    colorsWhite: '#ffffffff',
  },
};

export default lightTheme;
```
