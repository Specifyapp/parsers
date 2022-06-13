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
      };
      measurement?: {
        devicePixelRatio?: number;
        className?: string;
        fileName?: string;
      };
    };
  };
}
```

### Options

| Parameter                                   | Required | Type     | Default              | Description                                                      |
| ------------------------------------------- | -------- | -------- | -------------------- | ---------------------------------------------------------------- |
| `formatByType.color.className`              | optional | `string` | `SpecifyColor`       | Name of the class encapsulating your color design tokens.        |
| `formatByType.color.fileName`               | optional | `string` | `colors.dart`        | Name of the Dart file containing your color design tokens.       |
| `formatByType.measurement.devicePixelRatio` | optional | `number` | `2`                  | Default pixel ratio use to scale your measurement design tokens. |
| `formatByType.measurement.className`        | optional | `string` | `SpecifyMeasurement` | Name of the class encapsulating your measurement design tokens.  |
| `formatByType.measurement.fileName`         | optional | `string` | `measurements.dart`  | Name of the Dart file containing your measurement design tokens. |

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
    }
    "type": "color"
  },
  {
    "name": "base-space-01",
    "value": {
      "unit": "px",
      "measure": 4
    },
    "type": "measurement"
  }
]
```

#### Output

```dart
// colors.dart
import 'dart:ui';

class SpecifyColor {
    SpecifyColor._();

    static const colorsBlack = Color(0x1E212BFF);
}
```

```dart
// measurements.dart
import 'dart:ui';

class SpecifyMeasurement {
    SpecifyMeasurement._();

    static const baseSpace01 = 8.00;
}
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
          "fileName": "custom-colors-file-name.dart"
        },
        "measurement": {
          "devicePixelRatio": 3.0,
          "className": "CustomTheme",
          "fileName": "custom-measurement-file-name.dart"
        }
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
  }
]
```

#### Output

```dart
// custom-colors-file-name.dart
import 'dart:ui';

class LightTheme {
    LightTheme._();

    static const colorsBlack = Color(0x1E212BFF);
}
```

```dart
// // custom-measurements-file-name.dart
import 'dart:ui';

class CustomTheme {
    CustomTheme._();

    static const baseSpace01 = 12.00;
}
```
