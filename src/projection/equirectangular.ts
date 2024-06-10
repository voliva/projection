import type { Projection } from "./projection";

export function equiRectangular(yScale = 1.85): Projection {
  return {
    toSpherical({ x, y }) {
      y = y / yScale;
      if (x < -0.5 || x > 0.5) return null;
      if (y < -0.5 || y > 0.5) return null;

      return {
        theta: x * 2 * Math.PI,
        phi: y * Math.PI,
      };
    },
    fromSpherical({ phi, theta }) {
      if (phi <= -Math.PI / 2 || phi >= Math.PI / 2) return null;
      if (theta < -Math.PI || theta > Math.PI) return null;

      return {
        x: theta / (2 * Math.PI),
        y: (phi / Math.PI) * yScale,
      };
    },
  };
}
