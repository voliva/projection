import { type Projection } from "./projection";

// https://en.wikipedia.org/wiki/Orthographic_map_projection
export function ortogonal(): Projection {
  return {
    fromSpherical(spherical) {
      const x = Math.cos(spherical.phi) * Math.sin(spherical.theta);
      const y = Math.sin(spherical.phi);

      return { x: x / 2, y: y / 2 };
    },
    toSpherical({ x, y }) {
      x = x * 2;
      y = y * 2;
      const p = Math.sqrt(x * x + y * y);
      const c = Math.asin(p);

      const phi = Math.asin((y * Math.sin(c)) / p);
      const theta = Math.atan((x * Math.sin(c)) / (p * Math.cos(c)));

      if (Number.isNaN(phi) || Number.isNaN(theta)) return null;

      return { phi, theta };
    },
  };
}
