<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import Button from './ui/button/button.svelte';
	import { Trash2 } from 'lucide-svelte';

	let { notes } = $props();

	let filteredNotes = $state(notes);
	let searchQuery = $state('');

	function filterNotes(query: string) {
		searchQuery = query;
		if (!query.trim()) {
			filteredNotes = notes;
			return;
		}
		filteredNotes = notes.filter(
			(note: { id: string; title: string; content: string; createdAt: Date; modifiedAt: Date }) =>
				note.title?.toLowerCase().includes(query.toLowerCase()) ||
				note.content?.toLowerCase().includes(query.toLowerCase())
		);
	}
</script>

<Card.Root class="w-lg">
	<Card.Header>
		<Card.Title class="text-center text-xl">Notes</Card.Title>
		<div class="flex justify-center">
			<Input
				type="search"
				class="grow"
				placeholder="Search notes..."
				bind:value={searchQuery}
				oninput={(e) => filterNotes(e.currentTarget.value)}
			/>
		</div>
	</Card.Header>
	{#if filteredNotes.length > 0}
		<Card.Content>
			<Table.Root>
				<Table.Caption>A list of your recent notes.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class=""></Table.Head>
						<Table.Head>Title</Table.Head>
						<Table.Head>Created</Table.Head>
						<Table.Head class="">Modified</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredNotes as note, i}
						<Table.Row>
							<Table.Cell class="text-2xl font-thin tabular-nums opacity-30">{i + 1}</Table.Cell>
							<Table.Cell>
								<Button variant="ghost" href={`/editor/${note.id}`}
									>{note.title || 'Untitled'}</Button
								>
							</Table.Cell>
							<Table.Cell class="text-sm opacity-70"
								>{note.createdAt?.toLocaleDateString()}</Table.Cell
							>
							<Table.Cell class="text-right"
								>{note.modifiedAt?.toLocaleDateString() ||
									note.createdAt?.toLocaleDateString()}</Table.Cell
							>
							<Table.Cell>
								<form action="?/deleteNote" method="POST" class="inline">
									<input type="hidden" name="noteId" value={note.id} />
									<Button variant="ghost" type="submit" class="text-error">
										<Trash2 size={16} />
									</Button>
								</form>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	{:else}
		<Card.Content>
			<div class="text-base-content/60 p-8 text-center">
				{#if searchQuery}
					No notes found matching "{searchQuery}"
				{:else}
					No notes yet. Click "Add Note" to create your first note.
				{/if}
			</div>
		</Card.Content>
	{/if}
</Card.Root>
