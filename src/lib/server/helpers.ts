import type { UserWithRelations } from '../types/user.types';
import prisma from './prisma';

export const fetchUser = async (id: string): Promise<UserWithRelations | null> => {
	const user = await prisma.user.findUnique({
		where: {
			id
		},
		include: {
			orders: {
				include: {
					items: true
				}
			},
			favourites: {
				include: {
					featuredImage: true,
					category: true,
					variants: {
						include: {
							images: true
						}
					}
				}
			}
		}
	});

	return user;
};

export const getShippingFee = async (): Promise<number> => {
	return 1000;
};
