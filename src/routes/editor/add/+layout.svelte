<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from '../add/$types';
	import { CircleUserRound } from 'lucide-svelte';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	async function signout() {
		try {
			const res = await fetch('/api/signout', {
				method: 'POST'
			});
			if (!res.ok) {
				const data = await res.json();
				console.error('failed to signout:', data.error || res.statusText);
			} else {
				console.log('successful signout');
				goto('/');
			}
		} catch (err) {
			console.error('failed signout', err);
		}
	}
</script>

<Menubar.Root class="sticky top-0 flex h-12 items-center justify-between px-4">
	<div class="text-2xl">
		<Button variant="ghost" href="/editor">GlyphNote</Button>
	</div>
	<Menubar.Menu>
		<Menubar.Trigger><CircleUserRound /></Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				<Button variant="ghost" type="submit" class="w-full text-left" onclick={signout}
					>Sign Out</Button
				>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

{@render children()}
