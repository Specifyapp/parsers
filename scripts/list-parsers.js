const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../', 'parsers');
let parsers = [];
const fileNames = fs.readdirSync(directoryPath);

const directories = fileNames.filter(fileName => !fileName.includes('.ts'));

parsers = directories.map(directory => {
  const readmeParserPath = path.join(__dirname, '../', 'parsers', directory, 'README.md');
  const parserContent = fs.readFileSync(readmeParserPath, { encoding: 'utf8', flag: 'r' });

  const parserDescription = parserContent.match(/This parser helps you (.*)/)[1];
  const capitalizedParserDescription =
    parserDescription.charAt(0).toUpperCase() + parserDescription.slice(1);
  const exampleLink = `https://github.com/Specifyapp/parsers/blob/master/parsers/${directory}/README.md#usage`;
  const parserLink = `https://github.com/Specifyapp/parsers/blob/master/parsers/${directory}`;

  return {
    title: directory,
    description: capitalizedParserDescription,
    parserLink,
    exampleLink,
  };
});

const markdownFullPage = `---
description: >-
  Parsers are functions allowing you to transform design tokens and assets
  coming from Specify to fit your needs and company standards.
---

# Parsers

## Why you need parsers

<figure><img src="../front/documentation/.gitbook/assets/where-parsers-happen-dark.jpg" alt=""><figcaption><p>Parsers help you transform raw design tokens and assets returned by Specify to match your company standards</p></figcaption></figure>

By default, without any parsers, Specify will return your design data as raw data:

* Design tokens are returned in JSON
* Assets are returned as files

There are high chances you need to transform those design data to fit your needs. Parsers help you do just that.

## What are parsers?

Parsers are functions allowing you to transform design tokens and assets coming from Specify to fit your needs and company standards.

<figure><img src="../front/documentation/.gitbook/assets/how-parsers-work.jpg" alt=""><figcaption><p>An example output pipeline that pulls colors from Specify, sorts them alphabetically and transforms them as CSS Custom Properties</p></figcaption></figure>

A parser does the following job:

1. Receives design data as input
2. Transforms this design data
3. Returns the transformed data

The data returned by a parser can either be:

* Design data that can be used by another parser coming next in your transformation pipeline
* A file so it can be used by people, frameworks, or scripts

{% hint style="info" %}
Parsers are what make Specify powerful and flexible. They help you be in total control of the design data you pull from Specify.
{% endhint %}

Parsers are ordered and takes specific input to generate specific output. This way, we can easily test the input coming from the previous parser to check if the whole parsers process will work.

## Categories

Parsers are classified in 2 categories: technology and utility.

### Technology

Technology parsers help you transform your design tokens to specific technologies and formats (CSS Custom properties, SCSS, Tailwind, a Javascript theme object compatible with React Native...)

Some examples:

* [to-react-native](https://github.com/Specifyapp/parsers/tree/master/parsers/to-react-native)
* [to-css-custom-properties](https://github.com/Specifyapp/parsers/tree/master/parsers/to-css-custom-properties)
* [to-scss-variables](https://github.com/Specifyapp/parsers/tree/master/parsers/to-scss-variables)
* [to-tailwind](https://github.com/Specifyapp/parsers/tree/master/parsers/to-tailwind)

### Utility

Utility parsers take care of "smaller" transformation. Like converting a pixel value to \`rem\` or transforming a string to kebabcase.

Some examples:

* [convert-font](https://github.com/Specifyapp/parsers/tree/master/parsers/convert-font)
* [kebabcasify](https://github.com/Specifyapp/parsers/tree/master/parsers/kebabcasify)
* [px-to-rem](https://github.com/Specifyapp/parsers/tree/master/parsers/px-to-rem)

## All parsers available

All parsers are open source and available on [the following GitHub repository](https://github.com/Specifyapp/parsers).

`;

const markdownHeader = `| Parser | Description | Usage Example |
|---|---|---|`;

const parsersMarkdown = parsers.reduce((acc, currentParser) => {
  const { title, description, exampleLink, parserLink } = currentParser;
  if (!acc) {
    return `${markdownHeader}
| [${title}](${parserLink}) | ${description} | [Example](${exampleLink}) |`;
  }
  return `${acc}
| [${title}](${parserLink}) | ${description} | [Example](${exampleLink}) |`;
}, '');

const summaryFilePath = path.join(__dirname, '../output/', 'parsers.md');
fs.writeFileSync(summaryFilePath, markdownFullPage + parsersMarkdown, {
  encoding: 'utf8',
  flag: 'w',
});
