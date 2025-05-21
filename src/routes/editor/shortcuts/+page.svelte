<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Keyboard,
		Menu,
		CircleUserRound,
		Baseline,
		Text,
		AlignLeft,
		AlignCenter,
		AlignRight,
		AlignJustify
	} from 'lucide-svelte';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	let { data }: { data: PageData } = $props();

	const textFormatting = [
		{ name: 'Bold', shortcut: '⌘/Ctrl + B', description: 'Make text bold' },
		{ name: 'Italic', shortcut: '⌘/Ctrl + I', description: 'Make text italic' },
		{ name: 'Strikethrough', shortcut: '⌘/Ctrl + S', description: 'Add strikethrough to text' },
		{ name: 'Code', shortcut: '⌘/Ctrl + K', description: 'Format text as code' },
		{ name: 'Highlight', shortcut: '⌘/Ctrl + H', description: 'Highlight text' },
		{ name: 'Quote', shortcut: '⌘/Ctrl + Q', description: 'Format text as a quote' }
	];

	const textAlignment = [
		{ name: 'Left Align', description: 'Align text to the left' },
		{ name: 'Center Align', description: 'Align text to the center' },
		{ name: 'Right Align', description: 'Align text to the right' },
		{ name: 'Justify', description: 'Justify text' }
	];

	const textColors = [
		{ name: 'Black', color: 'text-black' },
		{ name: 'Gray', color: 'text-gray-500' },
		{ name: 'Red', color: 'text-red-500' },
		{ name: 'Orange', color: 'text-orange-500' },
		{ name: 'Yellow', color: 'text-yellow-500' },
		{ name: 'Green', color: 'text-green-500' },
		{ name: 'Blue', color: 'text-blue-500' },
		{ name: 'Purple', color: 'text-purple-500' },
		{ name: 'Pink', color: 'text-pink-500' }
	];

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

<Menubar.Root class="mb-0 flex h-12 items-center justify-between rounded-none bg-neutral-300 px-4">
	<Menubar.Menu>
		<Menubar.Trigger><Menu /></Menubar.Trigger>
		<Menubar.Content>
			<Button href="/editor/add" variant="ghost" class="w-full">Open Note</Button>
		</Menubar.Content>
	</Menubar.Menu>
	<div class="text-2xl">
		<Button variant="ghost" href="/editor">GlyphNote</Button>
	</div>
	<Menubar.Menu>
		<Menubar.Trigger><CircleUserRound /></Menubar.Trigger>
		<Menubar.Content>
			<Button href="/editor/shortcuts" type="button" variant="ghost" class="w-full"
				>Shortcuts</Button
			>
			<Button
				variant="ghost"
				type="submit"
				class="w-full text-left"
				form="signout-form"
				onclick={signout}>Sign Out</Button
			>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center gap-2">
		<Keyboard class="h-6 w-6" />
		<h1 class="text-3xl font-bold">Keyboard Shortcuts & Formatting</h1>
	</div>

	<div class="grid gap-6">
		<Card>
			<CardHeader>
				<CardTitle>Text Formatting Shortcuts</CardTitle>
				<CardDescription>Keyboard shortcuts for basic text formatting</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid gap-4">
					{#each textFormatting as item, i}
						<div class="hover:bg-muted/50 flex items-center justify-between rounded-lg p-2">
							<div>
								<h3 class="font-medium">{item.name}</h3>
								<p class="text-muted-foreground text-sm">{item.description}</p>
							</div>
							<kbd class="bg-muted rounded-md px-2 py-1 text-sm">{item.shortcut}</kbd>
						</div>
						{#if i < textFormatting.length - 1}
							<Separator />
						{/if}
					{/each}
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Text Alignment</CardTitle>
				<CardDescription>Options for aligning your text</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid gap-4">
					{#each textAlignment as item, i}
						<div class="hover:bg-muted/50 flex items-center justify-between rounded-lg p-2">
							<div>
								<h3 class="font-medium">{item.name}</h3>
								<p class="text-muted-foreground text-sm">{item.description}</p>
							</div>
						</div>
						{#if i < textAlignment.length - 1}
							<Separator />
						{/if}
					{/each}
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Text Colors</CardTitle>
				<CardDescription>Available colors for your text</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
					{#each textColors as item}
						<div class="hover:bg-muted/50 flex items-center gap-2 rounded-lg p-2">
							<div class="h-4 w-4 rounded-full {item.color} border-border border"></div>
							<span class="font-medium">{item.name}</span>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>
</div>
