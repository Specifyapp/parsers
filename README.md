[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Specifyapp/parsers/CI)
[![Coverage Status](https://coveralls.io/repos/github/Specifyapp/parsers/badge.svg?branch=master)](https://coveralls.io/github/Specifyapp/parsers?branch=master) 
<!-- [![CI Actions Status](https://github.com/Specifyapp/parsers/workflows/CI/badge.svg)](https://github.com/Specifyapp/parsers/actions) -->





# Specify parsers

Specify is a design data platform. It allows you to centralize the management of your design tokens and assets and automate your workflow. 

By using Specify's platform, you can keep all your design decisions up to date across all your projects.

## What are parsers?

Parsers are functions that allow you to modify the data you are getting from Specify's API.

Parsers are ordered and takes specific input to generate specific output. This way, we can easily test the input coming from the previous parser to check if the whole parsers process will work.

By using parsers, you dictate the way you receive the data from Specify to fit your own needs.

## Creating your own parser

1. Git clone this repo
2. In the directory `parsers`, create a directory with your parser's name
3. Create your valid parser
4. Make a PR

### Creating a valid parser

To be valid, a parser needs:
- A `README.md` file which contains:
  - A description
  - A typed interface with its params
  - An example of use
  - The typing of its inputs and outputs.
- A [parser].spec.ts file containing your parser's unit tests
- A [parser].parser.ts file

## Usables libraries

For now, our parsers only use the following libraries:
- [tinycolor2](https://github.com/bgrins/TinyColor)
- [lodash](https://github.com/lodash/lodash)

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
