import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const actions: Actions = {
	editNote: async ({ params, request, locals: { supabase } }) => {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		if (!user || error) {
			throw redirect(302, '/');
		}

		const id = params.noteId;
		const formData = await request.formData();
		const title = formData.get('title');
		const content = formData.get('content');

		if (!title || !content) {
			return fail(400, { title, content, error: 'Title and content are required' });
		}

		try {
			await db
				.update(notes)
				.set({ title: title as string, content: content as string, modifiedAt: new Date() })
				.where(and(eq(notes.id, id), eq(notes.userid, user.id)));
		} catch (err) {
			console.error('Error editing note:', err);
			return fail(400, { error: 'Failed to edit note' });
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
	getNote: async ({ params }) => {
		const note = await getNote(params.noteId);
		return {
			note
		};
	}
};

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}
	let note;
	if (params.noteId) {
		note = await getNote(params.noteId);
	}

	const notes = await getNotes(locals.user.id);

	return {
		notes,
		note
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

async function getNote(noteId: string) {
	const data = await db.select().from(notes).where(eq(notes.id, noteId));
	return data[0];
}
