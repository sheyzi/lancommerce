import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import prisma from '$lib/server/prisma';

const addressSchema = z.object({
	firstName: z
		.string({ required_error: 'First name is required' })
		.trim()
		.min(3, { message: 'First name is required' }),
	lastName: z
		.string({ required_error: 'Last name is required' })
		.trim()
		.min(3, { message: 'Last name is required' }),
	phoneNumber: z
		.string({ required_error: 'Phone number is required' })
		.regex(
			/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
			{
				message: 'Invalid phone number'
			}
		),
	street: z
		.string({ required_error: 'Street is required' })
		.trim()
		.min(3, { message: 'Street is required' }),
	city: z
		.string({ required_error: 'City is required' })
		.trim()
		.min(3, { message: 'City is required' }),
	state: z
		.string({ required_error: 'State is required' })
		.trim()
		.min(3, { message: 'State is required' }),
	zipCode: z
		.string({ required_error: 'Zip code is required' })
		.trim()
		.min(3, { message: 'Zip code is required' })
		.optional(),
	country: z
		.string({ required_error: 'Country is required' })
		.trim()
		.min(3, { message: 'Country is required' })
});

type Error = {
	firstName?: [string];
	lastName?: [string];
	phoneNumber?: [string];
	street?: [string];
	city?: [string];
	state?: [string];
	zipCode?: [string];
	country?: [string];
	server?: [string];
};

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	'manage-address': async ({ request, locals, fetch }) => {
		const session = await locals.auth.validate();

		if (!session) {
			return fail(401, {
				message: 'You are not logged in'
			});
		}
		const formData = await request.formData();

		const firstName = formData.get('first-name');
		const lastName = formData.get('last-name');
		const phoneNumber = formData.get('phone-number');
		const street = formData.get('street');
		const city = formData.get('city');
		const state = formData.get('state');
		const zipCode = formData.get('zip-code');
		const country = formData.get('country');

		const dataToValidate = {
			...(firstName && { firstName }),
			...(lastName && { lastName }),
			...(phoneNumber && { phoneNumber }),
			...(street && { street }),
			...(city && { city }),
			...(state && { state }),
			...(zipCode && { zip: zipCode }),
			...(country && { country })
		};

		try {
			const validatedData = addressSchema.parse(dataToValidate);

			const address = await prisma.address.create({
				data: {
					...validatedData,
					user: {
						connect: {
							id: session.user.userId
						}
					},
					isDefault: session.user.addresses?.length === 0 ? true : false
				}
			});

			return {
				message: 'Address added successfully',
				address
			};
		} catch (e) {
			let toSend = {
				message: 'There was an error',
				errors: {} as Error
			};

			if (e instanceof z.ZodError) {
				toSend.message = 'There is an error in the form data';
				toSend.errors = e.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.log(e);
			return fail(500, toSend);
		}
	}
};
