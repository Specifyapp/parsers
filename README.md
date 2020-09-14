# Specify parsers

Specify is a design data platform. It allows you to centralize the management of your design tokens and assets and automate your workflow. 

By using Specify's platform, you can keep all your design decisions up to date across all your projects.

## What are the parsers?

Parsers are functions that allows you to modify the data you are getting from Specify's API.

Parsers are ordered and takes specific input to specific output. This way, we can easily test the input coming from the previous parser to check if the whole parsers process wull work.

Using parsers, you dictate the way you receive the data from Specify to fit your own needs.

## Creating your own parser

- Git clone this repo
- In the directory `parsers`, create a directory with your parser's name
- Create your valid parser
- Make a PR

### Creating a valid parser

To be valid, a parser needs
- a README.md file which contains
  - A description of the parser
  - The typed interface of the parser with the params
  - An exemple of the usage
  - The typing of the inputs and outputs.
- a [parser].spec.ts files containing the tests of your parser
- a [parser].parser.ts file

## Usables libraries

For now, we only use [tinycolor2](https://github.com/bgrins/TinyColor) and [lodash](https://github.com/lodash/lodash) as libraries in our parsers.

If you need another library to develop your parser, install it using yarn or npm then import and export it in the `parsers/global-libs.ts` file.

## Testing

You can easily create and test your parsers by using our seeders. You can find them in the `seeds.json` file. 

The main seeds you want to use are token seeds.
It will allow you to use fake tokens to test your parsers.

To use it, you just have to import it in you [parser].spec.ts using `import * as seeds from '../../seeds.json';` then using `seeds.tokens`.

To tests your parsers and every other, launch using `yarn test`.
