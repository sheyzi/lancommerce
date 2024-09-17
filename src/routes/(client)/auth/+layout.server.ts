import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export let load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();

	const next = url.searchParams.get('next');

	let nextUrl = next ? next : '/';

	if (nextUrl.length > 1) {
		nextUrl = nextUrl + '/';
	}
	// console.log('ah');
	if (session) {
		throw redirect(302, nextUrl + '?message=You are logged in!');
	}
};
