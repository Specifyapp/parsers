const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const GenerateSpecifyParserPlugin = require('./GenerateSpecifyParserPlugin.js');
const typescriptIsTransformer = require('typescript-is/lib/transform-inline/transformer').default;
const getTypeExpectationTransformer = require('@specifyapp/get-expectation/dist/transform').default;
const entry = glob.sync('./parsers/**/*.parser.ts').reduce((entry, file) => {
  const parserName = file.split('/')[2].split('.')[0];
  entry[parserName] = file;
  return entry;
}, {});
module.exports = {
  mode: 'production',
  entry,
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname, 'parsers'),
          path.resolve(__dirname, 'node_modules/@specifyapp/types/dist'),
        ],
        exclude: [/node_modules/, /(.*?).spec.ts/],
        options: {
          compiler: 'ttypescript',
          allowTsInNodeModules: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  plugins: [new CleanWebpackPlugin(), new GenerateSpecifyParserPlugin()],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'parser',
    libraryExport: 'default',
  },
};
