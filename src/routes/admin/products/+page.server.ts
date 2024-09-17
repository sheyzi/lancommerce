import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import prisma from '$lib/server/prisma';

const include = {
	variants: true,
	featuredImage: true,
	category: true,
	_count: {
		select: {
			variants: true
		}
	}
};

export const load: PageServerLoad = async () => {
	const products = await prisma.product.findMany({
		include,
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		products
	};
};

export const actions: Actions = {
	search: async ({ request }) => {
		const formData = await request.formData();

		const search = formData.get('search') as string;

		if (search.trim().length === 0) {
			return fail(400, { message: 'Search term must be at least 1 character long' });
		}

		const cleanedSearch = search.replace(/\s+/g, ' ').trim();

		const products = await prisma.product.findMany({
			include,
			orderBy: {
				_relevance: {
					fields: ['name', 'shortDescription'],
					search: cleanedSearch ? cleanedSearch.split(' ').join(' & ') : '',
					sort: 'desc'
				}
			}
		});

		return {
			products
		};
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { message: 'No product id provided' });
		}

		try {
			console.log(id);
			const category = await prisma.product.delete({
				where: {
					id: id.toString()
				}
			});

			return {
				message: 'Success',
				category
			};
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'There was an error deleting the category' });
		}
	}
};
