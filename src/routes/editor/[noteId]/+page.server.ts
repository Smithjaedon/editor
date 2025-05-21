import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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
