import type { Projection } from "./projection";

export function equiRectangular(yScale = 1.84): Projection {
  return {
    toSpherical({ x, y }) {
      return {
        theta: x * 2 * Math.PI,
        phi: y * (Math.PI / 2) * yScale,
      };
    },
    fromSpherical({ phi, theta }) {
      return {
        x: theta / (2 * Math.PI),
        y: phi / (Math.PI / 2) / yScale,
      };
    },
  };
}
