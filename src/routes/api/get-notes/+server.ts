import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { json, error as kitError } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { userId } = await request.json();
		const data = await db.select().from(notes).where(eq(notes.userid, userId));
		return json(data);
	} catch (e: unknown) {
		if (e instanceof Error) {
			throw kitError(500, e.message ?? 'Internal Server Error');
		}
		throw kitError(500, 'Internal Server Error');
	}
};
