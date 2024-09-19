import prisma from '$lib/server/prisma';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const orders = await prisma.order.findMany({
		include: {
			items: {
				include: {
					variant: {
						include: {
							images: true,
							product: {
								include: {
									category: true,
									featuredImage: true
								}
							}
						}
					}
				}
			}
		}
	});

	return { orders };
};

export const actions: Actions = {
	'update-status': async ({ request }) => {
		console.log('works');

		return {
			success: 'true'
		};
	}
};
