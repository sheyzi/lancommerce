import prisma from '$lib/server/prisma';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const users = await prisma.user.findMany({
		include: {
			orders: {
				include: {
					items: {
						include: {
							variant: {
								include: {
									images: true,
									product: {
										include: {
											category: true
										}
									}
								}
							}
						}
					}
				}
			},
			favourites: true
		}
	});

	return { users };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();

		const userId = formData.get('id');

		if (!userId) {
			return fail(400, { message: 'No user id provided' });
		}
		try {
			const user = await prisma.user.delete({
				where: {
					id: userId.toString()
				}
			});

			return { message: 'success', user };
		} catch (e) {
			return fail(500, { message: 'There was an error deleting the user' });
		}
	}
};
