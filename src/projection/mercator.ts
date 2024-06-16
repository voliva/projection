import { createProjectionShader } from "./projectionShader";

export const mercatorProjection = createProjectionShader(
  `
    float phi = atan(sinh(xy.y * 6.));

    return vec2(
        xy.x * 2.0 * 3.1415,
        phi
    );
`
);
