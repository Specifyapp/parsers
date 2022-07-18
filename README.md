[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Specifyapp/parsers/CI)
[![Coverage Status](https://coveralls.io/repos/github/Specifyapp/parsers/badge.svg?branch=master)](https://coveralls.io/github/Specifyapp/parsers?branch=master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Specifyapp/parsers.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Specifyapp/parsers/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/Specifyapp/parsers.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Specifyapp/parsers/alerts/)
<a href="https://github.com/Specifyapp/parsers/graphs/contributors">
<img src="https://img.shields.io/github/contributors/Specifyapp/parsers" alt="Contributors" />
</a>

<!-- [![CI Actions Status](https://github.com/Specifyapp/parsers/workflows/CI/badge.svg)](https://github.com/Specifyapp/parsers/actions) -->

# Specify Parsers

<img width="1440" alt="Repository Header" src="https://user-images.githubusercontent.com/16894359/161260523-376f533e-ec72-46c0-9f87-9cd31befe04f.png">

<p align="center">
  <br />
  <a href="https://specifyapp.com/developers/" rel="dofollow"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://github.com/Specifyapp/parsers/issues">Report Bug</a>
  ·
  <a href="https://specify.canny.io">Request Feature</a>
  ·
  <a href="https://discord.com/invite/vMkDk4CbG4">Join Our Discord</a>
  ·
  <a href="https://twitter.com/specifyapp">Twitter</a>
</p>

## What is Specify?

Specify helps you unify your brand identity by collecting, storing and distributing design tokens and assets—automatically.

![Possibilities offered by design apis like specify](https://user-images.githubusercontent.com/3913276/163355794-337b67e3-baf2-4a58-88fe-0dbbce9c71f3.jpg#gh-dark-mode-only)
![Possibilities offered by design apis like specify](https://user-images.githubusercontent.com/3913276/164198710-76f2e024-fdb1-4fc7-bcce-20e7dd676085.jpg#gh-light-mode-only)

## Parsers

### Why you need parsers

By default, without any parsers, Specify will return your design data as raw data:

- Design tokens are returned in JSON
- Assets are returned as files

There are high chances you need to transform those design data to fit your needs. Parsers help you do just that.

### What are parsers?

Parsers are functions allowing you to transform design tokens and assets coming from Specify to fit your needs and company standards.

![How parsers work](https://user-images.githubusercontent.com/3913276/163356071-159bec67-13d2-4549-a48c-d1f8d17522e3.jpg#gh-dark-mode-only)
![How parsers work](https://user-images.githubusercontent.com/3913276/164199138-0e4daadd-d125-42b3-a065-526cc3ce4025.jpg#gh-light-mode-only)

A parser does the following job:

1. Receives design data as input
2. Transforms this design data
3. Returns the transformed data

The data returned by a parser can either be:

- Design data that can be used by another parser coming next in your transformation pipeline
- A file so it can be used by people, frameworks, or scripts

Not only parsers are what make Specify powerful and flexible, but above all, they help you be in total control of the design data you synchronize.

Parsers are ordered and takes specific input to generate specific output. This way, we can easily test the input coming from the previous parser to check if the whole parsers process will work.

### All parsers available

| Parser                                                                                                                 | Description                                                                                                                                                                                                                                  | Usage example                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [camelcasify](https://github.com/Specifyapp/parsers/tree/master/parsers/camelcasify)                                   | Apply camelcase function on specific keys from a design token.                                                                                                                                                                               | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/camelcasify#usage)                  |
| [convert-font](https://github.com/Specifyapp/parsers/tree/master/parsers/convert-font)                                 | Convert font files in several formats.                                                                                                                                                                                                       | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/convert-font#usage)                 |
| [filter](https://github.com/Specifyapp/parsers/tree/master/parsers/filter)                                             | Filter tokens and assets by their name using a regular expression.                                                                                                                                                                           | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/filter#usage)                       |
| [kebabcasify](https://github.com/Specifyapp/parsers/tree/master/parsers/kebabcasify)                                   | Apply kebabcase function on specific keys from a design token.                                                                                                                                                                               | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/kebabcasify#usage)                  |
| [link-design-tokens](https://github.com/Specifyapp/parsers/tree/master/parsers/link-design-tokens)                     | Have design tokens referencing other ones. It replaces absolute values by their potential corresponding design token.                                                                                                                        | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/link-design-tokens#usage)           |
| [name-assets-files-by-pattern](https://github.com/Specifyapp/parsers/tree/master/parsers/name-assets-files-by-pattern) | Set a structured filename on your assets. It won't rename your asset but only add a new `filename` property on the asset object. The filename structure uses [mustache](https://github.com/janl/mustache.js#templates) as a template engine. | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/name-assets-files-by-pattern#usage) |
| [omit](https://github.com/Specifyapp/parsers/tree/master/parsers/omit)                                                 | Omit keys from a design token not given in parameters.                                                                                                                                                                                       | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/omit#usage)                         |
| [pascalcasify](https://github.com/Specifyapp/parsers/tree/master/parsers/pascalcasify)                                 | Apply pascalcase function on specific keys from a design token.                                                                                                                                                                              | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/pascalcasify#usage)                 |
| [pick](https://github.com/Specifyapp/parsers/tree/master/parsers/pick)                                                 | Get only specific keys from a design token given in params.                                                                                                                                                                                  | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/pick#usage)                         |
| [px-to-rem](https://github.com/Specifyapp/parsers/tree/master/parsers/px-to-rem)                                       | Convert the value of a measurement design token from pixel to rem.                                                                                                                                                                           | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/px-to-rem#usage)                    |
| [replace-string](https://github.com/Specifyapp/parsers/tree/master/parsers/replace-string)                             | Replace any string matched by a regex by a new string.                                                                                                                                                                                       | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/replace-string#usage)               |
| [round-number](https://github.com/Specifyapp/parsers/tree/master/parsers/round-number)                                 | Round any measurement design token with specific precision.                                                                                                                                                                                  | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/round-number#usage)                 |
| [snakecasify](https://github.com/Specifyapp/parsers/tree/master/parsers/snakecasify)                                   | Apply snakecase function on specific keys from a design token.                                                                                                                                                                               | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/snakecasify#usage)                  |
| [sort-by](https://github.com/Specifyapp/parsers/tree/master/parsers/sort-by)                                           | Loop on several design tokens and sort them according to their respective key values.                                                                                                                                                        | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/sort-by#usage)                      |
| [suffix-by](https://github.com/Specifyapp/parsers/tree/master/parsers/suffix-by)                                       | Concatenate two strings.                                                                                                                                                                                                                     | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/suffix-by#usage)                    |
| [svg-to-jsx](https://github.com/Specifyapp/parsers/tree/master/parsers/svg-to-jsx)                                     | Wrap SVG files within a JSX component.                                                                                                                                                                                                       | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/svg-to-jsx#usage)                   |
| [svgo](https://github.com/Specifyapp/parsers/tree/master/parsers/svgo)                                                 | Optimize vectors using [svgo](https://github.com/svg/svgo).                                                                                                                                                                                  | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/svgo#usage)                         |
| [to-css-custom-properties](https://github.com/Specifyapp/parsers/tree/master/parsers/to-css-custom-properties)         | Transform design tokens in CSS Custom Properties.                                                                                                                                                                                            | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-css-custom-properties#usage)     |
| [to-css-font-import](https://github.com/Specifyapp/parsers/tree/master/parsers/to-css-font-import)                     | Create CSS `@font-face` rules to import your font files.                                                                                                                                                                                     | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-css-font-import#usage)           |
| [to-css-text-style](https://github.com/Specifyapp/parsers/tree/master/parsers/to-css-text-style)                       | Create text styles as CSS classes.                                                                                                                                                                                                           | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-css-text-style#usage)            |
| [to-dsp](https://github.com/Specifyapp/parsers/tree/master/parsers/to-dsp)                                             | Create a [Design System Package (DSP)](https://github.com/AdobeXD/design-system-package-dsp).                                                                                                                                                | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-dsp#usage)                       |
| [to-jss](https://github.com/Specifyapp/parsers/tree/master/parsers/to-jss)                                             | Transform design tokens in JSS.                                                                                                                                                                                                              | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-jss#usage)                       |
| [to-flutter](https://github.com/Specifyapp/parsers/tree/master/parsers/to-flutter)                                     | Transform design tokens for Flutter.                                                                                                                                                                                                         | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-flutter#usage)                   |
| [to-react-native](https://github.com/Specifyapp/parsers/tree/master/parsers/to-react-native)                           | Transform design tokens to a JavaScript theme object compatible with [React Native](https://reactnative.dev/).                                                                                                                               | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-react-native#usage)              |
| [to-scss-map](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-map)                                   | Generate `.scss` files containing Scss map and function / mixin to access the values of the tokens.                                                                                                                                          | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-map#usage)                  |
| [to-scss-mixin-text-style](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-mixin-text-style)         | Create text styles formatted as [SCSS mixins](https://sass-lang.com/documentation/at-rules/mixin).                                                                                                                                           | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-mixin-text-style#usage)     |
| [to-scss-variables](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-variables)                       | Transform design tokens in SCSS variables.                                                                                                                                                                                                   | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-variables#usage)            |
| [to-style-dictionary](https://github.com/Specifyapp/parsers/tree/master/parsers/to-style-dictionary)                   | Generate [Style Dictionary](https://amzn.github.io/style-dictionary/#/) configuration files for all your design tokens coming from Specify.                                                                                                  | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-style-dictionary#usage)          |
| [to-tailwind](https://github.com/Specifyapp/parsers/tree/master/parsers/to-tailwind)                                   | Create a theme compatible with the [TailwindCSS specification](https://tailwindcss.com/docs/theme). The theme is also compatible with [WindiCSS](https://windicss.org/).                                                                     | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-tailwind#usage)                  |
| [to-theme-ui](https://github.com/Specifyapp/parsers/tree/master/parsers/to-theme-ui)                                   | Create a theme compatible with the [theme-ui specification](https://theme-ui.com/theme-spec).                                                                                                                                                | [Example](https://github.com/Specifyapp/parsers/tree/master/parsers/to-theme-ui#usage)                  |

## How to create your own parser?

Let's say you want to create a parser named `my-parser`.

1. Fork the current repository
2. Git clone the forked repository
3. In the directory `parsers`, create a directory named `my-parser`
4. Create your valid parser
5. Make a PR

### Creating a valid parser

To be valid, your parser needs:

- A `README.md` file containing:
  - A description
  - A typed interface with its params ([See the camelcasify one](https://github.com/Specifyapp/parsers/tree/master/parsers/camelcasify#interface))
  - A usage example ([See the camelcasify one](https://github.com/Specifyapp/parsers/tree/master/parsers/camelcasify#usage))
  - The typing of its inputs and outputs ([See the camelcasify one](https://github.com/Specifyapp/parsers/tree/master/parsers/camelcasify#types))
- A `my-parser.spec.ts` file containing your parser's unit tests
- A `my-parser.parser.ts` file

## Usable libraries

For now, our parsers only use the following libraries:

- [tinycolor2](https://github.com/bgrins/TinyColor)
- [lodash](https://github.com/lodash/lodash)
- [svgo](https://github.com/svg/svgo/)

If you need another library to develop your parser:

1. Install it using `yarn` or `npm`
2. Import and export it in the `parsers/global-libs.ts` file

## Testing

To easily create and test your parsers, we advise you to use them on design tokens provided in the `seeds.json` file.
It will allow you to use our fake tokens to test your parsers.

To use our design tokens seed:

1. Import it in your [parser].spec.ts using `import * as seeds from '../../seeds.json';`
2. Use the `seeds.tokens` variable according to your needs.
3. Launch `yarn test` to tests your parsers
