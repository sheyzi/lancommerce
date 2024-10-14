import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {

	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = 20;

	const productsPromise = prisma.product.findMany({
		include: { variants: true, featuredImage: true, category: true },
		skip: (page - 1) * pageSize,
		take: pageSize,
	});

	const totalProductsPromise = prisma.product.count();

	const [products, totalProducts] = await Promise.all([productsPromise, totalProductsPromise]);

	return {
		products,
		page,
		totalPages: Math.ceil(totalProducts / pageSize),
	};
};
