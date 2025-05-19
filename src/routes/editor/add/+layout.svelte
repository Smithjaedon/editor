<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from '../add/$types';
	import { CircleUserRound } from 'lucide-svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="navbar bg-base-300 sticky top-0 z-10 w-screen shadow-md">
	<div class="navbar-start">
		<a class="btn btn-ghost text-xl" href="/editor">GlyphNote</a>
	</div>
	<div class="navbar-end">
		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn btn-ghost btn-circle m-1">
				<CircleUserRound />
			</div>
			<ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
				<li>
					<button type="submit" class="w-full text-left" form="signout-form">Sign Out</button>
				</li>
			</ul>
		</div>
	</div>
</div>
{@render children()}
