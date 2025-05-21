import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

// use server-side Supabase client from locals for proper cookie clearing

export const POST: RequestHandler = async ({ locals }) => {
	await locals.supabase.auth.signOut();
	return json({ message: 'Signed out successfully' });
};
