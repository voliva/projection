<script>
  import { Canvas } from "@threlte/core";
  import Scene from "./Scene.svelte";
</script>

<main>
  <div class="canvas">
    <Canvas>
      <Scene />
    </Canvas>
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
  .canvas {
    position: relative;
    overflow: hidden;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    flex: 1 1 auto;
    height: 100%;
  }
  .wrapper {
    position: absolute;
  }
</style>
