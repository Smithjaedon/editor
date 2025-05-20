<script lang="ts">
	import {
		Text,
		AlignCenter,
		AlignLeft,
		AlignRight,
		AlignJustify,
		CircleUserRound,
		Menu,
		Baseline
	} from 'lucide-svelte';

	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { marked } from 'marked';
	import { onDestroy, onMount } from 'svelte';

	let content = $state('');
	let preview = $state('');
	let title = $state('');

	const { data } = $props();
	const { notes } = data;

	function handleSubmit(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
		const submitter = event.submitter as HTMLButtonElement;
		if (submitter?.type !== 'submit' && !form.action.includes('saveNote')) {
			event.preventDefault();
		}
	}

	$effect(() => {
		preview = content;
		renderColorSyntax();
		renderAlignmentSyntax();
	});

	onMount(() => {
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
		preview = content;
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
		preview = content;
	}

	function renderColorSyntax() {
		preview = content.replace(/\{([^}]+)\}(.*?)\{\/\1\}/g, (match, type, content) => {
			if (['left', 'center', 'right', 'justify'].includes(type)) {
				return match;
			}
			return `<span style="color: ${type};">${content}</span>`;
		});
	}

	function renderAlignmentSyntax() {
		preview = preview.replace(/\{([^}]+)\}(.*?)\{\/\1\}/g, (match, type, content) => {
			if (['left', 'center', 'right', 'justify'].includes(type)) {
				return `<div style="text-align: ${type};">${content}</div>`;
			}
			return match;
		});
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
		renderColorSyntax();
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
	}
</script>

<form action="?/saveNote" method="POST" class="h-full" onsubmit={handleSubmit}>
	<div class="grid grid-rows-[61px_3rem_1fr] gap-0">
		<Menubar.Root
			class="mb-0 flex h-12 items-center justify-between rounded-none bg-neutral-300 px-4"
		>
			<Menubar.Menu>
				<Menubar.Trigger><Menu /></Menubar.Trigger>
				<Menubar.Content>
					<Button href="/editor/add" variant="ghost" class="w-full">Open Note</Button>
					<Button type="submit" variant={'ghost'} class="w-full" form="savenote-form"
						>Save Note</Button
					>
				</Menubar.Content>
			</Menubar.Menu>
			<div class="text-2xl">
				<Button variant="ghost" href="/editor">GlyphNote</Button>
			</div>
			<Menubar.Menu>
				<Menubar.Trigger><CircleUserRound /></Menubar.Trigger>
				<Menubar.Content>
					<Button variant="ghost" type="submit" class="w-full text-left" form="signout-form"
						>Sign Out</Button
					>
					<form id="signout-form" action="?/signout" method="POST" class="hidden"></form>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
		<Menubar.Root class="mt-0">
			<Input
				type="text"
				name="title"
				placeholder="title..."
				class="h-8 max-w-3xs rounded-md"
				bind:value={title}
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
							id="textarea"
							name="content"
							bind:value={content}
							class="textarea textarea-ghost h-full w-full resize-none focus:border-transparent focus:ring-0 focus:outline-none"
						></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>
</form>
<form id="signout-form" action="?/signout" method="POST" class="hidden"></form>
<form id="savenote-form" action="?/saveNote" method="POST" class="hidden">
	<input type="hidden" name="content" bind:value={content} />
	<input type="hidden" name="title" bind:value={title} />
</form>
