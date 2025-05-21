import { notes } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { json, error as kitError } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		a;
		throw kitError(401, 'Unauthorized');
	}
	try {
		const { noteId } = await request.json();
		await db.delete(notes).where(eq(notes.id, noteId));
		return json({ message: 'Note deleted successfully' });
	} catch (e: any) {
		throw kitError(500, e.message ?? 'Internal Server Error');
	}
};
