import { Parser, Token } from '../types';

type UnknownParser<F> = { options: unknown; fn: F; name: string };
type ReturnPipe<T> = {
  run: (tokens: Array<Token>) => T;
  build: () => unknown;
};

export function createConfig<A extends unknown[], B>(
  ab: UnknownParser<(...a: A) => B>,
): ReturnPipe<B>;
export function createConfig<A extends unknown[], B, C>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
): ReturnPipe<C>;
export function createConfig<A extends unknown[], B, C, D>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
  cd: UnknownParser<(c: C) => D>,
): ReturnPipe<D>;
export function createConfig<A extends unknown[], B, C, D, E>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
  cd: UnknownParser<(c: C) => D>,
  de: UnknownParser<(d: D) => E>,
): ReturnPipe<E>;

export function createConfig(...parsers: Array<UnknownParser<(...params: unknown[]) => unknown>>): {
  run: (tokens: Array<Token>) => unknown;
  build: () => unknown;
} {
  return {
    build: () =>
      parsers.map(parser => {
        const step: Parser = {
          name: parser.name,
        };
        if (parser.options) {
          step.options = parser.options;
        }
        return step;
      }),
    run: (tokens: Array<Token>): unknown => {
      return parsers.reduce<unknown>(async (value, parser) => parser.fn(await value), tokens);
    },
  };
}
