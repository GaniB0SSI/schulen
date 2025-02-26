<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    let river = null;

    async function fetchRiver() {
        const id = $page.params.id;
        const response = await fetch(`/api/rivers/${id}`);
        river = await response.json();
    }

    onMount(fetchRiver);
</script>

<h1>River Details</h1>
{#if river}
    <div>
        <h2>{river.name}</h2>
        <p>{river.description}</p>
        <p><strong>Length:</strong> {river.length_km} km</p>
        <p><strong>Source:</strong> {river.source}</p>
        <p><strong>Mouth:</strong> {river.mouth}</p>
    </div>
{/if}
