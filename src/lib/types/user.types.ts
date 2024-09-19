import { Prisma } from '@prisma/client';

const userWithRelations = Prisma.validator<Prisma.UserFindManyArgs>()({
	include: {
		orders: {
			include: {
				items: true
			}
		},
		favourites: true
	}
});

export type UserWithRelations = Prisma.UserGetPayload<typeof userWithRelations>;
