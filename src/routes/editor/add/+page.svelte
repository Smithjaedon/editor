<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	const { data } = $props();
	const { notes } = data;

	let filteredNotes = $state(notes);
	let searchQuery = $state('');

	function taketo(id: string) {
		goto(`/editor/${id}`);
	}

	function filterNotes(query: string) {
		searchQuery = query;
		if (!query.trim()) {
			filteredNotes = notes;
			return;
		}
		filteredNotes = notes.filter(
			(note) =>
				note.title?.toLowerCase().includes(query.toLowerCase()) ||
				note.content?.toLowerCase().includes(query.toLowerCase())
		);
	}
</script>

<div class="flex min-h-screen items-center justify-center p-4">
	<div class="border-base-300 bg-base-100 w-full max-w-2xl rounded-lg border shadow-lg">
		<div class="border-base-300 bg-base-300 border-b p-4">
			<h2 class="text-lg font-medium">Recent Notes</h2>
		</div>
		<div class="bg-base-200 flex items-center justify-center p-4">
			<label class="input input-bordered flex w-full max-w-md items-center gap-2">
				<svg class="h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</g>
				</svg>
				<input
					type="search"
					class="grow"
					placeholder="Search notes..."
					bind:value={searchQuery}
					oninput={(e) => filterNotes(e.currentTarget.value)}
				/>
			</label>
		</div>

		{#if filteredNotes.length > 0}
			<div class="overflow-x-auto">
				<table class="table-zebra table w-full">
					<thead>
						<tr class="bg-base-200">
							<th class="w-16"></th>
							<th>Title</th>
							<th class="w-40">Created</th>
							<th class="w-40">Modified</th>
							<th class="w-16"></th>
						</tr>
					</thead>
					<tbody>
						{#each filteredNotes as note, i}
							<tr class="hover:bg-base-200">
								<th class="text-2xl font-thin tabular-nums opacity-30">{i + 1}</th>
								<td>
									<button
										class="link link-primary hover:link-primary-focus"
										onclick={() => taketo(note.id)}
									>
										{note.title || 'Untitled Note'}
									</button>
								</td>
								<td class="text-sm opacity-70">
									{note.createdAt?.toLocaleDateString()}
								</td>
								<td class="text-sm opacity-70">
									{note.modifiedAt?.toLocaleDateString() || note.createdAt?.toLocaleDateString()}
								</td>
								<td>
									<form action="?/deleteNote" method="POST" class="inline">
										<input type="hidden" name="noteId" value={note.id} />
										<button type="submit" class="btn btn-ghost btn-sm text-error hover:bg-error/10">
											<Trash2 size={16} />
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="text-base-content/60 p-8 text-center">
				{#if searchQuery}
					No notes found matching "{searchQuery}"
				{:else}
					No notes yet. Click "Add Note" to create your first note.
				{/if}
			</div>
		{/if}
	</div>
</div>
