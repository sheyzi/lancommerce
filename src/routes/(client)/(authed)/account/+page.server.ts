import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import prisma from '$lib/server/prisma';
import type { orderWithItems } from '$lib/types/order.type';
import { fetchUser, getShippingFee } from '$lib/server/helpers';

const profileSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Invalid email' })
		.min(3, { message: 'Email is required' }),
	firstName: z
		.string({ required_error: 'First name is required' })
		.min(3, { message: 'First name is required' })
		.trim(),
	lastName: z
		.string({ required_error: 'Last name is required' })
		.min(3, { message: 'Last name is required' })
		.trim()
});

type Error = {
	email?: [string];
	firstName?: [string];
	lastName?: [string];
	server?: [string];
};

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) return redirect(302, '/auth/login?next=/account');

	const orders = await prisma.order.findMany({
		where: {
			userId: session.user.userId
		},
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
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const shippingFee = await getShippingFee();
	return {
		orders: orders as orderWithItems[],
		shippingFee
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	'manage-profile': async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) return fail(401, { message: 'Unauthorized' });
		const formData = await request.formData();

		const email = formData.get('email');
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');

		const dataToValidate = {
			...(email && { email }),
			...(firstName && { firstName }),
			...(lastName && { lastName })
		};

		try {
			const validatedData = profileSchema.parse(dataToValidate);

			const profile = await prisma.user.update({
				where: {
					id: session.user.userId
				},
				data: {
					...validatedData
				}
			});

			const updatedProfile = await fetchUser(profile.id);
			return {
				profile: updatedProfile
			};
		} catch (error) {
			let toSend = {
				message: 'An error occurred',
				errors: {} as Error
			};

			if (error instanceof z.ZodError) {
				toSend.message = 'Invalid data';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			return fail(500, toSend);
		}
	}
};
