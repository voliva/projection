import type { Projection } from "./projection";

export function ortogonal(): Projection {
  return {
    fromSpherical({ theta, phi }) {
      if (theta > Math.PI) return { x: NaN, y: NaN };
      return { x: Math.sin(theta), y: Math.sin(phi) };
    },
    toSpherical({ x, y }) {
      const centeredX = (x - 0.5) * 2;
      const centeredY = y * 2;
      if (centeredX * centeredX + centeredY * centeredY > 1) {
        return { phi: NaN, theta: NaN };
      }
      const phi = Math.asin(centeredY);
      const theta =
        Math.atan2(centeredX, Math.sqrt(1 - centeredY * centeredY)) + Math.PI;

      return {
        phi,
        theta,
      };
    },
  };
}
