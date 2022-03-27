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
export function createConfig<A extends unknown[], B, C, D, E, F>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
  cd: UnknownParser<(c: C) => D>,
  de: UnknownParser<(d: D) => E>,
  ef: UnknownParser<(e: E) => F>,
): ReturnPipe<F>;
export function createConfig<A extends unknown[], B, C, D, E, F, G>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
  cd: UnknownParser<(c: C) => D>,
  de: UnknownParser<(d: D) => E>,
  ef: UnknownParser<(e: E) => F>,
  fg: UnknownParser<(f: F) => G>,
): ReturnPipe<G>;
export function createConfig<A extends unknown[], B, C, D, E, F, G, H>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
  cd: UnknownParser<(c: C) => D>,
  de: UnknownParser<(d: D) => E>,
  ef: UnknownParser<(e: E) => F>,
  fg: UnknownParser<(f: F) => G>,
  gh: UnknownParser<(g: G) => H>,
): ReturnPipe<H>;
export function createConfig<A extends unknown[], B, C, D, E, F, G, H, I>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
  cd: UnknownParser<(c: C) => D>,
  de: UnknownParser<(d: D) => E>,
  ef: UnknownParser<(e: E) => F>,
  fg: UnknownParser<(f: F) => G>,
  gh: UnknownParser<(g: G) => H>,
  hi: UnknownParser<(h: H) => I>,
): ReturnPipe<I>;
export function createConfig<A extends unknown[], B, C, D, E, F, G, H, I, J>(
  ab: UnknownParser<(...a: A) => B>,
  bc: UnknownParser<(b: B) => C>,
  cd: UnknownParser<(c: C) => D>,
  de: UnknownParser<(d: D) => E>,
  ef: UnknownParser<(e: E) => F>,
  fg: UnknownParser<(f: F) => G>,
  gh: UnknownParser<(g: G) => H>,
  hi: UnknownParser<(h: H) => I>,
  ij: UnknownParser<(i: I) => J>,
): ReturnPipe<J>;

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
