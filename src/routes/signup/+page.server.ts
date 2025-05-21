import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	signup: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const { error } = await supabase.auth.signUp({
			email: email as string,
			password: password as string
		});
		if (error) {
			return fail(400, { error: error.message });
		}
		redirect(302, '/');
	}
};
