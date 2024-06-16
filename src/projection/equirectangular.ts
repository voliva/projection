import { createProjectionShader } from "./projectionShader";

export const equiRectangular = createProjectionShader(
  `
    xy.y = xy.y / 2.14;

    return vec2(
        xy.x * 2. * 3.1415,
        xy.y * 2. * 3.1415
    );
`
);
