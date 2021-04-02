import * as _ from 'lodash';

export default function listPathsByPattern(obj: object, pattern: string): Array<string> {
  if (!pattern.includes('[*]')) return [pattern];
  return pattern
    .split('[*]')
    .flatMap((elm, index) => [elm, '[*]'])
    .slice(0, -1)
    .reduce(
      (paths, item) => {
        if (item === '[*]') {
          paths = paths
            .map(basePath =>
              Array((_.get(obj, basePath) as Array<string>).length)
                .fill(0)
                .map((_, index) => `${basePath}[${index}]`),
            )
            .flat(2);
        } else {
          paths = paths.map(elm => `${elm}${item}`);
        }
        return paths;
      },
      [''],
    );
}
