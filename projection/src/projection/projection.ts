/**
 * -0.5    x     0.5
 * ----------------- -0.5
 * |               |
 * |               |  y
 * |               |
 * ----------------- -0.5
 * This is the cylinder unraveled that has:
 * - height = diameter of the sphere
 * - width = perimeter of the equator
 * normalized to 1
 * `y` can overflow, e.g. on mercator projection.
 *
 * x = 0 represents Greenwich meridian
 * y = 0 represents equator
 */
export interface Cartesian2D {
  x: number;
  y: number;
}

/**
 * phi: [-𝜋/2,𝜋/2]: vertical angle. positive = north, negative = south
 * theta: [-𝜋,𝜋]: horizontal angle. positive = east, negative = west
 *
 * phi = 0 represents equator
 * theta = 0 represents Greenwich meridian
 */
export interface Spherical {
  phi: number;
  theta: number;
}

export interface Projection {
  toSpherical(cartesian: Cartesian2D): Spherical | null;
  fromSpherical(spherical: Spherical): Cartesian2D | null;
}

/**
 *    y
 *    |__x
 *   /
 *  z
 * Radius always 1
 */
export interface Cartesian3D {
  x: number;
  y: number;
  z: number;
}

export function sphericalToCartesian({ theta, phi }: Spherical): Cartesian3D {
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(phi),
    z: Math.cos(theta) * Math.cos(phi),
  };
}

export function cartesianToSpherical({ x, y, z }: Cartesian3D): Spherical {
  return {
    phi: Math.asin(y),
    theta: Math.atan2(x, z),
  };
}
