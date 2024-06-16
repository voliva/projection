import { createProjectionShader } from "./projectionShader";

export const ortographicProjection = createProjectionShader(
  `
    xy.x = xy.x * 2.;
    xy.y = (xy.y * 2.) / 1.0;
    float p = sqrt(xy.x * xy.x + xy.y * xy.y);
    float c = asin(p);

    float phi = asin((xy.y * sin(c)) / p);
    float theta = atan((xy.x * sin(c)) / (p * cos(c)));

    return vec2(theta, phi);
`
);
