import type { Cartesian } from ".";

export function normalize(
  { x, y }: Cartesian,
  width: number,
  height: number
): Cartesian {
  return {
    x: x / width,
    y: (height / 2 - y) / width,
  };
}

export function denormalize(
  { x, y }: Cartesian,
  width: number,
  height: number
): Cartesian {
  let xr = Math.floor(x * width);
  let yr = Math.round(height / 2 - y * width);
  return {
    x: Math.min(width - 1, xr),
    y: Math.max(0, Math.min(height - 1, yr)),
  };
}
