import type { Projection } from "./projection";

export function gnomonic(yScale = 5): Projection {
  return {
    toSpherical({ x, y }) {
      return {
        theta: x * 2 * Math.PI,
        phi: Math.atan(y * yScale),
      };
    },
    fromSpherical({ phi, theta }) {
      return {
        x: theta / (2 * Math.PI),
        y: Math.tan(phi) / yScale,
      };
    },
  };
}
