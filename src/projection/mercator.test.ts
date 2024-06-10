import { describe, expect, it } from "vitest";
import { mercator } from "./mercator";

describe("default mercator", () => {
  const projection = mercator();
  const borderTheta = 0.48038107913372946;

  it("converts to spherical", () => {
    const assertToSpherical = (
      [x, y]: [number, number],
      [phi, theta]: [number, number]
    ) => {
      expect(projection.toSpherical({ x, y })).toEqual({
        phi,
        theta,
      });
    };

    assertToSpherical([-0.5, -0.5], [-borderTheta, -Math.PI]);
    assertToSpherical([-0.5, 0], [0, -Math.PI]);
    assertToSpherical([-0.5, 0.5], [borderTheta, -Math.PI]);
    assertToSpherical([0, -0.5], [-borderTheta, 0]);
    assertToSpherical([0, 0], [0, 0]);
    assertToSpherical([0, 0.5], [borderTheta, 0]);
    assertToSpherical([0.5, -0.5], [-borderTheta, Math.PI]);
    assertToSpherical([0.5, 0], [0, Math.PI]);
    assertToSpherical([0.5, 0.5], [borderTheta, Math.PI]);
  });

  it("converts to cartesian", () => {
    const assertFromSpherical = (
      [phi, theta]: [number, number],
      [x, y]: [number, number]
    ) => {
      const result = projection.fromSpherical({ phi, theta })!;
      expect(
        Math.abs(result.x - x),
        `Expected ${x}, got ${result.x}`
      ).toBeLessThanOrEqual(Number.EPSILON);
      expect(
        Math.abs(result.y - y),
        `Expected ${y}, got ${result.y}`
      ).toBeLessThanOrEqual(Number.EPSILON);
    };

    assertFromSpherical([0, 0], [0, 0]);
    assertFromSpherical([-borderTheta, -Math.PI], [-0.5, -0.5]);
    assertFromSpherical([0, -Math.PI], [-0.5, 0]);
    assertFromSpherical([borderTheta, -Math.PI], [-0.5, 0.5]);
    assertFromSpherical([-borderTheta, 0], [0, -0.5]);
    assertFromSpherical([0, 0], [0, 0]);
    assertFromSpherical([borderTheta, 0], [0, 0.5]);
    assertFromSpherical([-borderTheta, Math.PI], [0.5, -0.5]);
    assertFromSpherical([0, Math.PI], [0.5, 0]);
    assertFromSpherical([borderTheta, Math.PI], [0.5, 0.5]);

    // It can overshoot
    assertFromSpherical([(85 * Math.PI) / 180, 0], [0, 3.1313013314716454]);
    assertFromSpherical([(-85 * Math.PI) / 180, 0], [0, -3.1313013314716622]);
  });

  it("inverts correctly", () => {
    const assertToSpherical = ([x, y]: [number, number]) => {
      const spherical = projection.toSpherical({ x, y })!;
      const result = projection.fromSpherical(spherical)!;
      expect(
        Math.abs(result.x - x),
        `Expected ${x}, got ${result.x}`
      ).toBeLessThanOrEqual(Number.EPSILON);
      expect(
        Math.abs(result.y - y),
        `Expected ${y}, got ${result.y}`
      ).toBeLessThanOrEqual(Number.EPSILON);
    };

    assertToSpherical([0.25, 0.25]);
    assertToSpherical([-0.466, 1.507]);
  });
});
