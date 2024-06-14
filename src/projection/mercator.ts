import type { Projection } from "./projection";

// 1.85 gives a scale that resembles the origin image from wikipedia
export function mercator(yScale = 1.85): Projection {
  return {
    toSpherical({ x, y }) {
      if (x < -0.5 || x > 0.5) return null;

      const phi = Math.atan(Math.sinh(y * yScale));

      return {
        theta: x * 2 * Math.PI,
        phi,
      };
    },
    fromSpherical({ phi, theta }) {
      if (phi <= -Math.PI / 2 || phi >= Math.PI / 2) return null;
      if (theta < -Math.PI || theta > Math.PI) return null;

      const sec = 1 / Math.cos(phi);
      const y = Math.log(sec + Math.tan(phi)) / yScale;

      return {
        x: theta / (2 * Math.PI),
        y: Math.max(-50, Math.min(50, y)),
      };
    },
  };
}
