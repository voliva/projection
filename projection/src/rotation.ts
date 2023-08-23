import { add, identity, multiply, square, Matrix } from "mathjs";
import type { Spherical } from "./projection";

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
  { phi, theta }: Spherical
): Spherical {
  const original_vec = [
    [Math.cos(theta) * Math.cos(phi)],
    [Math.sin(phi)],
    [Math.sin(theta) * Math.cos(phi)],
  ];
  const rotated_vec = multiply(rotationMatrix, original_vec) as Matrix;

  const resultPhi = Math.asin(rotated_vec.get([1, 0]));
  const resultTheta = Math.atan2(
    rotated_vec.get([2, 0]),
    rotated_vec.get([0, 0])
  );

  return { phi: resultPhi, theta: resultTheta };
}
