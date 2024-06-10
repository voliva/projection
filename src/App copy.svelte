<script lang="ts">
  import { onMount } from "svelte";
  import { getPixel, imageLoaded } from "./source";
  import {
    equiRectangular,
    gnomonic,
    lambert,
    mercator,
    normalize,
    ortogonal,
  } from "./projection";
  import { axis, createRotation, rotate } from "./rotation";
  import { identity, multiply, type Matrix } from "mathjs";

  const projections = [
    { name: "Mercator", projection: mercator() },
    { name: "Equi-rectangular", projection: equiRectangular() },
    { name: "Lambert", projection: lambert() },
    { name: "Gnomonic", projection: gnomonic() },
    { name: "Orthographic", projection: ortogonal(3) },
  ];

  let canvasElement: HTMLCanvasElement;

  let selectedProjection = projections[0];

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
  function resetOrientation() {
    committedRotation = identity(3) as Matrix;
  }

  // hax rofl
  function quickMove(axis: number[], amount: number) {
    return () => {
      committedRotation = multiply(
        committedRotation,
        createRotation(axis, (amount * Math.PI) / 2)
      );
    };
  }

  let ready = false;
  $: isActive = selectedAxis !== null;

  onMount(async () => {
    await imageLoaded;
    ready = true;

    // committedRotation = createRotation(axis.x, Math.PI / 2);
  });

  $: {
    if (ready) {
      if (isActive) {
        canvasElement.width = 50;
        canvasElement.height = 50;
      } else {
        canvasElement.width = 800;
        canvasElement.height = 800;
      }
    }
  }

  $: {
    if (ready) {
      const { width, height } = canvasElement;
      const context = canvasElement.getContext("2d")!;
      context.clearRect(0, 0, width, height);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const destCoord = normalize({ x, y }, width, height);
          let spherical = selectedProjection.projection.toSpherical(destCoord);
          if (!spherical) continue;

          spherical = rotate(rotationMatrix, spherical);
          const { r, g, b } = getPixel(spherical);
          context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          context.fillRect(x, y, 1, 1);
        }
      }

      // Draw center
      if (!isActive) {
        context.strokeStyle = "darkred";
        context.lineWidth = 1;
        context.moveTo(width / 2 - width * 0.01, height / 2);
        context.lineTo(width / 2 + width * 0.01, height / 2);
        context.moveTo(width / 2, height / 2 - height * 0.01);
        context.lineTo(width / 2, height / 2 + height * 0.01);
        context.stroke();
      }
    }
  }

  let orientationElement: HTMLCanvasElement;
  const orientationProjection = ortogonal();
  $: {
    if (ready) {
      const { width, height } = orientationElement;
      const context = orientationElement.getContext("2d")!;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const destCoord = {
            x: (x - width / 2) / width,
            y: (height / 2 - y) / height,
          };
          let spherical = orientationProjection.toSpherical(destCoord);
          if (!spherical) {
            continue;
          }
          spherical = rotate(rotationMatrix, spherical);
          const { r, g, b } = getPixel(spherical);
          context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          context.fillRect(x, y, 1, 1);
        }
      }

      // Draw center
      context.strokeStyle = "darkred";
      context.lineWidth = 1;
      context.moveTo(width / 2 - width * 0.01, height / 2);
      context.lineTo(width / 2 + width * 0.01, height / 2);
      context.moveTo(width / 2, height / 2 - height * 0.01);
      context.lineTo(width / 2, height / 2 + height * 0.01);
      context.stroke();
    }
  }
</script>

<main>
  <div class="canvas">
    <select bind:value={selectedProjection}>
      {#each projections as projection}
        <option value={projection}>{projection.name}</option>
      {/each}
    </select>
    <canvas
      bind:this={canvasElement}
      width="800"
      height="800"
      style="width: 800px; height: 800px;"
    />
  </div>
  <div class="orto">
    <div class="angle-input">
      <p>spin</p>
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
    <div class="vertical-input-container">
      <canvas bind:this={orientationElement} width="100" height="100" />
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
    <input
      type="range"
      min={-Math.PI}
      max={Math.PI}
      step={0.01}
      on:mousedown={() => {
        selectedAxis = axis.y;
      }}
      on:mouseup={commit}
      value={selectedAxis === axis.y ? -angle : 0}
      on:input={(evt) => (angle = -Number(evt.currentTarget.value))}
    />
    <button on:click={resetOrientation}>Reset</button>
    <div class="button-group">
      <button on:click={quickMove(axis.z, -1)}>Spin left</button>
      <button on:click={quickMove(axis.z, 1)}>Spin right</button>
    </div>
    <div class="button-group">
      <button on:click={quickMove(axis.x, 1)}>Up</button>
      <button on:click={quickMove(axis.x, -1)}>Down</button>
    </div>
    <div class="button-group">
      <button on:click={quickMove(axis.y, 1)}>Left</button>
      <button on:click={quickMove(axis.y, -1)}>Right</button>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .canvas {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .orto {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .angle-input {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .angle-input input {
    transform: translate(0, 2px);
  }
  input::-webkit-slider-runnable-track {
    background: var(--bg-color);
    border: 1px solid darkgray;
    border-radius: 16px;
    height: 8px;
  }
  input::-webkit-slider-thumb {
    transform: translate(0, -5px);
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
  .vertical-input-container input::-webkit-slider-runnable-track {
    height: auto;
    width: 8px;
  }
  .vertical-input-container input::-webkit-slider-thumb {
    transform: translate(5px, 0);
  }
  button {
    margin-top: 1rem;
  }
</style>
