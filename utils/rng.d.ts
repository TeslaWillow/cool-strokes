export type PRNG = () => number;
/**
 * Creates a seeded pseudo-random number generator using the Mulberry32 algorithm.
 * Guarantees deterministic, reproducible results across renders when a seed is provided.
 */
export declare function createRng(seed?: number): PRNG;
