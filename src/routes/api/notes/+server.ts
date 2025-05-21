import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { notes } from '$lib/server/db/schema';

export async function POST({ request }) {
	const { userId } = await request.json();
	if (!userId) {
		return json({ error: 'Missing userId' });
	}
	const notesTable = await db.select().from(notes).where(eq(notes.userid, userId));
	return json(notesTable);
}
