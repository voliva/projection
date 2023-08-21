<script lang="ts">
  import { onMount } from "svelte";
  import { getPixel, imageLoaded } from "./source";
  import { mercator, normalize } from "./projection";
  import { createRotation } from "./rotation";

  let canvasElement: HTMLCanvasElement;

  const projection = mercator();

  let angle = Math.PI / 2.0;

  $: rotate = createRotation(angle);

  let ready = false;
  let isActive = false;

  onMount(async () => {
    await imageLoaded;
    ready = true;
  });

  $: {
    if (ready) {
      if (isActive) {
        canvasElement.width = 50;
        canvasElement.height = 50;
      } else {
        canvasElement.width = 500;
        canvasElement.height = 500;
      }
    }
  }

  $: {
    if (ready) {
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
  }
</script>

<main>
  <canvas
    bind:this={canvasElement}
    width="500"
    height="500"
    style="width: 500px; height: 500px;"
  />
  <div class="angle-input">
    <input
      type="range"
      min={0}
      max={2 * Math.PI}
      step={0.01}
      on:mousedown={() => (isActive = true)}
      on:mouseup={() => (isActive = false)}
      bind:value={angle}
    />
    <p>{((angle * 180) / Math.PI).toFixed(2)}º</p>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  .angle-input {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
