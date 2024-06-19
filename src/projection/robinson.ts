import { createProjectionShader } from "./projectionShader";

// X-scale, Y
const robinsonTable = [
  [0, 1.0, 0.0],
  [5, 0.9986, 0.062],
  [10, 0.9954, 0.124],
  [15, 0.99, 0.186],
  [20, 0.9822, 0.248],
  [25, 0.973, 0.31],
  [30, 0.96, 0.372],
  [35, 0.9427, 0.434],
  [40, 0.9216, 0.4958],
  [45, 0.8962, 0.5571],
  [50, 0.8679, 0.6176],
  [55, 0.835, 0.6769],
  [60, 0.7986, 0.7346],
  [65, 0.7597, 0.7903],
  [70, 0.7186, 0.8435],
  [75, 0.6732, 0.8936],
  [80, 0.6213, 0.9394],
  [85, 0.5722, 0.9761],
  [90, 0.5322, 1.0],
];

const phiTable = robinsonTable.map(([deg]) => (Math.PI * deg) / 180);
const xTable = robinsonTable.map(([, x]) => x);
const yTable = robinsonTable.map(([, , y]) => y * 0.5);

/*
x and y range are [-0.5,0.5]
x left -> right
y bottom -> top

returns vec2(theta, phi)
phi is latitude, "y coordinate". 0 = equator, PI/2 = Noth pole, -PI/2 = South Pole
theta is longitude, "x coordinate". 0 = center, PI = right, -PI = left
*/
export const robinsonProjection = createProjectionShader(
  `
  float x = xy.x, y = xy.y * 2.;

  int i=0;
  for(;i<${yTable.length};i++) {
    if (yTable[i] > abs(y)) {
      break;
    }
  }
  int start = i-1;

  float len = yTable[i] - yTable[start];
  float offset = abs(y) - yTable[start];
  float pct = offset / len;

  float phi = interpolate(phiTable, start, pct);
  if (y < 0.0) {
    phi = -phi;
  }
  
  float xFactor = interpolate(xTable, start, pct);
  x = x * 2.;
  if (abs(x) > xFactor) {
    return BLANK;
  }
  // we have to revert the scaling
  float theta = x * 3.1415 / xFactor;

  return vec2(theta, phi);
`,
  `
float yTable[${yTable.length}] = float[](
  ${yTable.map((v) => v.toFixed(4)).join(", ")}
);
float xTable[${xTable.length}] = float[](
  ${xTable.map((v) => v.toFixed(4)).join(", ")}
);
float phiTable[${phiTable.length}] = float[](
  ${phiTable.map((v) => v.toFixed(4)).join(", ")}
);

float interpolate(float[${phiTable.length}] arr, int start, float pct) {
  float len = arr[start+1] - arr[start];

  return arr[start] + len * pct;
}
  `
);
