import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const session = await locals.auth.validate();

	if (!session?.user) {
		throw redirect(302, `/auth/login?next=${url.pathname}`);
	}
}) satisfies LayoutServerLoad;
