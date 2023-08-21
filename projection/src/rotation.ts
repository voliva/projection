import { add, identity, multiply, square, Matrix } from "mathjs";
import type { Spherical } from "./projection";

const kVec = [0, 0, 1];

const kMatrix = [
  [0, -kVec[2], kVec[1]],
  [kVec[2], 0, -kVec[0]],
  [-kVec[1], kVec[0], 0],
];

const angle = Math.PI / 2.0;

const rotationMatrix = add(
  identity(3),
  add(
    multiply(kMatrix, Math.sin(angle)),
    multiply(multiply(kMatrix, kMatrix), 1 - Math.cos(angle))
  )
);

export function rotate({ phi, theta }: Spherical): Spherical {
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
