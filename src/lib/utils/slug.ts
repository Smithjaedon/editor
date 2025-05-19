export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
		.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
		.substring(0, 50); // Limit length
}

export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
	let uniqueSlug = slug;
	let counter = 1;

	while (existingSlugs.includes(uniqueSlug)) {
		uniqueSlug = `${slug}-${counter}`;
		counter++;
	}

	return uniqueSlug;
}
