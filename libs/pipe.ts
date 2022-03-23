type UnknownFunction = (...params: unknown[]) => unknown;

// Copied from https://github.com/gcanti/fp-ts/blob/1.15.0/src/function.ts#L209 with some
// modifications to make the first function allow multiple parameters.
export function pipe<A extends unknown[], B>(ab: (this: void, ...a: A) => B): (...args: A) => B;
export function pipe<A extends unknown[], B, C>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
): (...args: A) => C;
export function pipe<A extends unknown[], B, C, D>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
  cd: (this: void, c: C) => D,
): (...args: A) => D;
export function pipe<A extends unknown[], B, C, D, E>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
  cd: (this: void, c: C) => D,
  de: (this: void, d: D) => E,
): (...args: A) => E;
export function pipe<A extends unknown[], B, C, D, E, F>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
  cd: (this: void, c: C) => D,
  de: (this: void, d: D) => E,
  ef: (this: void, e: E) => F,
): (...args: A) => F;
export function pipe<A extends unknown[], B, C, D, E, F, G>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
  cd: (this: void, c: C) => D,
  de: (this: void, d: D) => E,
  ef: (this: void, e: E) => F,
  fg: (this: void, f: F) => G,
): (...args: A) => G;
export function pipe<A extends unknown[], B, C, D, E, F, G, H>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
  cd: (this: void, c: C) => D,
  de: (this: void, d: D) => E,
  ef: (this: void, e: E) => F,
  fg: (this: void, f: F) => G,
  gh: (this: void, g: G) => H,
): (...args: A) => H;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
  cd: (this: void, c: C) => D,
  de: (this: void, d: D) => E,
  ef: (this: void, e: E) => F,
  fg: (this: void, f: F) => G,
  gh: (this: void, g: G) => H,
  hi: (this: void, h: H) => I,
): (...args: A) => I;
export function pipe<A extends unknown[], B, C, D, E, F, G, H, I, J>(
  ab: (this: void, ...a: A) => B,
  bc: (this: void, b: B) => C,
  cd: (this: void, c: C) => D,
  de: (this: void, d: D) => E,
  ef: (this: void, e: E) => F,
  fg: (this: void, f: F) => G,
  gh: (this: void, g: G) => H,
  hi: (this: void, h: H) => I,
  ij: (this: void, i: I) => J,
): (...args: A) => J;

export function pipe(...fns: UnknownFunction[]): UnknownFunction {
  return (...initialParams: unknown[]): unknown =>
    fns.reduce<unknown>((value, fn, index) => {
      const params = index === 0 ? (value as unknown[]) : [value];
      return fn(...params);
    }, initialParams);
}
