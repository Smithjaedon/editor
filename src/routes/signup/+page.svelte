<script lang="ts">
	import type { PageData } from './$types';
	import SignupForm from '$lib/components/signup-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center">
	<SignupForm />
</div>
