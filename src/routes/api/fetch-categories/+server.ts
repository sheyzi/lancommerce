import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export const GET: RequestHandler = async () => {
	const categories = await prisma.category.findMany({
		include: {
			featuredImage: true
		}
	});

	return new Response(JSON.stringify(categories), {
		status: 200
	});
};
