import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const actions: Actions = {
	saveNote: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const content = formData.get('content');
		const title = formData.get('title');
		let titleString = title as string;
		if (!titleString) {
			titleString = 'Untitled';
		}

		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser();

		if (userError || !user) {
			throw redirect(302, '/');
		}

		try {
			await db.insert(notes).values({
				content: content as string,
				title: titleString,
				userid: user.id
			});
		} catch (err) {
			console.error('Error saving note:', err);
			return fail(400, {
				error: 'Failed to save note'
			});
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
				error: 'Failed to delete note'
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
