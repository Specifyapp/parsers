import sass from 'sass';

export const render = (source: Parameters<typeof sass.compileString>[0]) => {
  return sass.compileString(source, { style: 'compressed' });
};
