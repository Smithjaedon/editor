<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import { invalidateAll } from '$app/navigation';

	let content = $state('');

	type Note = {
		id: string;
		title: string;
		content: string;
	};

	// async function signOut() {
	// 	const { error } = await supabase.auth.signOut();
	// 	if (error) return;
	// 	goto('/');
	// }
	// async function saveNote(content: string, title: string) {
	// 	const {
	// 		data: { user }
	// 	} = await supabase.auth.getUser(); // Get current user

	// 	if (!user) {
	// 		console.error('User not found');
	// 		return;
	// 	}

	// 	const { error } = await supabase.from('notes').insert([
	// 		{ title, content, userid: user.id } // 👈 include userId
	// 	]);

	// 	if (error) {
	// 		console.error('Error saving note:', error.message);
	// 		return;
	// 	}

	// 	await invalidateAll(); // Refresh data
	// }

	$effect(() => {
		console.log(content);
	});

	const { notes } = $props<{ notes: Note[] }>();
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
		<textarea class="h-50 min-w-md" bind:value={content}></textarea>
		<!-- <button
			class="w-sm rounded-md bg-neutral-900 px-4 py-2 text-white shadow-md"
			onclick={() => saveNote(content, 'Untitled')}>Save Note</button
		> -->
		<form action="?/signout" method="post">
			<button class="w-xs rounded-md border-1 border-neutral-400 bg-neutral-200 px-4 py-2 shadow-md"
				>Sign Out</button
			>
		</form>
	</div>
</div>
