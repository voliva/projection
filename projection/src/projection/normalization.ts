import type { Cartesian2D } from ".";

export function normalize(
  { x, y }: Cartesian2D,
  width: number,
  height: number
): Cartesian2D {
  const perimeter = width;
  const diameter = perimeter / Math.PI;

  return {
    x: (x - width / 2) / width,
    y: (height / 2 - y) / diameter,
  };
}

export function denormalize(
  { x, y }: Cartesian2D,
  width: number,
  height: number
): Cartesian2D {
  let xr = Math.round(width / 2 + x * width);

  const perimeter = width;
  const diameter = perimeter / Math.PI;
  let yr = Math.round(height / 2 - y * diameter);

  return {
    x: Math.max(0, Math.min(width - 1, xr)),
    y: Math.max(0, Math.min(height - 1, yr)),
  };
}
