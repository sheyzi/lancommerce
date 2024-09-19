import { Prisma } from '@prisma/client';

const categoryWithFeaturedImageAndProductCount = Prisma.validator<Prisma.CategoryFindManyArgs>()({
	include: {
		featuredImage: true,
		_count: {
			select: {
				products: true
			}
		}
	}
});

export type CategoryWithProductCount = Prisma.CategoryGetPayload<
	typeof categoryWithFeaturedImageAndProductCount
>;
