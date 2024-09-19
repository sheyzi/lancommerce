import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { fetchUser } from '$lib/server/helpers';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

const schema = z.object({
	email: z
		.string({
			required_error: 'Email is required'
		})
		.email({
			message: 'Email is invalid'
		}),
	password: z.string({ required_error: 'Password is required' }).trim()
});

type Error = {
	email?: [string];
	password?: [string];
	server?: [string];
};
export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');

		const dataToValidate = {
			...(email && { email }),
			...(password && { password })
		};

		try {
			const validatedData = schema.parse(dataToValidate);

			const key = await auth.useKey('email', validatedData.email, validatedData.password);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);

			const user = await fetchUser(key.userId);

			return {
				success: true,
				user
			};
		} catch (error) {
			const toSend = {
				message: 'Oops, something went wrong!',
				errors: {} as Error
			};
			if (error instanceof z.ZodError) {
				const validationErrors = error.flatten().fieldErrors as Error;
				return fail(400, {
					message: 'Validation error',
					errors: validationErrors
				});
			} else if (error instanceof LuciaError) {
				if (error.message === 'AUTH_INVALID_KEY_ID' || error.message === 'AUTH_INVALID_PASSWORD') {
					toSend.errors.server = ['Invalid email or password'];
					return fail(401, toSend);
				}
				return fail(500, toSend);
			} else {
				console.log(typeof error, error);
				return fail(500, toSend);
			}
		}
	}
};
