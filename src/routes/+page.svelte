<script>
  import { onMount } from 'svelte';

  let schulen = [];

  onMount(async () => {
      try {
          const response = await fetch('/api/schulen'); // Updated to fetch schools
          if (!response.ok) {
              throw new Error('Failed to fetch schools');
          }
          schulen = await response.json(); 
      } catch (error) {
          console.error(error);
      }
  });
</script>

<h2>Schools List:</h2>
<ul>
  {#each schulen as schule}
      <li>
          <a href={`/api/schulen/${schule.id}`} target="_blank">{schule.name}</a>
      </li>
  {/each}
</ul>
