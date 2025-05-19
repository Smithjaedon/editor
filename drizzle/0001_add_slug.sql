ALTER TABLE notes ADD COLUMN slug TEXT NOT NULL DEFAULT 'untitled';
ALTER TABLE notes ADD CONSTRAINT notes_slug_unique UNIQUE (slug);

-- Update existing notes with slugs based on their titles
UPDATE notes 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug = 'untitled';

-- Remove the default value after migration
ALTER TABLE notes ALTER COLUMN slug DROP DEFAULT; 