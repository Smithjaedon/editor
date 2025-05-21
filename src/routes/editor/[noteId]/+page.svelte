<script lang="ts">
	import {
		Text,
		AlignCenter,
		AlignLeft,
		AlignRight,
		AlignJustify,
		CircleUserRound,
		Menu,
		Baseline,
		Share2
	} from 'lucide-svelte';

	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { marked } from 'marked';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let content = $state('');
	let preview = $state('');
	let title = $state('');
	let timeout: NodeJS.Timeout | null = null;
	let saving = $state(false);

	// -------
	let undo: string[] = [];
	let redo: string[] = [];
	let isUndoRedo = false;
	// -------

	const { data } = $props();
	const { note } = data;
	const noteId = note?.id;

	function autoSave() {
		if (timeout) clearTimeout(timeout);
		saving = true;
		timeout = setTimeout(async () => {
			if (!isUndoRedo) {
				if (redo.length > 0) {
					redo = [];
				}
				undo.push(content);
			}

			try {
				const res = await fetch('/api/save-note', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ noteId, title, content })
				});

				if (!res.ok) {
					const data = await res.json();
					console.error('Failed to save note:', data.error || res.statusText);
				} else {
					console.log('Auto-saved successfully');
					saving = false;
				}
			} catch (err) {
				console.error('Auto-save error:', err);
			}
		}, 1000);
	}

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

	function updatePreview() {
		if (!content) {
			preview = '';
			return;
		}

		let rendered = content.replace(/\{([^}]+)\}(.*?)\{\/\1\}/gs, (match, type, body) => {
			if (['left', 'center', 'right', 'justify'].includes(type)) return match;
			return `<span style="color: ${type};">${body}</span>`;
		});

		rendered = rendered.replace(
			/\{(left|center|right|justify)\}(.*?)\{\/\1\}/gs,
			(_, align, body) => {
				return `<div style="text-align: ${align};">${body}</div>`;
			}
		);

		preview = rendered;
	}

	function combinedInputs() {
		isUndoRedo = false;
		updatePreview();
		autoSave();
	}

	const handleUndo = () => {
		if (undo.length > 0) {
			isUndoRedo = true;
			redo.push(content);
			content = undo.pop() as string;
			updatePreview();
		}
	};

	const handleRedo = () => {
		if (redo.length > 0) {
			isUndoRedo = true;
			undo.push(content);
			content = redo.pop() as string;
			updatePreview();
		}
	};

	onMount(() => {
		content = note?.content as string;
		title = note?.title as string;

		if (!content) {
			undo = [''];
		}

		updatePreview();
		autoSave();

		const handleKey = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
				e.preventDefault();
				applyWrapper('**');
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
				e.preventDefault();
				applyWrapper('*');
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
				e.preventDefault();
				applyWrapper('~~');
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				applyWrapper('`');
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
				e.preventDefault();
				applyWrapper('==');
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'q') {
				e.preventDefault();
				applyStart('> ');
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
				e.preventDefault();
				handleUndo();
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey) {
				e.preventDefault();
				handleRedo();
			}
		};

		window.addEventListener('keydown', handleKey);

		onDestroy(() => {
			window.removeEventListener('keydown', handleKey);
		});
	});

	function applyWrapper(wrapper: string) {
		const txtarea = document.getElementById('right') as HTMLTextAreaElement;
		if (!content) return;

		const start = txtarea.selectionStart;
		const end = txtarea.selectionEnd;
		let selected = txtarea.value.slice(start, end);

		const before = txtarea.value.slice(0, start);
		const after = txtarea.value.slice(end);

		const wrapperLength = wrapper.length;
		const isWrapped = selected.startsWith(wrapper) && selected.endsWith(wrapper);

		if (isWrapped) {
			selected = selected.slice(wrapperLength, -wrapperLength);
			txtarea.value = `${before}${selected}${after}`;
			txtarea.selectionStart = start;
			txtarea.selectionEnd = end - 2 * wrapperLength;
		} else {
			txtarea.value = `${before}${wrapper}${selected}${wrapper}${after}`;
			txtarea.selectionStart = start;
			txtarea.selectionEnd = end + 2 * wrapperLength;
		}

		content = txtarea.value;
		updatePreview();
		autoSave();
	}

	function applyStart(wrapper: string) {
		const txtarea = document.getElementById('right') as HTMLTextAreaElement;

		if (!content) return;

		const start = txtarea.selectionStart;
		const end = txtarea.selectionEnd;
		let selected = txtarea.value.slice(start, end);

		const before = txtarea.value.slice(0, start);
		const after = txtarea.value.slice(end);

		const wrapperLength = wrapper.length;
		const isWrapped = selected.startsWith(wrapper);

		if (isWrapped) {
			selected = selected.slice(wrapperLength);
			txtarea.value = `${before}${selected}${after}`;
			txtarea.selectionStart = start;
			txtarea.selectionEnd = end - wrapperLength;
		} else {
			txtarea.value = `${before}${wrapper}${selected}${after}`;
			txtarea.selectionStart = start + wrapperLength;
			txtarea.selectionEnd = end + wrapperLength;
		}

		content = txtarea.value;
		updatePreview();
		autoSave();
	}

	function applyColor(color: string) {
		const txtarea = document.getElementById('right') as HTMLTextAreaElement;

		if (!content) return;

		const start = txtarea.selectionStart;
		const end = txtarea.selectionEnd;
		let selected = txtarea.value.slice(start, end);

		const colorWrapper = `{${color}}`;
		const colorCloser = `{/${color}}`;

		const before = txtarea.value.slice(0, start);
		const after = txtarea.value.slice(end);

		const colorRegex = new RegExp(`{${color}}(.*?){/${color}}`);
		if (colorRegex.test(selected)) {
			selected = selected.replace(colorRegex, '$1');
		} else {
			selected = selected.replace(new RegExp(`\\{${color}\\}(.*?)\\{/${color}\\}`, 'g'), '$1');
			selected = `${colorWrapper}${selected}${colorCloser}`;
		}

		txtarea.value = `${before}${selected}${after}`;
		txtarea.selectionStart = start;
		txtarea.selectionEnd = start + selected.length;
		content = txtarea.value;
		updatePreview();
		autoSave();
	}

	function applyAlign(align: string) {
		const txtarea = document.getElementById('right') as HTMLTextAreaElement;
		if (!content) return;

		const start = txtarea.selectionStart;
		const end = txtarea.selectionEnd;
		let selected = txtarea.value.slice(start, end);

		const alignWrapper = `{${align}}`;
		const alignCloser = `{/${align}}`;

		const before = txtarea.value.slice(0, start);
		const after = txtarea.value.slice(end);

		const alignRegex = new RegExp(`\\{${align}\\}(.*?)\\{/${align}\\}`);
		if (alignRegex.test(selected)) {
			selected = selected.replace(alignRegex, '$1');
		} else {
			selected = `${alignWrapper}${selected}${alignCloser}`;
		}

		txtarea.value = `${before}${selected}${after}`;
		txtarea.selectionStart = start;
		txtarea.selectionEnd = start + selected.length;

		content = txtarea.value;
		updatePreview();
		autoSave();
	}
</script>

<div class="grid grid-rows-[61px_3rem_1fr] gap-0">
	<Menubar.Root
		class="mb-0 flex h-12 items-center justify-between rounded-none bg-neutral-300 px-4"
	>
		<!-- Left: Menu -->
		<div class="flex items-center">
			<Menubar.Menu>
				<Menubar.Trigger><Menu /></Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						<Button href="/editor/add" variant="ghost" class="w-full">Open Note</Button>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</div>

		<!-- Center: Brand -->
		<div class="flex flex-1 justify-center">
			<Button variant="ghost" href="/editor" class="text-2xl">GlyphNote</Button>
		</div>

		<!-- Right: Saving + User -->
		<div class="flex items-center gap-2">
			<Button variant="ghost"><Share2 /></Button>
			<Button variant="ghost" class="min-w-[80px]">
				{#if saving}<div role="status">
						<svg
							aria-hidden="true"
							class="h-8 w-8 animate-spin fill-neutral-600 text-gray-200 dark:text-gray-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span class="sr-only">Loading...</span>
					</div>{/if}
				{saving ? 'Saving...' : 'Saved'}</Button
			>
			<Menubar.Menu>
				<Menubar.Trigger><CircleUserRound /></Menubar.Trigger>
				<Menubar.Content>
					<Button href="/editor/shortcuts" type="button" variant="ghost" class="w-full"
						>Shortcuts</Button
					>
					<Button variant="ghost" type="submit" class="w-full text-left" onclick={signout}
						>Sign Out</Button
					>
				</Menubar.Content>
			</Menubar.Menu>
		</div>
	</Menubar.Root>
	<Menubar.Root class="mt-0">
		<Input
			type="text"
			name="title"
			placeholder="title..."
			class="h-8 max-w-3xs rounded-md"
			bind:value={title}
			oninput={autoSave}
		/>
		<Menubar.Menu>
			<Menubar.Trigger><Baseline /></Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item onclick={() => applyColor('black')} class="text-font text-black"
					>Black</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('gray')} class="text-font text-gray-500"
					>Gray</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('red')} class="text-font text-red-500"
					>Red</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('orange')} class="text-font text-orange-500"
					>Orange</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('yellow')} class="text-font text-yellow-500"
					>Yellow</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('green')} class="text-font text-green-500"
					>Green</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('blue')} class="text-font text-blue-500"
					>Blue</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('purple')} class="text-font text-purple-500"
					>Purple</Menubar.Item
				>
				<Menubar.Item onclick={() => applyColor('pink')} class="text-font text-pink-500"
					>Pink</Menubar.Item
				>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger><Text /></Menubar.Trigger>
			<Menubar.Content class="w-fit">
				<div class="flex items-center justify-center">
					<Menubar.Item onclick={() => applyAlign('left')} class="text-font"
						><AlignLeft size={16} /></Menubar.Item
					>
					<Menubar.Item onclick={() => applyAlign('center')} class="text-font"
						><AlignCenter size={16} /></Menubar.Item
					>
					<Menubar.Item onclick={() => applyAlign('right')} class="text-font"
						><AlignRight size={16} /></Menubar.Item
					>
					<Menubar.Item onclick={() => applyAlign('justify')} class="text-font"
						><AlignJustify size={16} /></Menubar.Item
					>
				</div>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
	<div class="bg-base-100 h-[calc(100vh-109px)]">
		<div class="h-full">
			<div class="h-full overflow-hidden">
				<div id="window" class="grid h-full grid-cols-[1fr_auto_1fr]">
					<div id="left" class="prose preview overflow-auto p-6">
						{@html marked(preview)}
					</div>
					<Separator orientation="vertical" />

					<textarea
						id="right"
						name="content"
						bind:value={content}
						oninput={combinedInputs}
						class="textarea textarea-ghost h-full w-full resize-none p-6 focus:border-transparent focus:ring-0 focus:outline-none"
					></textarea>
				</div>
			</div>
		</div>
	</div>
</div>
