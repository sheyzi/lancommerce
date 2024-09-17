import prisma from '$lib/server/prisma';
import { z } from 'zod';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { uploadMedia } from '$lib/server/upload';
import { generateSlug } from '$lib/utils';

export const load = (async ({ url }) => {
	const slug = url.searchParams.get('slug');

	const categories = await prisma.category.findMany();

	let product = null;

	if (slug) {
		product = await prisma.product.findUnique({
			where: {
				slug
			},
			include: {
				variants: {
					include: {
						images: true
					}
				},
				featuredImage: true,
				category: true
			}
		});
	}

	return {
		product,
		categories
	};
}) satisfies PageServerLoad;

const MAX_FILE_SIZE = 5000000;

const schema = z.object({
	name: z.string({ required_error: 'Name is required' }),
	shortDescription: z.string({ required_error: 'Short description is required' }),
	categoryId: z.string({ required_error: 'Category is required' }).refine(async (id) => {
		const category = await prisma.category.findUnique({
			where: {
				id
			}
		});
		return !!category;
	}, 'Category does not exist'),
	isFeatured: z.boolean().default(false),
	featuredImage: z
		.any()
		.refine((image) => image.size < MAX_FILE_SIZE, 'Image is too large')
		.refine(
			(image) => image.type.startsWith('image/'),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		)
});

const editSchema = z.object({
	name: z.string({ required_error: 'Name is required' }),
	shortDescription: z.string({ required_error: 'Short description is required' }),
	categoryId: z.string({ required_error: 'Category is required' }).refine(async (id) => {
		const category = await prisma.category.findUnique({
			where: {
				id
			}
		});
		return !!category;
	}, 'Category does not exist'),
	isFeatured: z.boolean().default(false),
	featuredImage: z
		.any()
		.optional()
		.refine((image) => image.size < MAX_FILE_SIZE, 'Image is too large')
		.refine((image) => {
			const isNotImage = !image.type.startsWith('image/') || image.size !== 0;

			return isNotImage;
		}, 'Only .jpg, .jpeg, .png and .webp formats are supported.')
});

const variantSchema = z.object({
	variantName: z.string({ required_error: 'Name is required' }),
	variantDescription: z
		.string()
		.min(10, 'Description must be at least 10 characters long')
		.optional(),
	variantPrice: z
		.number({ required_error: 'Price is required' })
		.min(0.01, 'Price must be greater than 0'),
	variantDiscountPrice: z.number().min(0.01, 'Discount price must be greater than 0').optional(),
	variantStock: z
		.number({ required_error: 'Stock is required' })
		.min(1, 'Stock must be greater than 0'),
	variantImages: z.array(
		z
			.any()
			.refine((image) => image.size < MAX_FILE_SIZE, 'Image is too large')
			.refine(
				(image) => image.type.startsWith('image/'),
				'Only .jpg, .jpeg, .png and .webp formats are supported.'
			)
	)
});

const editVariantSchema = z.object({
	variantName: z.string({ required_error: 'Name is required' }),
	variantDescription: z
		.string()
		.min(10, 'Description must be at least 10 characters long')
		.optional(),
	variantPrice: z
		.number({ required_error: 'Price is required' })
		.min(0.01, 'Price must be greater than 0'),
	variantDiscountPrice: z.number().min(0.01, 'Discount price must be greater than 0').optional(),
	variantStock: z
		.number({ required_error: 'Stock is required' })
		.min(1, 'Stock must be greater than 0'),
	variantImages: z.array(
		z
			.any()
			.optional()
			.refine((image) => image.size < MAX_FILE_SIZE, 'Image is too large')
			.refine((image) => {
				const isNotImage = !image.type.startsWith('image/') || image.size !== 0;

				return isNotImage;
			}, 'Only .jpg, .jpeg, .png and .webp formats are supported.')
	)
});

type Error = {
	name?: [string];
	shortDescription?: [string];
	categoryId?: [string];
	isFeatured?: [string];
	featuredImage?: [string];
	server?: [string];
};

type VariantError = {
	name?: [string];
	description?: [string];
	price?: [string];
	discountPrice?: [string];
	stock?: [string];
	images?: [string];
	server?: [string];
};

export const actions: Actions = {
	manage: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('id');
		const name = formData.get('name');
		const shortDescription = formData.get('shortDescription');
		const categoryId = formData.get('categoryId');
		const isFeatured = formData.get('isFeatured') === 'on';
		const featuredImage = formData.get('featuredImage') as File;

		const dataToValidate = {
			...(name && { name }),
			...(shortDescription && { shortDescription }),
			...(categoryId && { categoryId }),
			...(isFeatured && { isFeatured }),
			...(featuredImage && { featuredImage })
		};

		try {
			if (!id) {
				const validatedData = await schema.parseAsync(dataToValidate);
				const imageUrl = await uploadMedia(featuredImage as File);
				let image = await prisma.image.create({
					data: {
						url: imageUrl
					}
				});

				const slug = generateSlug(validatedData.name);

				const { featuredImage: featuredImageId, categoryId, ...rest } = validatedData;

				const product = await prisma.product.create({
					data: {
						...rest,
						category: {
							connect: {
								id: categoryId
							}
						},
						slug,
						featuredImage: {
							connect: {
								id: image.id
							}
						}
					},
					include: {
						featuredImage: true,
						category: true,
						variants: true
					}
				});

				return {
					message: 'Product created successfully',
					product
				};
			} else {
				const validatedData = await editSchema.parseAsync(dataToValidate);

				let newImage = null;

				if (featuredImage?.size > 0) {
					let image = await uploadMedia(featuredImage as File);
					newImage = await prisma.image.create({
						data: {
							url: image
						}
					});
				}

				const { featuredImage: featuredImageId, categoryId, ...rest } = validatedData;

				const product = await prisma.product.update({
					where: {
						id: id.toString()
					},
					data: {
						...rest,
						category: {
							connect: {
								id: categoryId
							}
						},
						...(newImage && {
							featuredImage: {
								connect: {
									id: newImage.id
								}
							}
						})
					},
					include: {
						featuredImage: true,
						category: true,
						variants: true
					}
				});

				return {
					message: 'Product updated successfully',
					product
				};
			}
		} catch (error) {
			let toSend = {
				message: 'There was an error',
				errors: {} as Error
			};

			if (error instanceof z.ZodError) {
				toSend.message = 'There was an error with the form data';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.error(error);
			return fail(500, toSend);
		}
	},
	manageVariant: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('variantId');
		const productId = formData.get('productId');
		const variantName = formData.get('variantName');
		const variantDescription = formData.get('variantDescription');
		const variantPrice = formData.get('variantPrice');
		const variantDiscountPrice = formData.get('variantDiscountPrice');
		const variantStock = formData.get('variantStock');
		const variantImages = formData.getAll('variantImages');

		const dataToValidate = {
			...(variantName && { variantName }),
			...(variantDescription && { variantDescription }),
			...(variantPrice && { variantPrice: Number(variantPrice) }),
			...(variantDiscountPrice && { variantDiscountPrice: Number(variantDiscountPrice) }),
			...(variantStock && { variantStock: Number(variantStock) }),
			...(variantImages && { variantImages })
		};

		try {
			if (id) {
				const validatedData = await editVariantSchema.parse(dataToValidate);

				const { variantImages: images, ...rest } = validatedData;

				let imageUrls: string[] | null = null;

				if (validatedData.variantImages[0].size > 0) {
					imageUrls = [];

					for (const image of images) {
						const imageUrl = await uploadMedia(image as File);
						imageUrls.push(imageUrl);
					}
				}

				const variant = await prisma.variant.findUnique({
					where: {
						id: id as string
					},
					include: {
						images: true
					}
				});

				if (variant) {
					await prisma.variant.update({
						where: {
							id: id as string
						},
						data: {
							name: rest.variantName,
							description: rest.variantDescription,
							price: rest.variantPrice,
							discountPrice: rest.variantDiscountPrice,
							stock: rest.variantStock,
							...(imageUrls && {
								images: {
									createMany: {
										data: imageUrls.map((url) => ({
											url
										}))
									},
									disconnect: [
										...variant.images.map((image) => ({
											id: image.id
										}))
									]
								}
							})
						}
					});
				}

				const product = await prisma.product.findUnique({
					where: {
						id: productId as string
					},
					include: {
						featuredImage: true,
						category: true,
						variants: {
							include: {
								images: true
							}
						}
					}
				});

				return {
					message: 'Variant updated successfully',
					product,
					type: 'edit'
				};
			} else {
				const validatedData = await variantSchema.parse(dataToValidate);

				const { variantImages: images, ...rest } = validatedData;

				let imageUrls = [] as string[];

				for (const image of images) {
					const imageUrl = await uploadMedia(image as File);
					imageUrls.push(imageUrl);
				}

				await prisma.variant.create({
					data: {
						product: {
							connect: {
								id: productId as string
							}
						},
						images: {
							createMany: {
								data: imageUrls.map((url) => ({
									url
								}))
							}
						},
						name: rest.variantName,
						description: rest.variantDescription,
						price: rest.variantPrice,
						discountPrice: rest.variantDiscountPrice,
						stock: rest.variantStock
					}
				});

				const product = await prisma.product.findUnique({
					where: {
						id: productId as string
					},
					include: {
						featuredImage: true,
						category: true,
						variants: {
							include: {
								images: true
							}
						}
					}
				});

				return {
					message: 'Variant created successfully',
					product
				};
			}
		} catch (error) {
			const toSend = {
				message: 'There was an error',
				errors: {} as VariantError
			};

			if (error instanceof z.ZodError) {
				toSend.message = 'There was an error with the form data';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.error(error);
			return fail(500, toSend);
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('variantId');

		try {
			await prisma.variant.delete({
				where: {
					id: id as string
				}
			});

			return {
				message: 'Variant deleted successfully'
			};
		} catch (error) {
			console.error(error);
			return fail(500, {
				message: 'There was an error'
			});
		}
	}
};
