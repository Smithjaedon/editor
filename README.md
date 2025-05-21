# GlyphNote

GlyphNote is a modern markdown-based note editor built with SvelteKit, Supabase, and ShadCN. It offers a clean split-view interface for writing and previewing markdown notes. The project focuses on speed, security, and extensibility with planned real-time collaboration features.

## Features

- Markdown Split View (edit + preview)
- Authentication with Supabase
- CRUD Notes (Create, Read, Update, Delete)
- Styled with TailwindCSS and ShadCN UI
- Secure server-side logic using form actions
- Auto Save
- Markdown rendering with `marked`

## Why I Built This

GlyphNote was built to explore how modern full-stack tools like SvelteKit, Supabase, and Drizzle can power a minimal note editor. It emphasizes a smooth writing experience, Markdown support, and server-first security.

## What I Learned

### 1. Server-Side Authentication

I encountered challenges trying to move authentication logic from the client to the server. Using SvelteKit form actions allowed me to securely handle auth flows without exposing logic on the client.

### 2. Real-Time Functionality

Real-time syncing turned out to be more complex than expected. I'm currently working on a better approach using Supabase Realtime and structured state management.

## Tech Stack

| Layer    | Tool                        |
| -------- | --------------------------- |
| Frontend | SvelteKit, ShadCN, Tailwind |
| Backend  | Supabase (Auth + Database)  |
| ORM      | Drizzle ORM                 |
| Markdown | `marked`                    |

## Features to be completed

- Real-time collaboration
- Working Undo Data Structure

## Author

Built by Jaedon Smith
