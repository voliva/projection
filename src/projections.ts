import {
  equiRectangular,
  gnomonicProjection,
  lambertProjection,
  mercatorProjection,
  ortographicProjection,
  robinsonProjection,
  lambertConicProjection,
} from "./projection";
import equirec from "./assets/equirec.webp";
import gnomonic from "./assets/gnomonic.webp";
import lambert from "./assets/lambert.webp";
import mercator from "./assets/mercator.webp";
import ortographic from "./assets/ortographic.webp";
import robinson from "./assets/robinson.webp";
import lambertConic from "./assets/lambertConic.webp";

export interface Projection {
  name: string;
  projection: string;
  url: string;
}

export const projections = [
  { name: "Mercator", projection: mercatorProjection, url: mercator },
  { name: "Equi-rectangular", projection: equiRectangular, url: equirec },
  { name: "Lambert", projection: lambertProjection, url: lambert },
  {
    name: "Lambert Conic",
    projection: lambertConicProjection,
    url: lambertConic,
  },
  { name: "Robinson", projection: robinsonProjection, url: robinson },
  { name: "Gnomonic", projection: gnomonicProjection, url: gnomonic },
  { name: "Orthographic", projection: ortographicProjection, url: ortographic },
];
