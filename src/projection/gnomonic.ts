import { createProjectionShader } from "./projectionShader";

export const gnomonicProjection = createProjectionShader(
  `
    xy.x *= 2. * 2.0;
    xy.y *= 2. * 1.0 * 2.0;
    float p = sqrt(xy.x * xy.x + xy.y * xy.y);
    float c = atan(p);

    return vec2(
      atan((xy.x * sin(c)) / (p * cos(c))),
      asin((xy.y * sin(c)) / p)
    );
`
);
