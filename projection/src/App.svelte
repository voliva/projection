<script lang="ts">
  import { onMount } from "svelte";
  import { getPixel, imageLoaded } from "./source";
  import { mercator, normalize } from "./projection";
  import { rotate } from "./rotation";

  let canvasElement: HTMLCanvasElement;

  const projection = mercator();

  async function draw() {
    await imageLoaded;

    const { width, height } = canvasElement;
    const context = canvasElement.getContext("2d");
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const destCoord = normalize({ x, y }, width, height);
        let spherical = projection.toSpherical(destCoord);
        spherical = rotate(spherical);
        const { r, g, b } = getPixel(spherical);
        context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        context.fillRect(x, y, 1, 1);
      }
    }
  }

  onMount(() => draw());
</script>

<main>
  <canvas bind:this={canvasElement} width="500" height="500" />
</main>

<style>
</style>
