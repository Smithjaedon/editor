import { notes } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { json, error as kitError } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { title, content } = await request.json();
	let titleString = title as string;
	if (titleString === '') {
		titleString = 'Untitled';
	}
	const user = locals.user;

	if (!user) {
		throw kitError(401, 'Unauthorized');
	}

	try {
		await db.insert(notes).values({
			title: titleString,
			content,
			userid: user.id
		});
		return json({ message: 'Note added successfully' });
	} catch (e: any) {
		throw kitError(500, e.message ?? 'Internal Server Error');
	}
};
