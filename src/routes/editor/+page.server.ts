import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(400, {
				error: error.message
			});
		}

		throw redirect(303, '/login');
	},
	signOut: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(400, {
				error: error.message
			});
		}

		throw redirect(303, '/');
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	const notes = await getNotes(locals.user.id);

	return {
		notes
	};
};

async function getNotes(userId: string) {
	console.log('lol', userId);
	const { data, error } = await supabase.from('notes').select('*').eq('userid', userId); // 👈 filter by userId

	if (error) {
		console.error('Error fetching notes:', error.message);
		return [];
	}

	return data;
}
