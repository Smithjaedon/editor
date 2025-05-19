import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';
import { notes } from '$lib/server/db/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const actions: Actions = {
	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(302, '/');
	},
	deleteNote: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const noteId = formData.get('noteId');
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			throw redirect(302, '/');
		}

		try {
			await db.delete(notes).where(and(eq(notes.id, noteId as string), eq(notes.userid, user.id)));
		} catch (err) {
			console.error('Error deleting note:', err);
			return fail(400, {
				noteId,
				error: 'Error deleting note'
			});
		}
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
