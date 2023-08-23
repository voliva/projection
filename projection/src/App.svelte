<script lang="ts">
  import { onMount } from "svelte";
  import { getPixel, imageLoaded } from "./source";
  import {
    equiRectangular,
    gnomonic,
    lambert,
    mercator,
    normalize,
  } from "./projection";
  import { axis, createRotation, rotate } from "./rotation";
  import { ortogonal } from "./projection/ortogonal";
  import { identity, multiply, type Matrix } from "mathjs";

  let canvasElement: HTMLCanvasElement;

  const projection = gnomonic();

  let angle = 0;
  let selectedAxis: number[] | null = null;
  let committedRotation = identity(3) as Matrix;

  $: tmpRotation =
    selectedAxis === null
      ? (identity(3) as Matrix)
      : createRotation(selectedAxis, angle);
  $: rotationMatrix = multiply(committedRotation, tmpRotation) as Matrix;

  function commit() {
    committedRotation = multiply(committedRotation, tmpRotation);
    angle = 0;
    selectedAxis = null;
  }

  let ready = false;
  $: isActive = selectedAxis !== null;

  onMount(async () => {
    await imageLoaded;
    ready = true;

    committedRotation = createRotation(axis.z, Math.PI / 2);
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
          spherical = rotate(rotationMatrix, spherical);
          const { r, g, b } = getPixel(spherical);
          context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          context.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  let orientationElement: HTMLCanvasElement;
  const orientationProjection = ortogonal();
  $: {
    if (ready) {
      const { width, height } = orientationElement;
      const context = orientationElement.getContext("2d");
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const destCoord = normalize({ x, y }, width, height);
          let spherical = orientationProjection.toSpherical(destCoord);
          if (Number.isNaN(spherical.theta) || Number.isNaN(spherical.phi)) {
            continue;
          }
          spherical = rotate(rotationMatrix, spherical);
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
    <p>spin</p>
    <input
      type="range"
      min={-Math.PI}
      max={Math.PI}
      step={0.01}
      on:mousedown={() => {
        selectedAxis = axis.x;
      }}
      on:mouseup={commit}
      value={selectedAxis === axis.x ? angle : 0}
      on:input={(evt) => (angle = Number(evt.currentTarget.value))}
    />
  </div>
  <div class="angle-input">
    <input
      type="range"
      min={-Math.PI}
      max={Math.PI}
      step={0.01}
      on:mousedown={() => {
        selectedAxis = axis.y;
      }}
      on:mouseup={commit}
      value={selectedAxis === axis.y ? angle : 0}
      on:input={(evt) => (angle = Number(evt.currentTarget.value))}
    />
  </div>
  <div class="vertical-input-container">
    <canvas bind:this={orientationElement} width="100" height="100" />
    <div class="angle-input">
      <input
        type="range"
        min={-Math.PI}
        max={Math.PI}
        step={0.01}
        on:mousedown={() => {
          selectedAxis = axis.z;
        }}
        on:mouseup={commit}
        value={selectedAxis === axis.z ? angle : 0}
        on:input={(evt) => (angle = Number(evt.currentTarget.value))}
      />
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .angle-input {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical-input-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 2rem;
  }
  .vertical-input-container input {
    width: 2rem;
    -webkit-appearance: slider-vertical;
    appearance: slider-vertical;
  }
</style>
