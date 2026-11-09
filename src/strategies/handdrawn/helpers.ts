// ./src/strategies/handdrawn/helpers.ts

import { PRNG } from "../../utils/rng";

/**
 * Builds a natural, slightly wobbly cubic bezier stroke across the given coordinates.
 */
export function buildOrganicLinePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughness: number,
  rng: PRNG,
  samples: number = 4,
): string {
  const dx = (x2 - x1) / samples;
  const dy = (y2 - y1) / samples;

  let d = `M ${x1.toFixed(2)},${(y1 + (rng() - 0.5) * roughness).toFixed(2)}`;

  for (let i = 1; i <= samples; i++) {
    const curX = x1 + i * dx;
    const curY = y1 + i * dy + (rng() - 0.5) * roughness * 2;

    const prevX = curX - dx;
    const cp1x = prevX + dx * 0.35;
    const cp1y = y1 + (i - 1) * dy + (rng() - 0.5) * roughness * 1.5;
    const cp2x = prevX + dx * 0.65;
    const cp2y = curY + (rng() - 0.5) * roughness * 1.5;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${curX.toFixed(2)},${curY.toFixed(2)}`;
  }

  return d;
}

