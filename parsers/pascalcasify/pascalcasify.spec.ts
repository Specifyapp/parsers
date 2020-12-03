import pascalcasify from './pascalcasify.parser';
import { Token } from '../../types';
import libs from '../global-libs';

describe('Pascalcasify', () => {
  // Prevent seeds mutation
  let seeds: { tokens: Array<Token> };
  beforeEach(() => {
    return import('../../seeds.json').then(module => {
      seeds = module;
      jest.resetModules();
    });
  });
  it('Get tokens - apply parsers', async done => {
    const result = await pascalcasify(seeds.tokens as Array<Token>, { keys: ['name'] }, libs);
    if (result instanceof Error) return done.fail(result);
    result.forEach(token => {
      expect(token.name?.includes(' ')).toEqual(false);
    });
    done();
  });
  it('Get tokens - apply parsers with excludeFileExtension option', async done => {
    const result = await pascalcasify(seeds.tokens.filter((el: Token) => el.name.includes('.')) as Array<Token>, { keys: ['name'], excludeFileExtension: true }, libs);
    if (result instanceof Error) return done.fail(result);
    expect(result.length > 0).toEqual(true);
    result.forEach(token => expect(token.name?.includes(' ')).toEqual(false));
    result.forEach(token => expect(token.name?.includes('.')).toEqual(true));
    done();
  });
});
