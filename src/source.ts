import mercatorImage from "./assets/mercator_projection.jpeg";
import { denormalize, mercator, type Spherical } from "./projection";

export const imageLoaded = new Promise<HTMLImageElement>((resolve) => {
  const img = new Image();
  img.addEventListener("load", (r) => resolve(img));
  img.src = mercatorImage;
});

let imageData: ImageData | null = null;
imageLoaded.then((img) => {
  const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
  const context = canvas.getContext("2d")!;
  context.drawImage(img, 0, 0);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
});

const projection = mercator();
export function getPixel(coord: Spherical) {
  if (!imageData) throw new Error("source image not loaded yet");

  const normalized = projection.fromSpherical(coord);
  if (!normalized) {
    return { r: 0, g: 0, b: 0 };
  }

  const { x, y } = denormalize(normalized, imageData.width, imageData.height);

  const idx = (y * imageData.width + x) * 4;
  if (idx >= imageData.data.length || idx < 0) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: imageData.data[idx],
    g: imageData.data[idx + 1],
    b: imageData.data[idx + 2],
  };
}
