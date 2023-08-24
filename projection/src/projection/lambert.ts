import type { Projection } from "./projection";

export function lambert(): Projection {
  return {
    toSpherical({ x, y }) {
      if (y > 1 || y < -1) return null;

      return {
        theta: x * 2 * Math.PI,
        phi: Math.asin(y),
      };
    },
    fromSpherical({ phi, theta }) {
      return {
        x: theta / (2 * Math.PI),
        y: Math.sin(phi),
      };
    },
  };
}
