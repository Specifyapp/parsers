# TO-JSS

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
by passing `"classObject"` to `textStyleFormat` the parser will generate a jss class object containing the `color` property (which isn't a `font` sub-property value).

## Interface
```ts
interface x {
  "name": "to-jss",
  "options"?: Partial<{
    formatName: 'camelCase' | 'kebabCase' | 'snakeCase';
    formatTokens: Partial<{
      color: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
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
      jssObjectName: string,
      exportDefault: boolean,
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
      singleQuote: boolean;
    }>;
  }>
}
```

## Config example
```json
{
  "name": "to-jss",
  "options": {
    "formatName": "camelCase",
    "formatTokens":{
      "color": "hex8",
      "borderFormat": "array",
      "textStyleFormat": "classObject",
      "fontSizeUnit":  "px"
    },
    "formatConfig": {
      "jssObjectName": "lightTheme",
      "exportDefault": false,
      "tabWidth": 4,
      "singleQuote": true,
    }
  }
}
```

### Result example (with default config)

```js
const lightTheme = {
  color: {
    heuristicCrossPlatformQuantify: "rgba(51, 15, 99, 0.6)",
  },
  bitmap: {
    openSystemMarketsHardDrive: "https://specifyapp.com/_nuxt/img/881a6b6.webp",
  },
  border: {
    invoiceSystemWorthyPayment: "7px solid rgba(199, 48, 37, 0.93)",
  },
  duration: {
    digitalSasAvon: "805ms",
  },
  font: {
    frozenWithdrawalGorgeous: "Allan-Bold",
  },
  gradient: {
    concreteNextGenerationPalladium: "linear-gradient(212deg, rgba(186, 149, 255, 0.34) 0%), rgba(229, 120, 89, 0.79) 13%), linear-gradient(6deg, rgba(198, 251, 160, 0.54) 70%), rgba(2, 82, 41, 0.33) 80%), linear-gradient(256deg, rgba(95, 26, 90, 0.9) 38%), rgba(24, 64, 49, 0.6) 55%), linear-gradient(320deg, rgba(54, 214, 6, 0.72) 6%), rgba(47, 5, 13, 0.45) 74%), linear-gradient(79deg, rgba(238, 133, 11, 0.24) 100%), rgba(139, 117, 228, 0.63) 48%)",
  },
  measurement: {
    paangaCalculatePlum: "73px",
  },
  opacity: {
    keyboardForkLoaf: "0.13",
  },
  shadow: {
    carErgonomicLicensedCottonPants: "37px 71px 2px rgba(144, 63, 6, 0.28)",
  },
  textStyle: {
    kidsIowaErgonomic: "Allan-Bold 5pt rgba(86, 225, 86, 0.52)",
  },
  vector: {
    handcraftedRubberComputerSkyBlueBandwidth: "https://raw.githubusercontent.com/feathericons/feather/master/icons/alert-circle.svg",
  },
  depth: {
    towelsUniformTasty: "8",
  }
};

export default lightTheme;
```

## Types

### Input

Array of object with at least name, value and type

```ts
Array<{name: string, value: any, type: string}>
```

### Output

String formated in jss

```ts
string
```
