import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = 20;
	const categorySlug = url.searchParams.get('category') || undefined;

	const where = categorySlug ? { category: { slug: categorySlug } } : {};

	const productsPromise = prisma.product.findMany({
		where,
		include: { variants: true, featuredImage: true, category: true },
		skip: (page - 1) * pageSize,
		take: pageSize,
	});

	const totalProductsPromise = prisma.product.count({ where });
	const categoriesPromise = prisma.category.findMany();

	const [products, totalProducts, categories] = await Promise.all([
		productsPromise,
		totalProductsPromise,
		categoriesPromise
	]);

	return {
		products,
		categories,
		page,
		totalPages: Math.ceil(totalProducts / pageSize),
		currentCategory: categorySlug
	};
};
