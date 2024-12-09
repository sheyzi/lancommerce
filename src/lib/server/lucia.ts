import { lucia } from 'lucia';
import { prisma as adapter } from '@lucia-auth/adapter-prisma';
import prisma from './prisma';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import * as argon from 'argon2';

export const auth = lucia({
	adapter: adapter(prisma, {
		user: 'user',
		session: 'session',
		key: 'key'
	}),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (user) => ({
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		role: user.role
	}),
	passwordHash: {
		generate(password) {
			return argon.hash(password);
		},
		validate(password, hash) {
			return argon.verify(hash, password);
		}
	}
});

export type Auth = typeof auth;
