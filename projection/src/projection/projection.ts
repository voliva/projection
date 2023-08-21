export interface Cartesian {
  x: number; // [0,1)
  y: number; // [-n,n]: keeps the relative scale to x
}

export interface Spherical {
  phi: number; // [-𝜋/2,𝜋/2]: vertical angle. positive = north, negative = south
  theta: number; // [0,2𝜋): horizontal angle
}

export interface Projection {
  toSpherical(cartesian: Cartesian): Spherical;
  fromSpherical(spherical: Spherical): Cartesian;
}
