import { has, get } from 'lodash';

export default function listPathsByPattern<T extends object>(
  base: T | Array<T>,
  pattern: string,
): Array<string> {
  try {
    if (!pattern.includes('[*]')) return has(base, pattern) ? [pattern] : [];
    return pattern
      .split('[*]')
      .flatMap(elm => [elm, '[*]'])
      .slice(0, -1)
      .reduce(
        (paths, item) => {
          if (item === '[*]') {
            return paths
              .map(basePath => {
                if (basePath !== '' && !has(base, basePath)) return paths;
                const iteration = Array.isArray(base) ? base : get(base, basePath);
                if (!iteration?.length) return paths;
                return Array(iteration.length)
                  .fill(0)
                  .reduce(
                    (acc, _, index) => {
                      if (has(base, `${basePath}[${index}]`)) acc.push(`${basePath}[${index}]`);
                      return acc;
                    },
                    [''],
                  );
              })
              .flat(2);
          } else {
            return paths.reduce<Array<string>>(
              (acc, elm) => {
                if (has(base, `${elm}${item}`)) acc.push(`${elm}${item}`);
                return acc;
              },
              [''],
            );
          }
        },
        [''],
      )
      .slice(1);
  } catch (err) {
    throw err;
  }
}
