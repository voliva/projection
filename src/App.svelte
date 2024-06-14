<script lang="ts">
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
  import {
    equiRectangular,
    gnomonicProjection,
    lambertProjection,
    mercatorProjection,
    ortogonalProjection,
  } from "./assets/projectionShader";
  import { identity, multiply, type Matrix } from "mathjs";
  import { axis, createRotation } from "./rotation";

  const projections = [
    { name: "Mercator", projection: mercatorProjection },
    { name: "Equi-rectangular", projection: equiRectangular },
    { name: "Lambert", projection: lambertProjection },
    { name: "Gnomonic", projection: gnomonicProjection },
    { name: "Orthographic", projection: ortogonalProjection },
  ];

  let selectedProjection = projections[0];

  $: console.log(selectedProjection);

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
</script>

<main>
  <div class="canvas-container">
    <select bind:value={selectedProjection}>
      {#each projections as projection}
        <option value={projection}>{projection.name}</option>
      {/each}
    </select>
    <div class="canvas">
      <Canvas shadows={false}>
        <Scene
          projectionShader={selectedProjection.projection}
          {rotationMatrix}
        />
      </Canvas>
    </div>
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
      <div style="width: 150px; height: 150px;">
        <Canvas>
          <Scene projectionShader={ortogonalProjection} {rotationMatrix} />
        </Canvas>
      </div>
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
    overflow: hidden;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }
  .canvas-container {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    flex: 1 1 auto;
    height: 100%;
  }
  .canvas {
    flex: 1 1 auto;
    width: 100%;
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
