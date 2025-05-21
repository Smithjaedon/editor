import type { RequestHandler } from './$types';
import { json, error as kitError } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { notes } from '$lib/server/db/schema';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { noteId, content, title } = await request.json();
	const user = locals.user;

	if (!user) {
		throw kitError(401, 'Unauthorized');
	}

	try {
		await db
			.update(notes)
			.set({ content, title, modifiedAt: new Date() })
			.where(eq(notes.id, noteId));
		return json({ message: 'Note updated successfully' });
	} catch (e: any) {
		throw kitError(500, e.message ?? 'Internal Server Error');
	}
};
