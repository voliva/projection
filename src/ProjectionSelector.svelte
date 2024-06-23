<script lang="ts">
  import { projections, type Projection } from "./projections";

  export let selectedProjection: Projection;
</script>

<ul>
  {#each projections as projection}
    <li>
      <button
        on:click={() => (selectedProjection = projection)}
        class={selectedProjection == projection ? "selected" : ""}
      >
        <img src={projection.url} alt={projection.name} />
        {projection.name}
      </button>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style-type: none;
    display: flex;
    align-items: stretch;
    gap: 1rem;
    padding: 0;
    margin: 0;
    overflow: auto;
    max-width: 100%;
    flex: 0 0 auto;
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    height: 100%;
    font-size: 0.8rem;
  }

  button.selected {
    background-color: #333;
  }

  img {
    max-height: 5rem;
    max-width: 6rem;
    object-fit: contain;
    flex: 1 1 auto;
  }
</style>
