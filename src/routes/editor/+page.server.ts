import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	saveNote: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const content = formData.get('content');
		const title = formData.get('title');

		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			throw redirect(302, '/');
		}

		const { error } = await supabase.from('notes').insert({
			content: content,
			title: title,
			userid: user.id
		});
		if (error) {
			console.error('Error signing out:', error.message);
		}
	},
	signout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(400, {
				error: error.message
			});
		}

		throw redirect(302, '/');
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
	try {
		const data = await db.select().from(notes).where(eq(notes.userid, userId));
		return data;
	} catch (err) {
		console.error('Error fetching notes:', err);
		return [];
	}
}
