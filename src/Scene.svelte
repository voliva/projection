<script lang="ts">
  import { T, useLoader, useThrelte } from "@threlte/core";
  import { type Matrix } from "mathjs";
  import { TextureLoader } from "three";
  import textureUrl from "./assets/mercator_projection.jpeg";
  import vertexShader from "./assets/vertex.glsl?raw";
  import { to_matrix } from "./rotation";
  import { derived } from "svelte/store";

  export let projectionShader: string;
  export let rotationMatrix: Matrix;

  const threlte = useThrelte();

  const size = derived(threlte.size, (size) =>
    Math.min(size.width, size.height)
  );

  const texture = useLoader(TextureLoader).load(textureUrl);
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
  <T.PlaneGeometry args={[$size, $size]} />
  <T.MeshStandardMaterial color="gray" />
  {#await texture then value}
    {#key projectionShader}
      <T.ShaderMaterial
        fragmentShader={projectionShader}
        {vertexShader}
        uniforms={{
          world_map: {
            type: "t",
            value,
          },
          rotation_matrix: {
            value: [],
          },
        }}
        uniforms.rotation_matrix.value={to_matrix(rotationMatrix)}
      />
    {/key}
  {/await}
</T.Mesh>
