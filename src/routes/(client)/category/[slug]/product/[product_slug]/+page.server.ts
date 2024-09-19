import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load = (async ({ params }) => {
	const slug = params.product_slug;
	const category_slug = params.slug;

	if (!slug || !category_slug) {
		throw error(404, 'Not found');
	}

	const product = await prisma.product.findUnique({
		where: {
			slug
		},
		include: {
			featuredImage: true,
			variants: {
				include: {
					images: true,
					product: true
				}
			},
			category: true
		}
	});

	const relatedProducts = await prisma.product.findMany({
		where: {
			category: {
				slug: category_slug
			},
			slug: {
				not: slug
			}
		},
		include: {
			featuredImage: true,
			category: true,
			variants: true,
			_count: {
				select: {
					variants: true
				}
			}
		}
	});

	return {
		product,
		relatedProducts
	};
}) satisfies PageServerLoad;
