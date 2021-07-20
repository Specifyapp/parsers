import { has, get } from 'lodash';

export default function listPathsByPattern<T extends object>(
  base: T | Array<T>,
  pattern: string,
): Array<string> {
  try {
    if (!pattern.includes('[*]')) return has(base, pattern) ? [pattern] : [];
    return pattern
      .split(/(?=\[\*])|(?<=\[\*])/g) // split without remove the delimiter
      .reduce<Array<string>>(
        (paths, item) => {
          if (item === '[*]') {
            return paths
              .map(basePath => {
                const iteration = basePath ? get(base, basePath) : base;
                if (!Array.isArray(iteration)) return [];
                return Array(iteration.length)
                  .fill(0)
                  .reduce(
                    (acc, _, index) =>
                      has(base, `${basePath}[${index}]`) ? [...acc, `${basePath}[${index}]`] : acc,
                    [],
                  );
              })
              .flat(2);
          } else {
            return paths.reduce<Array<string>>(
              (acc, elm) => (has(base, `${elm}${item}`) ? [...acc, `${elm}${item}`] : acc),
              [],
            );
          }
        },
        [''],
      );
  } catch (err) {
    throw err;
  }
}
