import type { Projection } from "./projection";

export function mercator(yScale = 5.8): Projection {
  return {
    toSpherical({ x, y }) {
      return {
        theta: x * 2 * Math.PI,
        phi: Math.atan(Math.sinh(y * yScale)),
      };
    },
    fromSpherical({ phi, theta }) {
      const sec = 1 / Math.cos(phi);
      const y = Math.log(sec + Math.tan(phi));

      return {
        x: theta / (2 * Math.PI),
        y: Math.max(-10, Math.min(10, y)) / yScale,
      };
    },
  };
}
