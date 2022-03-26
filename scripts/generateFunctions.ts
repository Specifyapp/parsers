import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
import { camelCase } from 'lodash';

const file = fs
  .readdirSync(path.resolve(__dirname, '../parsers'))
  .filter(filename => !filename.includes('.'))
  .reduce<Array<string>>((acc, folder) => {
    const params = {
      parserName: folder,
      parserNameInCamelcase: camelCase(folder),
      optionsType: camelCase(`${folder}OptionsType`),
      inputType: camelCase(`${folder}InputDataType`),
    };
    const importString = Mustache.render(
      `import { {{parserNameInCamelcase}} as {{parserNameInCamelcase}}Parser, OptionsType as {{optionsType}}, InputDataType as {{inputType}}} from '../parsers/{{parserName}}/{{parserName}}.parser';`,
      params,
    );

    const fn = Mustache.render(
      `export const {{parserNameInCamelcase}} = (options: IsOptional<{{optionsType}}>) => ({name: '{{parserName}}', options, fn: <I extends {{inputType}}>(data: I) => {{parserNameInCamelcase}}Parser(data, options as ExcludeVoid<{{optionsType}}>)});`,
      params,
    );

    acc.unshift(importString);
    acc.push(fn);
    return acc;
  }, []);

file.splice(
  file.length / 2,
  0,
  '\ntype IsOptional<Opt> = Opt extends undefined ? Opt | void : Opt\ntype ExcludeVoid<T> =  Exclude<T, void>\n\n// Parsers Function',
);
fs.writeFileSync(path.resolve(__dirname, './parsersPipeable.ts'), file.join('\n'));
