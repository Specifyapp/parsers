const fs = require('fs');
const path = require('path');

module.exports = class GenerateSpecifyParserPlugin {
  apply(compiler) {
    // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well
    compiler.hooks.afterCompile.tap('GenerateSpecifyParserPlugin', compilation => {
      const obj = {};
      for (let filename in compilation.assets) {
        // obj[filename.split('.')[0]] = compilation.assets[filename]
        //   .source()
        //   .replace(/var [A-z]+( )?=/, '')
        //   .slice(0, -1);
        const updatedAsset = compilation.assets[filename]
          .source()
          .replace(/var [A-z]+( )?=/, '')
          .slice(0, -1);
        obj[filename.split('.')[0]] = `get('${filename}')`;
        compilation.assets[filename] = {
          source: function() {
            return updatedAsset;
          },
          size: function() {
            return updatedAsset.length;
          },
        };
      }

      // const indexFile = `module.exports = ${JSON.stringify(obj)}`;
      const indexFile = `const fs = require('fs');
const path = require('path');
function get(name) {
  return fs.readFileSync(path.resolve(__dirname, name), {
    encoding: 'utf8',
  });
}
module.exports = {
  ${Object.keys(obj)
    .map(fileName => `${JSON.stringify(fileName)}: ${obj[fileName]}`)
    .join(',\n  ')}
}
      `;
      compilation.assets['index.js'] = {
        source: function() {
          return indexFile;
        },
        size: function() {
          return indexFile.length;
        },
      };
    });
  }
};
