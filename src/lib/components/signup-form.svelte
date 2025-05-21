<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Signup</Card.Title>
		<Card.Description>Enter your email below to register your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/signup">
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" name="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
					</div>
					<Input id="password" type="password" name="password" required />
				</div>
				<Button type="submit" class="w-full">Signup</Button>
			</div>
		</form>
		<div class="mt-4 text-center text-sm">
			You already have an account?
			<a href="/" class="underline"> Log In </a>
		</div>
	</Card.Content>
</Card.Root>
