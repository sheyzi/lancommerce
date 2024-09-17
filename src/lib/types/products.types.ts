import { Prisma } from '@prisma/client';

const productWithRelations = Prisma.validator<Prisma.ProductFindManyArgs>()({
	include: {
		featuredImage: true,
		category: true,
		variants: {
			include: {
				images: true
			}
		},
		_count: {
			select: {
				variants: true
			}
		}
	}
});

const variantWithRelations = Prisma.validator<Prisma.VariantFindManyArgs>()({
	include: {
		images: true,
		product: true
	}
});

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>;
export type VariantWithRelations = Prisma.VariantGetPayload<typeof variantWithRelations>;
