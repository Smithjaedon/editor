<script lang="ts">
	import AddCard from '$lib/components/addCard.svelte';

	const { data } = $props();
	const { notes } = data;
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<AddCard {notes} />
</div>
