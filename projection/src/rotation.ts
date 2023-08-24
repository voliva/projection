import { add, identity, multiply, square, Matrix } from "mathjs";
import {
  sphericalToCartesian,
  type Spherical,
  cartesianToSpherical,
} from "./projection";

export const axis = {
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
};

export function createRotation(axis: number[], angle: number) {
  const kMatrix = [
    [0, -axis[2], axis[1]],
    [axis[2], 0, -axis[0]],
    [-axis[1], axis[0], 0],
  ];

  return add(
    identity(3),
    add(
      multiply(kMatrix, Math.sin(angle)),
      multiply(multiply(kMatrix, kMatrix), 1 - Math.cos(angle))
    )
  ) as Matrix;
}

export function rotate(
  rotationMatrix: Matrix,
  spherical: Spherical
): Spherical {
  const { x, y, z } = sphericalToCartesian(spherical);
  const original_vec = [[x], [y], [z]];
  const rotated_vec = multiply(rotationMatrix, original_vec) as Matrix;

  return cartesianToSpherical({
    x: rotated_vec.get([0, 0]),
    y: rotated_vec.get([1, 0]),
    z: rotated_vec.get([2, 0]),
  });
}
