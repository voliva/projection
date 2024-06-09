uniform sampler2D texture1;
uniform float rotation;

varying vec2 vUv;

vec2 to_spherical(vec2 xy);
vec2 from_spherical(vec2 pt);
void main() {
    vec2 spherical = to_spherical(vec2(
        vUv.x - 0.5,
        vUv.y - 0.5
    ));
    spherical.x += rotation * 2.;
    while (spherical.y > 3.1415/2.) {
        spherical.y -= 3.1415;
    }
    while (spherical.x > 3.1415) {
        spherical.x -= 2. * 3.1415;
    }
    vec2 converted = from_spherical(spherical);

    vec2 origin = vec2(converted.x + 0.5, converted.y + 0.5);

    gl_FragColor = texture2D(texture1, origin);
}

vec2 to_spherical(vec2 xy) {
    float phi = atan(sinh(xy.y * 1.85));

    return vec2(
        xy.x * 2.0 * 3.1415,
        phi
    );
}

vec2 from_spherical(vec2 tp) {
    float sec = 1.0 / cos(tp.y);
    float y = log(sec + tan(tp.y)) / 1.85;

    return vec2(
        tp.x / (2.0 * 3.1415),
        max(-50., min(50., y))
    );
}