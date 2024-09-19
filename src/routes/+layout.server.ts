import prisma from '$lib/server/prisma';
import { fetchUser } from '../lib/server/helpers';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	let user = null;

	if (session?.user) {
		user = await fetchUser(session.user.userId);
	}

	return {
		user: user
	};
};
