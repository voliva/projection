import { createProjectionShader } from "./projectionShader";

export const lambertProjection = createProjectionShader(
  `
    return vec2(
        xy.x * 2. * 3.1415,
        asin(xy.y * 2. * 3.1415)
    );
`
);
