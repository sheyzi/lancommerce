import prisma from '$lib/server/prisma';
import { Role } from '$lib/types/roles.types';
import type { PageServerLoad } from './$types';

const calculatePercentageDifference = (before: number, current: number) => {
	if (before === 0 && current === 0) {
		// Both periods have zero registrations
		return 0; // or any other value that makes sense in this context
	} else if (before === 0) {
		// No registrations in the previous period
		return 100; // or any other value that represents infinite increase
	} else if (current === 0) {
		// No registrations in the current period
		return -100; // or any other value that represents infinite decrease
	} else {
		// Calculate the percentage difference as usual
		return ((current - before) / before) * 100;
	}
};

export const load = (async () => {
	const products = await prisma.product.findMany({});
	const users = await prisma.user.findMany({
		where: {
			role: {
				not: Role.ADMIN
			},
			createdAt: {
				// Fetch users created in the last 24 hours
				gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
			}
		}
	});

	// Fetch users that registered a day before the last 24 hours (i.e. 48 hours ago)
	// It is to compare the number of users registered in the last 24 hours with the number of users registered in the previous 24 hours
	// For statistical purposes
	// E.g. 10 users registered in the last 24 hours, 5 users registered in the previous 24 hours
	// i.e. 100% increase in the number of users registered in the last 24 hours

	const usersBefore = await prisma.user.findMany({
		where: {
			role: {
				not: Role.ADMIN
			},
			createdAt: {
				gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
				lte: new Date(Date.now() - 24 * 60 * 60 * 1000)
			}
		}
	});

	// Calculate the percentage difference
	let usersPercentageDifference = calculatePercentageDifference(usersBefore.length, users.length);

	return {
		products,
		customers: users,
		customerPercentageDifference: usersPercentageDifference
	};
}) satisfies PageServerLoad;
