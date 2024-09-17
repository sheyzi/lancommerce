import { fail, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import { auth } from '$lib/server/lucia';
import { Role } from '$lib/types/roles.types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { fetchUser } from '$lib/server/helpers';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

const schema = z
	.object({
		email: z
			.string({
				required_error: 'Email is required'
			})
			.email({
				message: 'Email is invalid'
			}),
		password: z
			.string({ required_error: 'Password is required' })
			.trim()
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
				message: `Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number`
			}),
		confirmPassword: z.string({ required_error: 'Confirm password is required' }).trim()
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});

type Error = {
	email?: [string];
	password?: [string];
	confirmPassword?: [string];
	server?: [string];
};
export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		const dataToValidate = {
			...(email && { email }),
			...(password && { password }),
			...(confirmPassword && { confirmPassword })
		};

		try {
			const validatedData = schema.parse(dataToValidate);

			const user = await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: validatedData.email.toLowerCase(),
					password: validatedData.password
				},
				attributes: {
					email: validatedData.email,
					role: Role.USER
				}
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});

			locals.auth.setSession(session);

			const fetchedUser = await fetchUser(user.userId);

			return {
				success: true,
				user: fetchedUser
			};
		} catch (e) {
			let toSend = {
				message: 'Oops, something went wrong!',
				errors: {} as Error
			};
			if (e instanceof z.ZodError) {
				const validationErrors = e.flatten().fieldErrors as Error;
				return fail(400, {
					message: 'Validation error',
					errors: validationErrors
				});
			} else if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					toSend.errors.server = ['User with this email already exists'];
					return fail(409, toSend);
				}
				return fail(500, toSend);
			} else {
				return fail(500, toSend);
			}
		}
		return {
			success: true
		};
	}
};
