import type { Projection } from "./projection";

export function lambert(yScale = 2): Projection {
  return {
    toSpherical({ x, y }) {
      return {
        theta: x * 2 * Math.PI,
        phi: Math.asin(y * yScale),
      };
    },
    fromSpherical({ phi, theta }) {
      return {
        x: theta / (2 * Math.PI),
        y: Math.sin(phi) / yScale,
      };
    },
  };
}
