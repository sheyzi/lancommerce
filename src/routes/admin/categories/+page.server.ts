import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { uploadMedia } from '$lib/server/upload';
import prisma from '$lib/server/prisma';
import { generateSlug } from '$lib/utils';

export const load = (async () => {
	const categories = await prisma.category.findMany({
		take: 20,
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			featuredImage: true,
			_count: {
				select: {
					products: true
				}
			}
		}
	});
	return {
		categories
	};
}) satisfies PageServerLoad;

const MAX_FILE_SIZE = 5000000;

const schema = z.object({
	name: z.string({ required_error: 'Category name is required' }).trim(),
	description: z.string({ required_error: 'Category description is required' }).trim(),
	featuredImage: z
		.any()
		.refine((image) => image.size < MAX_FILE_SIZE, 'Image is too large')
		.refine(
			(image) => image.type.startsWith('image/'),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		)
});

const editSchema = z.object({
	name: z.string({ required_error: 'Category name is required' }).trim(),
	description: z.string({ required_error: 'Category description is required' }).trim(),
	featuredImage: z
		.any()
		.optional()
		.refine((image) => image.size < MAX_FILE_SIZE, 'Image is too large')
		.refine((image) => {
			const isNotImage = !image.type.startsWith('image/') || image.size !== 0;

			return isNotImage;
		}, 'Only .jpg, .jpeg, .png and .webp formats are supported.')
});

type Error = {
	name?: [string];
	description?: [string];
	featuredImage?: [string];
	server?: [string];
};

const include = {
	featuredImage: true,
	_count: {
		select: {
			products: true
		}
	}
};

export const actions: Actions = {
	manage: async ({ request }) => {
		const formData = await request.formData();

		const id = formData.get('category-id');
		const featuredImage = formData.get('category-featuredimage');
		const name = formData.get('category-name');
		const description = formData.get('category-description');

		const dataToValidate = {
			...(featuredImage && { featuredImage }),
			...(name && { name }),
			...(description && { description })
		};

		try {
			if (!id) {
				const validatedData = schema.parse(dataToValidate);
				const imageUrl = await uploadMedia(validatedData.featuredImage);

				// Save to database
				const image = await prisma.image.create({
					data: {
						url: imageUrl
					}
				});

				const category = await prisma.category.create({
					data: {
						name: validatedData.name,
						description: validatedData.description,
						slug: generateSlug(validatedData.name),
						featuredImageId: image.id
					},
					include
				});

				return {
					message: 'Success',
					category: category
				};
			} else {
				const validatedData = editSchema.parse(dataToValidate);

				if (validatedData.featuredImage.size > 0) {
					const imageUrl = await uploadMedia(validatedData.featuredImage);

					// Save to database
					const image = await prisma.image.create({
						data: {
							url: imageUrl
						}
					});

					const category = await prisma.category.update({
						where: {
							id: id.toString()
						},
						data: {
							name: validatedData.name,
							description: validatedData.description,
							featuredImageId: image.id
						},
						include
					});

					return {
						message: 'Success',
						type: 'edit',
						category: category
					};
				} else {
					const category = await prisma.category.update({
						where: {
							id: id.toString()
						},
						data: {
							name: validatedData.name,
							description: validatedData.description
						},
						include
					});

					return {
						message: 'Success',
						type: 'edit',
						category: category
					};
				}
			}
		} catch (error) {
			let toSend = {
				message: 'There was an error with your request. Please try again later.',
				errors: {} as Error
			};
			if (error instanceof z.ZodError) {
				const fieldErrors = error.flatten().fieldErrors;
				toSend.errors = fieldErrors;

				return fail(400, toSend);
			}
			console.log(error);
			return fail(500, toSend);
		}
	},
	search: async ({ request }) => {
		const formData = await request.formData();
		let search = formData.get('search');

		if (search) {
			search = search.toString().trim();
		}

		if (search && search.length <= 0) {
			return fail(400, { message: 'Not enough characters to search' });
		} else {
			const cleanedSearch = search?.replace(/\s+/g, ' ').trim();

			const categories = await prisma.category.findMany({
				take: 20,
				orderBy: {
					_relevance: {
						fields: ['name', 'description'],
						search: cleanedSearch ? cleanedSearch.split(' ').join(' & ') : '',
						sort: 'desc'
					}
				},
				include: {
					featuredImage: true,
					_count: {
						select: {
							products: true
						}
					}
				}
			});

			return { categories };
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('category-id');

		if (!id) {
			return fail(400, { message: 'No category id provided' });
		}

		try {
			const category = await prisma.category.delete({
				where: {
					id: id.toString()
				}
			});

			return {
				message: 'Success',
				category
			};
		} catch (error) {
			console.log(error);
			return fail(500, { message: 'There was an error deleting the category' });
		}
	}
};
