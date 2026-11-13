import { PRNG } from '../../utils/rng';
/**
 * Builds a natural, slightly wobbly cubic bezier stroke across the given coordinates.
 */
export declare function buildOrganicLinePath(x1: number, y1: number, x2: number, y2: number, roughness: number, rng: PRNG, samples?: number): string;
