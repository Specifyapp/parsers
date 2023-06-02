# To Flutter

## Description

Format design tokens to create a theme compatible with the [Flutter specification](https://docs.flutter.dev/cookbook/design/themes).

Learn more about how to configure Specify in the API documentation: [https://specifyapp.com/developers](https://specifyapp.com/developers).

## Interface

```ts
interface parser {
  name: 'to-flutter';
  options?: {
    formatByType?: {
      color?: {
        className?: string;
        fileName?: string;
        classType?: string;
      };
      measurement?: {
        devicePixelRatio?: number;
        className?: string;
        fileName?: string;
        classType?: string;
      };
      textStyle?: {
        className?: string;
        fileName?: string;
        classType?: string;
      };
    };
  };
}
```

### Options

| Parameter                                   | Required | Type     | Default              | Description                                                        |
| ------------------------------------------- | -------- | -------- | -------------------- | ------------------------------------------------------------------ |
| `formatByType.color.className`              | optional | `string` | `SpecifyColor`       | Name of the class encapsulating your color design tokens.          |
| `formatByType.color.fileName`               | optional | `string` | `colors.dart`        | Name of the Dart file containing your color design tokens.         |
| `formatByType.color.classType`              | optional | `string` | `Color`              | Type that will be assigned to the generated color variables.       |
| `formatByType.measurement.devicePixelRatio` | optional | `number` | `2`                  | Default pixel ratio use to scale your measurement design tokens.   |
| `formatByType.measurement.className`        | optional | `string` | `SpecifyMeasurement` | Name of the class encapsulating your measurement design tokens.    |
| `formatByType.measurement.fileName`         | optional | `string` | `measurements.dart`  | Name of the Dart file containing your measurement design tokens.   |
| `formatByType.measurement.classType`        | optional | `string` | `double`             | Type that will be assigned to the generated measurement variables. |
| `formatByType.textStyle.className`          | optional | `string` | `SpecifyTextStyle`   | Name of the class encapsulating your textStyle design tokens.      |
| `formatByType.textStyle.fileName`           | optional | `string` | `text-styles.dart`   | Name of the Dart file containing your textStyle design tokens.     |
| `formatByType.textStyle.classType`          | optional | `string` | `TextStyle`          | Type that will be assigned to the generated textStyle variables.   |

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least name, value and type:

```ts
type input = Array<{ name: string; value: any; type: string }>;
```

### Output

String formated in Dart.

```ts
type output = string;
```

## Basic Usage

### Config

```jsonc
"parsers": [
  {
    "name": "to-flutter"
  }
  // …
]
```

### Before/After

#### Input

```jsonc
[
  {
    "name": "Colors/Black",
    "value": {
      "a": 1,
      "b": 43,
      "g": 33,
      "r": 30
    },
    "type": "color"
  },
  {
    "name": "base-space-01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  },
  {
    "name": "heading",
    "value": {
      "font": {
        "value": {
          "fontFamilly": "Roboto",
          "isItalic": true,
          "fontWeight": 500
        }
      },
      "fontSize": {
        "value": {
          "measure": 12,
          "unit": "px"
        }
      },
      "textDecoration": ["line-through"],
      "letterSpacing": {
        "value": {
          "measure": 10
        }
      },
      "color": {
        "value": {
          "a": 1,
          "b": 255,
          "g": 255,
          "r": 0
        }
      }
    },
    "type": "textStyle"
  }
]
```

#### Output

```dart
// colors.dart
import 'dart:ui';

class SpecifyColor {
    SpecifyColor._();

    static const Color colorsBlack = Color(0x1E212BFF);
}
```

```dart
// measurements.dart
import 'dart:ui';

class SpecifyMeasurement {
    SpecifyMeasurement._();

    static const double baseSpace01 = 8.00;
}
```

```dart
// textStyles.dart
import 'dart:ui';

class SpecifyTextStyle {
    SpecifyTextStyle._();

    static const TextStyle heading = TextStyle(
      fontFamily: 'Roboto',
      fontSize: 12.00,
      fontStyle: FontStyle.italic,
      fontWeight: FontWeight.w500,
      decoration: TextDecoration.lineThrough,
      letterSpacing: 10.00,
      color: Color(0xFFFFFF00),
    );
```

## Complex usage - with options

### Config

```jsonc
"parsers": [
  {
    "name": "to-flutter",
    "options": {
      "formatByType": {
        "color": {
          "className": "LightTheme",
          "fileName": "custom-colors-file-name.dart",
          "classType": "MyColor"
        },
        "measurement": {
          "devicePixelRatio": 3.0,
          "className": "CustomTheme",
          "fileName": "custom-measurement-file-name.dart",
          "classType": "twice"
        },
        "textStyle": {
          "className": "CustomStyle",
          "fileName": "custom-text-styles-file-name.dart",
          "classType": "CoolText"
        },
      }
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
    "name": "base-space-01",
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
        "value": {
          "fontFamilly": "Inter",
          "isItalic": false,
          "fontWeight": 100
        }
      },
      "fontSize": {
        "value": {
          "measure": 1,
          "unit": "px"
        }
      },
      "textDecoration": ["underline"]
    },
    "type": "textStyle"
  }
]
```

#### Output

```dart
// custom-colors-file-name.dart
import 'dart:ui';

class LightTheme {
    LightTheme._();

    static const MyColor colorsBlack = Color(0x1E212BFF);
}
```

```dart
// // custom-measurements-file-name.dart
import 'dart:ui';

class CustomTheme {
    CustomTheme._();

    static const twice baseSpace01 = 12.00;
}
```

```dart
// custom-text-styles-file-name.dart
import 'dart:ui';

class CustomStyle {
    CustomStyle._();

    static const CoolText body = TextStyle(
      fontFamily: 'Inter',
      fontSize: 1.00,
      fontStyle: FontStyle.normal,
      fontWeight: FontWeight.w100,
      decoration: TextDecoration.underline,
    );
```
