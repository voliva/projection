import { createProjectionShader } from "./projectionShader";

export const gnomonicProjection = createProjectionShader(
  `
    if (xy.x * xy.x + xy.y * xy.y > 0.25) {
      return BLANK;
    }

    xy.x *= 2. * 2.0;
    xy.y *= 2. * 2.0;
    float p = sqrt(xy.x * xy.x + xy.y * xy.y);
    float c = atan(p);

    return vec2(
      atan((xy.x * sin(c)) / (p * cos(c))),
      asin((xy.y * sin(c)) / p)
    );
`
);
