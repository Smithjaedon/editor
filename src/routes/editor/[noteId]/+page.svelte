<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import {
		Trash2,
		AlignCenter,
		AlignLeft,
		AlignRight,
		AlignJustify,
		CircleUserRound,
		SquarePlus
	} from 'lucide-svelte';

	import { marked } from 'marked';
	import { onDestroy, onMount } from 'svelte';

	const { data } = $props();
	const { notes, note } = data;

	let content = $state<string>('');
	let preview = $state('');

	function handleSubmit(event: SubmitEvent) {
		const form = event.target as HTMLFormElement;
		const submitter = event.submitter as HTMLButtonElement;
		if (submitter?.type !== 'submit') {
			event.preventDefault();
		}
	}

	function taketo(id: string) {
		goto(`/editor/${id}`);
	}

	function updatePreview() {
		if (!content) {
			preview = '';
			return;
		}
		preview = content;
		renderColorSyntax();
		renderAlignmentSyntax();
	}

	onMount(() => {
		content = note?.content as string;
		updatePreview();

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
		updatePreview();
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
	}

	function renderColorSyntax() {
		if (!content) {
			preview = '';
			return;
		}
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
		updatePreview();
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
		updatePreview();
	}
</script>

<form action="?/editNote" method="POST" class="h-full" onsubmit={handleSubmit}>
	<div class="grid grid-rows-[61px_3rem_1fr]">
		<div class="navbar bg-base-300 sticky top-0 z-10 w-screen shadow-md">
			<div class="navbar-start">
				<div class="dropdown">
					<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
					</div>
					<ul
						tabindex="0"
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li><a href="/editor/add">Open</a></li>
						<li><button type="submit" class="w-full text-left">Save</button></li>
					</ul>
				</div>
			</div>
			<div class="navbar-center">
				<a class="btn btn-ghost text-xl" href="/editor">GlyphNote</a>
			</div>
			<div class="navbar-end">
				<a class="btn btn-ghost" href="/editor">
					<div class="flex items-center justify-center gap-x-2">
						<SquarePlus />
						Add Note
					</div>
				</a>
				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn btn-ghost btn-circle m-1">
						<CircleUserRound />
					</div>
					<ul
						tabindex="0"
						class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
					>
						<li>
							<button type="submit" class="w-full text-left" form="signout-form">Sign Out</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="bg-base-200 h-full shadow-sm">
			<ul class="menu menu-horizontal bg-base-200 rounded-box">
				<li>
					<input class="input h-8" type="text" name="title" value={note?.title} />
				</li>
				<li>
					<button type="button" popovertarget="popover-2" style="anchor-name:--anchor-2">
						Colors
					</button>
					<ul
						class="dropdown menu rounded-box bg-base-100 w-52 shadow-sm"
						popover
						id="popover-2"
						style="position-anchor:--anchor-2"
					>
						<li><a class="font-bold text-black" onclick={() => applyColor('black')}>black</a></li>
						<li><a class="font-bold text-gray-500" onclick={() => applyColor('gray')}>gray</a></li>
						<li><a class="font-bold text-red-500" onclick={() => applyColor('red')}>red</a></li>
						<li>
							<a class="font-bold text-orange-500" onclick={() => applyColor('orange')}>orange</a>
						</li>
						<li>
							<a class="font-bold text-yellow-500" onclick={() => applyColor('yellow')}>yellow</a>
						</li>
						<li>
							<a class="font-bold text-green-500" onclick={() => applyColor('green')}>green</a>
						</li>
						<li><a class="font-bold text-blue-500" onclick={() => applyColor('blue')}>blue</a></li>
						<li>
							<a class="font-bold text-purple-500" onclick={() => applyColor('purple')}>purple</a>
						</li>
						<li><a class="font-bold text-pink-500" onclick={() => applyColor('pink')}>pink</a></li>
					</ul>
				</li>
				<li>
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => applyAlign('left')}>
						<AlignLeft size={16} />
					</button>
				</li>
				<li>
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => applyAlign('center')}>
						<AlignCenter size={16} />
					</button>
				</li>
				<li>
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => applyAlign('right')}>
						<AlignRight size={16} />
					</button>
				</li>
				<li>
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => applyAlign('justify')}>
						<AlignJustify size={16} />
					</button>
				</li>
			</ul>
		</div>
		<div class="bg-base-100 h-[calc(100vh-109px)]">
			<div class="h-full">
				<div class="h-full overflow-hidden">
					<div id="window" class="grid h-full grid-cols-[1fr_auto_1fr]">
						<div id="left" class="prose preview overflow-auto p-6">
							{@html marked(preview)}
						</div>
						<div id="divider" class="divider divider-horizontal"></div>

						<textarea
							id="right"
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
