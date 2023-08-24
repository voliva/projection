import { describe, expect, test } from "vitest";
import { cartesianToSpherical, sphericalToCartesian } from "./projection";

test("spherical <=> cartesian", () => {
  const assertTransform = ([theta, phi]: number[], [x, y, z]: number[]) => {
    const cartesian = sphericalToCartesian({ theta, phi });
    expect(Math.abs(cartesian.x - x)).toBeLessThanOrEqual(Number.EPSILON);
    expect(Math.abs(cartesian.y - y)).toBeLessThanOrEqual(Number.EPSILON);
    expect(Math.abs(cartesian.z - z)).toBeLessThanOrEqual(Number.EPSILON);

    const spherical = cartesianToSpherical({ x, y, z });
    expect(Math.abs(spherical.theta - theta)).toBeLessThanOrEqual(
      Number.EPSILON
    );
    expect(Math.abs(spherical.phi - phi)).toBeLessThanOrEqual(Number.EPSILON);
  };

  assertTransform([0, 0], [0, 0, 1]);
  assertTransform([0, Math.PI / 2], [0, 1, 0]);
});
