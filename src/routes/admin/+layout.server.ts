import { redirect } from '@sveltejs/kit';
import { Role } from '$lib/types/roles.types';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const session = await locals.auth.validate();

	if (!session?.user) {
		throw redirect(302, `/auth/login?next=${url.pathname}`);
	} else if (session?.user.role !== Role.ADMIN) {
		throw redirect(302, `/?message=You are not authorized to view the page&messageType=error`);
	}
}) satisfies LayoutServerLoad;
