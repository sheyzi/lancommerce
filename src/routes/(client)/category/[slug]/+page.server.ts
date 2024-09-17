import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const slug = params.slug;

	const category = await prisma.category.findUnique({
		where: {
			slug
		},
		include: {
			products: {
				where: {
					variants: {
						some: {
							stock: {
								gte: 0
							}
						}
					}
				},
				include: { variants: true, featuredImage: true, category: true }
			},
			featuredImage: true
		}
	});

	if (!category) {
		throw error(404, {
			message: 'Not Found!'
		});
	}
	return {
		category
	};
}) satisfies PageServerLoad;
