<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from '../add/$types';
	import { CircleUserRound } from 'lucide-svelte';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { enhance } from '$app/forms';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Menubar.Root class="flex h-12 items-center justify-between px-4">
	<div class="text-2xl">
		<Button variant="ghost" href="/editor">GlyphNote</Button>
	</div>
	<Menubar.Menu>
		<Menubar.Trigger><CircleUserRound /></Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				<Button variant="ghost" type="submit" class="w-full text-left" form="signout-form"
					>Sign Out</Button
				>
				<form id="signout-form" action="?/signout" method="POST" class="hidden" use:enhance></form>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

{@render children()}
