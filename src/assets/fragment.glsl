uniform sampler2D world_map;
uniform float rotation;
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

    gl_FragColor = texture2D(world_map, origin);
}

float scale = 6.;

vec2 to_spherical(vec2 xy) {
    float phi = atan(sinh(xy.y * scale));

    return vec2(
        xy.x * 2.0 * 3.1415,
        phi
    );
}

vec2 from_spherical(vec2 tp) {
    float sec = 1.0 / cos(tp.y);
    float y = log(sec + tan(tp.y)) / scale;

    return vec2(
        tp.x / (2.0 * 3.1415),
        max(-50., min(50., y))
    );
}