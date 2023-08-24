import type { Projection } from "./projection";

// https://speleotrove.com/pangazer/gnomonic_projection.html
export function gnomonic(scale = 2, yScale = 0.33): Projection {
  return {
    toSpherical({ x, y }) {
      x *= 2 * scale;
      y *= 2 * yScale * scale;
      const p = Math.sqrt(x * x + y * y);
      const c = Math.atan(p);

      return {
        theta: Math.atan((x * Math.sin(c)) / (p * Math.cos(c))),
        phi: Math.asin((y * Math.sin(c)) / p),
      };
    },
    fromSpherical({ phi, theta }) {
      throw new Error("Not implemented yet");
    },
  };
}
