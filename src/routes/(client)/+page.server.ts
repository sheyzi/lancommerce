import { fail, type Actions, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { fetchUser } from '../../lib/server/helpers';

export const load: PageServerLoad = async () => {
	const products = await prisma.product.findMany({
		where: {
			variants: {
				some: {
					stock: {
						gte: 0
					}
				}
			}
		},
		include: {
			category: true,
			featuredImage: true,
			variants: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		products
	};
};

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(400);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);

		throw redirect(302, '/auth/login');
	},

	toggleFavourite: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session?.user) return fail(400, { message: 'Not logged in' });

		const formData = await request.formData();
		const productId = formData.get('productId') as string;

		const product = await prisma.product.findUnique({
			where: {
				id: productId
			}
		});

		if (!product) return fail(404, { message: 'Product not found' });

		const userId = session.user.userId;

		const isFavourite = await prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				favourites: {
					where: {
						id: productId
					}
				}
			}
		});

		if (isFavourite?.favourites.length) {
			await prisma.user.update({
				where: {
					id: userId
				},
				data: {
					favourites: {
						disconnect: {
							id: productId
						}
					}
				}
			});

			const user = await fetchUser(userId);

			return {
				message: 'Removed from favourites',
				type: 'disconnect',
				productId,
				user
			};
		} else {
			await prisma.user.update({
				where: {
					id: userId
				},
				data: {
					favourites: {
						connect: {
							id: productId
						}
					}
				}
			});

			const user = await fetchUser(userId);

			return {
				message: 'Added to favourites',
				type: 'connect',
				productId,
				user
			};
		}
	}
} satisfies Actions;
