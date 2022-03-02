# To React Native

## Description

Transform design tokens to a JavaScript `theme` object which can be used in [React Native](https://reactnative.dev/).

## Interface

```ts
interface parser {
  name: 'to-react-native';
  options?: Partial<{
    colorFormat?:
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
    objectName?: string;
    assetsFolderPath?: string | { vector?: string; bitmap?: string };
    prettierConfig?: Partial<{
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
    }>;
  }>;
}
```

## Usage

### Options

| Parameter                    | Required | Type                                                                       | Default     | Description                                                                                                           |
| ---------------------------- | -------- | -------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `colorFormat`                | optional | `rgb`, `prgb`, `hex`, `hex6`, `hex3`, `hex4`, `hex8`, `name`, `hsl`, `hsv` | `rgb`       | The format of all colors (gradients, borders, textStyles etc.)                                                        |
| `objectName`                 | optional | `string`                                                                   | `'theme'`   | The name of the JS object containing the theme (it will be the default export of the file).                           |
| `assetsFolderPath`           | optional | `string`                                                                   | `undefined` | The relative location of the folder to import the assets from, if not provided, the assets will be referenced by URL. |
| `assetsFolderPath.vector`    | optional | `string`                                                                   | `undefined` | The relative location of the folder to import the **vector** assets from.                                             |
| `assetsFolderPath.bitmap`    | optional | `string`                                                                   | `undefined` | The relative location of the folder to import the **bitmap** assets from.                                             |
| `prettierConfig.endOfLine`   | optional | `auto, lf, crlf, cr`                                                       | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line)                                        |
| `prettierConfig.tabWidth`    | optional | `number`                                                                   | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)                                          |
| `prettierConfig.useTabs`     | optional | `boolean`                                                                  | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)                                               |
| `prettierConfig.singleQuote` | optional | `boolean`                                                                  | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#quotes)                                             |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name, value and type

```ts
type input = Array<{ name: string; value: any; type: string }>;
```

### Output

```ts
type output = string;
```

## Usage

### Config

```jsonc
{
  "name": "Import tokens",
  "path": "src/common/theme/theme.js",
  "filter": {
    "types": [
      "bitmap",
      "border",
      "color",
      "depth",
      "duration",
      "fonts",
      "gradient",
      "measurement",
      "opacity",
      "textStyle",
      "vector"
    ]
  },
  "parsers": [
    {
      "name": "to-react-native",
      "options": {
        "colorFormat": "hex",
        "assetsFolderPath": "src/common/assets",
        "objectName": "myTheme",
        "prettierConfig": {
          "tabWidth": 4,
          "singleQuote": true
        }
      }
    }
  ]
}
```

### Before/After

#### Input

```js
[
  // …
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
  // …
];
```

#### Output

```js
import assetActivity from '../src/assets/activity.svg';

const theme = {
  bitmap: {
    acmeLogo: require('../src/assets/acmeLogo.png'),
  },
  vector: {
    activity: assetActivity,
  },
  depth: {
    background: {
      elevation: 1,
      shadowOpacity: 0.1815,
      shadowRadius: 0.54,
      shadowOffset: { width: 0.6, height: 0.6 },
    },
  },
  duration: {
    base: 300,
  },
  measurement: {
    baseSpace01: 4,
  },
  textStyle: {
    body: {
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Inter-Medium',
      color: '#1e212b',
      letterSpacing: 10,
    },
  },
  border: {
    borderAccent: {
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'rgb(102, 80, 239)',
      borderRadius: 16,
    },
  },
  color: {
    colorsAccent: 'rgb(87, 124, 254)',
  },
  font: {
    firaCodeMedium: 'FiraCode-Medium',
  },
  gradient: {
    gradientsColored: [
      {
        angle: 90,
        colors: ['rgb(245, 72, 63)', 'rgb(255, 142, 5)'],
        locations: [0, 1],
      },
    ],
  },
  opacity: { subtle: 0.5, transparent: 0.1, visible: 0.95 },
};

export default theme;
```

## Guides

<details>
<summary>Downloading assets & fonts</summary>

Downloading assets happens in a seperate rule in `.specifyrc.json`.

```jsonc
// .specifyrc.json
{
  // …
  "rules": [
    {
      "name": "Download Assets",
      "path": "src/common/assets/images",
      "filter": {
        "types": ["vector", "bitmap"]
      }
    },
    {
      "name": "Download Fonts",
      "path": "src/common/assets/fonts",
      "filter": {
        "types": ["font"]
      }
    }
  ]
}
```

Next, create a `react-native.config.js` and fill in the path where the fonts are imported:

```ts
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['assets/fonts/'],
};
```

Finally, run `react-native link` after `specify pull`. All fonts in `assets/fonts` will be ready to use!

> Linking fonts like this only works for non-Expo apps. Feel free to contribute a section for Expo managed apps 🙏.

</details>
<details>
<summary>Rendering bitmaps</summary>
Simple as that:

```tsx
import { Image } from 'react-native';

const App = () => <Image source={theme.bitmap.myBitmap} />;
```

</details>
<details>
<summary>Rendering vectors</summary>

You will need to install and configure [`react-native-svg-transformer`](https://github.com/kristerkari/react-native-svg-transformer). If you are using Expo, this is pre-configured for you. The imported SVG's are React Elements, so it is recommended you create a simple `Vector` component:

```tsx
const Vector = ({ source: SVGElement, ...props }: Props) => <SVGElement {...props} />;

const App = () => <Vector source={theme.vector.myVector} />;
```

</details>

<details>

<summary>Rendering gradients</summary>

For rendering gradients we recommend to use [react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient).
Gradients can be rendered as such:

```tsx
import { LinearGradient } from 'react-native-linear-gradient';

const App = () => (
  <LinearGradient
    colors={theme.gradients.myGradient.colors}
    locations={theme.gradients.myGradient.locations}
    useAngle
    angle={theme.gradients.myGradient.angle}
  />
);
```

</details>
