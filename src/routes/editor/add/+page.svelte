<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import * as Table from '$lib/components/ui/table/index.js';
	import AddCard from '$lib/components/addCard.svelte';

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
	<AddCard {notes} />
</div>
