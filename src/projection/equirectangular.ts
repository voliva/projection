import { createProjectionShader } from "./projectionShader";

export const equiRectangular = createProjectionShader(
  `
    if (abs(xy.y) > 0.25) {
      return vec2(NaN, NaN);
    }

    return vec2(
        xy.x * 2. * 3.1415,
        xy.y * 2. * 3.1415
    );
`
);
