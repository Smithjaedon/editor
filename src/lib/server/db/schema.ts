import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
	id: uuid('id').primaryKey().defaultRandom(), // uses gen_random_uuid()

	title: text('title').default('Untitled'),
	content: text('content'),
	createdAt: timestamp('created_at').defaultNow(),

	userid: uuid('userid')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});

export const users = pgTable('users', {
	id: uuid('id').primaryKey()
});
