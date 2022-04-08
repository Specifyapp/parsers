# TO SCSS MAP

## Description
This parser helps you generate `.scss` files containing Scss map and function / mixin to access the values of the tokens.

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

## Interface

```ts
interface parser {
  name: 'to-scss-map';
  options?: Partial<{
    fileName?: string | PartialRecord<TokensType, string>;
    functionName?: string | PartialRecord<ToScssMapTokenType, string>;
    mixinName?: string | PartialRecord<ToScssMapTokenType, string>;
    variableName?: string | PartialRecord<TokensType, string>;
    formatName?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
    formatConfig: Partial<{
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
      singleQuote: boolean;
    }>;
    formatTokens?: {
      color?: {
        format: 'rgb' | 'prgb' | 'hex' | 'hex6' | 'hex3' | 'hex4' | 'hex8' | 'name' | 'hsl' | 'hsv';
      };
      fontSize?: {
        unit?: 'px' | 'rem';
      };
    };
    splitBy?: string;
    omitFunctionAndMixin?: boolean;
  }>;
}
```

### Options

| Parameter                    | Required | Type                                                              | Default     | Description                                                                                                                                                                                                                          |
| ---------------------------- | -------- | ----------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `filename`                   | optional | `string` `object`                                                 |             | How to name the map variable. Can be a mapping with token typeas key and file name as a value or a RegExp pattern. See [advanced usage example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-map#config-1).     |
| `functionName`               | optional | `string` `object`                                                 |             | How to name the map variable. Can be a mapping with token typeas key and function name as a value or a RegExp pattern. See [advanced usage example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-map#config-1). |
| `mixinName`                  | optional | `string` `object`                                                 |             | How to name the map variable. Can be a mapping with token typeas key and mixin name as a value or a RegExp pattern. See [advanced usage example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-map#config-1).    |
| `variableName`               | optional | `string` `object`                                                 |             | How to name the map variable. Can be a mapping with token typeas key and variable name as a value or a RegExp pattern. See [advanced usage example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-map#config-1). |
| `formatName`                 | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase`                  | `kebabCase` | The case transformation you want to apply to your design token name.                                                                                                                                                                 |
| `formatConfig.endOfLine`     | optional | `auto` `lf` `crlf` `cr`                                           | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line)                                                                                                                                                       |
| `formatConfig.tabWidth`      | optional | `number`                                                          | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)                                                                                                                                                         |
| `formatConfig.useTabs`       | optional | `boolean`                                                         | `true`      | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)                                                                                                                                                              |
| `formatConfig.singleQuote`   | optional | `boolean`                                                         | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#quotes)                                                                                                                                                            |
| `formatTokens.color.format`  | optional | `rgb` `prgb` `hex` `hex6` `hex3` `hex4` `hex8` `name` `hsl` `hsv` | `rgb`       | The color format you want to apply to your potential color design token.                                                                                                                                                             |
| `formatTokens.fontSize.unit` | optional | `px` `rem`                                                        | `none`      |                                                                                                                                                                                                                                      |
| `splitBy`                    | optional | `string`                                                          |             | The character used to define the nesting of the values in the map object (e.g. The name of the color in [this example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-map#input-2))                               |
| `omitFunctionAndMixin`       | optional | `boolean`                                                         | `false`     | When set to true, blocks the creation of the getter functions and mixins.                                                                                                                                                            |

## Output
Please keep in mind that this parser generates files. This is why you should always set a folder as the final `path` in your parent rule.

<details open>
<summary>See Do & Don't config examples</summary>

✅ Do
```
// ...
"rules": [
  {
    "name": "Design Tokens / Colors",
    "path": "colors", // <-- path set as a folder
    "parsers": [
      {
        "name": "to-scss-map"
      }
    ]
  }
]
```

🚫 Don't
```
// ...
"rules": [
  {
    "name": "Design Tokens / Colors",
    "path": "colors/colors.json", // <-- path set as a file
    "parsers": [
      {
        "name": "to-scss-map"
      }
    ]
  }
]
```
</details>


## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name, value and type:

```ts
type input = Array<{ name: string; value: any; type: string }>;
```

### Output

```ts
type output = Array<{ name: string; value: { content: string } }>;
```

## Basic Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-scss-map"
  }
  // …
]
```

### Before/After
#### Input

```jsonc
[
  {
    "name": "primary",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "baseSpace01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "body",
    "value": {
      "font": {
        "id": "69d2d62e-4d62-45d7-b85f-5da2f9f0c0d4",
        "name": "Roboto-Regular",
        "value": {
          "fontFamily": "Roboto",
          "fontWeight": 400,
          "fontPostScriptName": "Roboto-Regular"
        },
        "type": "font"
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 16
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 20
        }
      },
      "fontVariant": ["small-caps"]
    },
    "type": "textStyle"
  }
]
```

#### Output

File tree

```
🗂 
└── measurement.scss
└── color.scss
└── textStyle.scss
```

##### measurement.scss

```scss
@use "sass:map";

$measurement: (
  baseSpace01: 4px,
);
@function get-measurement($levels...) {
  $fetched: $measurement;
  @each $level in $levels {
    @if map-has-key($fetched, $level) {
      $fetched: map-get($fetched, $level);
    } @else {
      @error "There is no `#{$level}` in the `#{$measurement}` map";
    }
  }
  @if type-of($fetched) == map {
    @error "Non usable value. Got `#{$measurement}`";
  }

  @return $fetched;
}
```

##### color.scss

```scss
@use "sass:map";

$color: (
  primary: rgb(198, 189, 255),
);
@function get-color($levels...) {
  $fetched: $color;
  @each $level in $levels {
    @if map-has-key($fetched, $level) {
      $fetched: map-get($fetched, $level);
    } @else {
      @error "There is no `#{$level}` in the `#{$color}` map";
    }
  }
  @if type-of($fetched) == map {
    @error "Non usable value. Got `#{$color}`";
  }

  @return $fetched;
}
```

##### textStyle.scss

```scss
@use "sass:map";

$textStyle: (
  body: (
    font-family: 'Roboto-Regular',
    font-size: 16px,
    font-weight: 400,
    line-height: 20px,
  ),
);
@mixin text-style($levels...) {
  $fetched: $text-style;
  @each $level in $levels {
    @if map-has-key($fetched, $level) {
      $fetched: map-get($fetched, $level);
    } @else {
      @error "There is no `#{$level}` in the `#{$text-style}` map";
    }
  }
  @if type-of($fetched) != map {
    @error "Non usable value. Got `#{$text-style}`";
  }

  @each $prop, $value in $fetched {
    #{$prop}: $value;
  }
}
```

#### How to use the generated files

In another scss file you can use it like

```scss
@import 'color.scss';
@import 'measurement.scss';
@import 'textStyle.scss';

.my-example {
  background: get-color(primary);
  margin: get-measurement(baseSpace01);
  @include text-style(body);
}
```

## Advanced Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-scss-map",
    "options": {
      "variableName": {
        "color": "custom-color",
        "measurement": "my-{{type}}",
        "textStyle": "typography"
      },
      "fileName": {
        "color": "_colors",
        "measurement": "_sizing",
        "textStyle": "_typography"
      },
      "formatTokens": {
        "fontSize": {
          "unit": "rem"
        }
      },
      "splitBy": "/"
    }
  }
  // …
]
```

### Before/After

#### Input

```jsonc
[
  {
    "name": "primary / default",
    "value": {
      "a": 1,
      "b": 255,
      "g": 189,
      "r": 198
    },
    "type": "color"
  },
  {
    "name": "baseSpace01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "body",
    "value": {
      "font": {
        "id": "69d2d62e-4d62-45d7-b85f-5da2f9f0c0d4",
        "name": "Roboto-Regular",
        "value": {
          "fontFamily": "Roboto",
          "fontWeight": 400,
          "fontPostScriptName": "Roboto-Regular"
        },
        "type": "font"
      },
      "fontSize": {
        "value": {
          "unit": "px",
          "measure": 16
        }
      },
      "textAlign": {
        "vertical": "top",
        "horizontal": "left"
      },
      "lineHeight": {
        "value": {
          "unit": "px",
          "measure": 20
        }
      },
      "fontVariant": ["small-caps"]
    },
    "type": "textStyle"
  }
]
```

#### Output

File tree

```
🗂
└── _sizing.scss
└── _colors.scss
└── _typography.scss
```

##### sizing.scss

```scss
@use "sass:map";

$my-measurement: (
  baseSpace01: 4px,
);

@function get-my-measurement($levels...) {
  $fetched: $my-measurement;
  @each $level in $levels {
    @if map-has-key($fetched, $level) {
      $fetched: map-get($fetched, $level);
    } @else {
      @error "There is no `#{$level}` in the `#{$my-measurement}` map";
    }
  }
  @if type-of($fetched) == map {
    @error "Non usable value. Got `#{$my-measurement}`";
  }

  @return $fetched;
}
```

##### _color.scss

```scss
@use "sass:map";

$custom-color: (
  primary: (
    default: rgb(198, 189, 255),
  ),
);
@function get-color($levels...) {
  $fetched: $custom-color;
  @each $level in $levels {
    @if map-has-key($fetched, $level) {
      $fetched: map-get($fetched, $level);
    } @else {
      @error "There is no `#{$level}` in the `#{$custom-color}` map";
    }
  }
  @if type-of($fetched) == map {
    @error "Non usable value. Got `#{$custom-color}`";
  }

  @return $fetched;
}
```

##### _typography.scss

```scss
@use "sass:map";

$typography: (
  body: (
    font-family: 'Roboto-Regular',
    font-size: 1rem,
    font-weight: 400,
    line-height: 20px,
  ),
);
@mixin typography($levels...) {
  $fetched: $typography;
  @each $level in $levels {
    @if map-has-key($fetched, $level) {
      $fetched: map-get($fetched, $level);
    } @else {
      @error "There is no `#{$level}` in the `#{$typography}` map";
    }
  }
  @if type-of($fetched) != map {
    @error "Non usable value. Got `#{$typography}`";
  }

  @each $prop, $value in $fetched {
    #{$prop}: $value;
  }
}
```

#### How to use the generated files

In another scss file you can use it like

```scss
@import 'color.scss';
@import 'measurement.scss';
@import 'typography.scss';

.my-example {
  background: get-custom-color(primary, default);
  margin: get-my-measurement(baseSpace01);
  @include typography(body);
}
```
