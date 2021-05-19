import util from 'util';
import sass from 'node-sass';

const sassRender = util.promisify(sass.render);

export const render = (options: sass.Options) =>
  sassRender({
    outputStyle: 'compact',
    ...options,
  });
