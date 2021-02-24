[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Specifyapp/parsers/CI)
[![Coverage Status](https://coveralls.io/repos/github/Specifyapp/parsers/badge.svg?branch=master)](https://coveralls.io/github/Specifyapp/parsers?branch=master) 
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Specifyapp/parsers.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Specifyapp/parsers/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/Specifyapp/parsers.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Specifyapp/parsers/alerts/)
<!-- [![CI Actions Status](https://github.com/Specifyapp/parsers/workflows/CI/badge.svg)](https://github.com/Specifyapp/parsers/actions) -->





# Specify Parsers

## What is Specify?
Specify helps you unify your brand identity by collecting, storing and distributing design tokens and assets—automatically. 

## What are parsers?

Parsers are functions allowing you to transform design tokens and assets you get from Specify's API.

Parsers are ordered and takes specific input to generate specific output. This way, we can easily test the input coming from the previous parser to check if the whole parsers process will work.

By using parsers, you dictate the way you receive the data from Specify to fit your own needs.

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
