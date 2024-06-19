import { createProjectionShader } from "./projectionShader";

// https://mathworld.wolfram.com/LambertConformalConicProjection.html
export const lambertConicProjection = createProjectionShader(
  `
    float x = xy.x * 11.,
      y = xy.y * 11.;

    // Fixed common values
    float phi_1 = 33. * PI / 180.;  // Standard parallel 1
    float phi_2 = 45. * PI / 180.;  // Standard parallel 2

    // Calculate n, F, and rho_0
    float n = (log(cos(phi_1) / cos(phi_2)) /
         log(tan(PI / 4. + phi_2 / 2.) / tan(PI / 4. + phi_1 / 2.)));
    
    float F = (cos(phi_1) * pow(tan(PI / 4. + phi_1 / 2.), n)) / n;
    
    float rho_0 = F / (pow(tan(PI / 4.), n));

    // Calculate rho
    float rho = sqrt(pow(x,2.) + pow(rho_0 - y,2.));
    if (n < 0.) {
      rho = rho * -1.;
    }

    // Calculate theta (longitude)
    float theta = atan(x, rho_0 - y) / n;

    if (abs(theta) > PI) {
      return BLANK;
    }

    // Calculate phi (latitude)
    float phi = 2. * atan(pow(F / rho, 1./n)) - PI / 2.;

    return vec2(
        theta,
        phi
    );
`
);
