<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    let rivers = [];

    async function fetchRivers() {
        const response = await fetch('/api/rivers');
        rivers = await response.json();
    }

    function navigateToRiver(id) {
        goto(`/river/${id}`);
    }

    onMount(fetchRivers);
</script>

<style>
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        cursor: pointer;
        margin: 5px 0;
    }
    * {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 20px;
    text-align: center;
}

h1 {
    color: #333;
}

ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

li {
    cursor: pointer;
    margin: 10px 0;
    padding: 10px;
    background: white;
    border-radius: 5px;
    width: 200px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

li:hover {
    background: #ddd;
}



</style>

<h1>Rivers of Albania</h1>
<ul>
    {#each rivers as river}
        <li on:click={() => navigateToRiver(river.id)}>
            {river.name}
        </li>
    {/each}
</ul>