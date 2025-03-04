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
  
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Schools List:</h2>
    <ul class="space-y-3">
        {#each schulen as schule}
            <li class="bg-blue-100 hover:bg-blue-200 transition duration-300 p-3 rounded-lg shadow-sm">
                <a href={`/api/schulen/${schule.id}`} target="_blank" class="text-blue-600 font-medium hover:underline">
                    {schule.name}
                </a>
            </li>
        {/each}
    </ul>
  </div>
  