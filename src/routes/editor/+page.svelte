<script lang="ts">
	let content = $state('');
	const { data } = $props();
	const { notes } = data;
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="flex max-w-md flex-col items-center justify-center space-y-2">
		<div>
			{#if notes}
				{#each notes as note}
					<div class="mb-2">{note.title}</div>
				{/each}
			{/if}
		</div>
		<form action="?/saveNote" method="post">
			<label for="title" class="text-lg font-semibold">Title</label>
			<input type="text" name="title" id="title" class="mb-3 w-md" />
			<label for="content" class="text-lg font-semibold">Content</label>
			<textarea id="content" name="content" class="h-50 min-w-md" bind:value={content}></textarea>

			<button class="w-sm rounded-md bg-neutral-900 px-4 py-2 text-white shadow-md"
				>Save Note</button
			>
		</form>
		<form action="?/signout" method="post">
			<button class="w-xs rounded-md border-1 border-neutral-400 bg-neutral-200 px-4 py-2 shadow-md"
				>Sign Out</button
			>
		</form>
	</div>
</div>
