// ./src/utils/rng.ts

export type PRNG = () => number;

/**
 * Creates a seeded pseudo-random number generator using the Mulberry32 algorithm.
 * Guarantees deterministic, reproducible results across renders when a seed is provided.
 */
export function createRng(seed?: number): PRNG {
  if (seed === undefined) {
    return Math.random;
  }

  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

