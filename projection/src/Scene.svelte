<script>
  import { T, useTask } from "@threlte/core";
  import { quadOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import textureUrl from "./assets/mercator_projection.jpeg";
  import fragmentShader from "./assets/fragment.glsl?raw";
  import vertexShader from "./assets/vertex.glsl?raw";
  import { interactivity } from "@threlte/extras";
  import { createRotation, axis, to_matrix } from "./rotation";

  import {
    AmbientLight,
    OrthographicCamera,
    TextureLoader,
    Vector3,
  } from "three";
  import { useLoader } from "@threlte/core";
  import { multiply } from "mathjs";

  const texture = useLoader(TextureLoader).load(textureUrl);

  interactivity();
  let rotation = 0;

  $: rotationMatrix = multiply(
    createRotation(axis.x, rotation),
    createRotation(axis.y, rotation),
    createRotation(axis.z, rotation / 2)
  );

  const size = 850;

  let clear = 0;
  $: {
    cancelAnimationFrame(clear);
    clear = requestAnimationFrame(() => (rotation += 0.01), 33);
  }
</script>

<T.AmbientLight />
<T.OrthographicCamera
  makeDefault
  zoom={1}
  position={[0, 0, 1]}
  on:create={({ ref }) => {
    ref.lookAt(0, 0, 0);
  }}
/>

<T.Mesh receiveShadow>
  <T.PlaneGeometry args={[size, size]} />
  <!-- {#if $texture}
    <T.MeshStandardMaterial map={$texture} />
  {:else}
    <T.MeshStandardMaterial color="pink" />
  {/if} -->
  <T.MeshStandardMaterial color="gray" />
  {#await texture then value}
    <T.ShaderMaterial
      {fragmentShader}
      {vertexShader}
      uniforms={{
        texture1: {
          type: "t",
          value,
        },
        rotation: {
          value: 0,
        },
        rotation_matrix: {
          value: [],
        },
      }}
      uniforms.rotation.value={rotation}
      uniforms.rotation_matrix.value={to_matrix(rotationMatrix)}
    />
  {/await}
</T.Mesh>
