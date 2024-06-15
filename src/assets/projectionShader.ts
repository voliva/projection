const createProjectionShader = (toShpericalBody: string) => {
  return `
uniform sampler2D world_map;
uniform mat3 rotation_matrix;

varying vec2 vUv;

vec2 to_spherical(vec2 xy);
vec2 from_spherical(vec2 tp);
vec3 spherical_to_cartisian(vec2 tp) {
    return vec3(
        sin(tp.x) * cos(tp.y),
        sin(tp.y),
        cos(tp.x) * cos(tp.y)
    );
}
vec2 cartesian_to_spherical(vec3 cart) {
    return vec2(
        atan(cart.x, cart.z),
        asin(cart.y)
    );
}
void main() {
    vec2 spherical = to_spherical(vec2(
        vUv.x - 0.5,
        vUv.y - 0.5
    ));
    vec3 cartesian = spherical_to_cartisian(spherical);
    vec3 rotated = cartesian * rotation_matrix;
    spherical = cartesian_to_spherical(rotated);

    vec2 converted = from_spherical(spherical);

    vec2 origin = vec2(converted.x + 0.5, converted.y + 0.5);

    if (isnan(origin.x) || isnan(origin.y)) {
        gl_FragColor = vec4(0.0);
    } else {
        gl_FragColor = texture2D(world_map, origin);
    }
}

vec2 to_spherical(vec2 xy) {
    ${toShpericalBody}
}

vec2 from_spherical(vec2 tp) {
    float sec = 1.0 / cos(tp.y);
    float y = log(sec + tan(tp.y)) / 6.0;

    return vec2(
        tp.x / (2.0 * 3.1415),
        max(-50., min(50., y))
    );
}
    `;
};

export const mercatorProjection = createProjectionShader(
  `
    float phi = atan(sinh(xy.y * 6.));

    return vec2(
        xy.x * 2.0 * 3.1415,
        phi
    );
`
);

export const ortogonalProjection = createProjectionShader(
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

export const lambertProjection = createProjectionShader(
  `
    return vec2(
        xy.x * 2. * 3.1415,
        asin(xy.y * 2. * 3.1415)
    );
`
);

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

export const equiRectangular = createProjectionShader(
  `
    xy.y = xy.y / 2.14;

    return vec2(
        xy.x * 2. * 3.1415,
        xy.y * 2. * 3.1415
    );
`
);
