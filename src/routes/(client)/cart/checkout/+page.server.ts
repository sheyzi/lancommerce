import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { z } from 'zod';
import type { CartStore } from '$lib/types/cart.types';
import prisma from '$lib/server/prisma';
import { calculateCartTotal } from '$lib/stores/cart.stores';
import { PRIVATE_PAYSTACK_SECRET_KEY } from '$env/static/private';

import axios from 'axios';
import { getShippingFee } from '../../../../lib/server/helpers';

const schema = z.object({
	firstName: z
		.string({ required_error: 'First name is required' })
		.trim()
		.min(3, { message: 'First name is required' }),
	lastName: z
		.string({ required_error: 'Last name is required' })
		.trim()
		.min(3, { message: 'Last name is required' }),
	phoneNumber: z
		.string({ required_error: 'Phone number is required' })
		.regex(
			/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/,
			{
				message: 'Invalid phone number'
			}
		),
	street: z
		.string({ required_error: 'Street is required' })
		.trim()
		.min(3, { message: 'Street is required' }),
	city: z
		.string({ required_error: 'City is required' })
		.trim()
		.min(3, { message: 'City is required' }),
	state: z
		.string({ required_error: 'State is required' })
		.trim()
		.min(3, { message: 'State is required' }),
	zip: z
		.string({ required_error: 'Zip code is required' })
		.trim()
		.min(3, { message: 'Zip code is required' })
		.optional(),
	country: z
		.string({ required_error: 'Country is required' })
		.trim()
		.min(3, { message: 'Country is required' })
});

type Error = {
	firstName?: [string];
	lastName?: [string];
	phoneNumber?: [string];
	street?: [string];
	city?: [string];
	state?: [string];
	zip?: [string];
	country?: [string];
	server?: [string];
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		redirect(302, '/auth/login?next=/cart/checkout');
	}
};

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const session = await locals.auth.validate();

		if (!session) {
			redirect(302, '/auth/login?next=/cart/checkout');
		}

		const formData = await request.formData();

		const cart: CartStore = JSON.parse(formData.get('cart') as string);
		const firstName = formData.get('first-name');
		const lastName = formData.get('last-name');
		const phoneNumber = formData.get('phone-number');
		const street = formData.get('street-address');
		const city = formData.get('city');
		const state = formData.get('state');
		const zip = formData.get('zip');
		const country = formData.get('country');

		const dataToValidate = {
			...(firstName && { firstName }),
			...(lastName && { lastName }),
			...(phoneNumber && { phoneNumber }),
			...(street && { street }),
			...(city && { city }),
			...(state && { state }),
			...(zip && { zip: zip }),
			...(country && { country })
		};

		try {
			if (cart.items.length === 0) {
				return fail(400, {
					message: 'Cart is empty',
					errors: {
						server: ['Cart is empty']
					}
				});
			}
			const validatedData = schema.parse(dataToValidate);

			if (session) {
				let totalPrice = calculateCartTotal(cart);

				const order = await prisma.order.create({
					data: {
						...validatedData,
						user: {
							connect: {
								id: session.user.userId
							}
						},
						totalPrice
					}
				});

				cart.items.forEach(async (item) => {
					await prisma.orderItem.create({
						data: {
							quantity: item.quantity,
							variant: {
								connect: {
									id: item.variant.id
								}
							},
							order: {
								connect: {
									id: order.id
								}
							}
						}
					});
				});

				let shippingFee = await getShippingFee();
				let amountToPay = (totalPrice + shippingFee) * 100;
				let paymentReference = `order-${order.id}-${Date.now()}`;

				let data = {
					reference: paymentReference,
					amount: amountToPay,
					email: session.user.email,
					callback_url: `${url.origin}/cart/checkout/success`
				};

				let headers = {
					Authorization: `Bearer ${PRIVATE_PAYSTACK_SECRET_KEY}`,
					'Content-Type': 'application/json'
				};

				let response = await axios.post('https://api.paystack.co/transaction/initialize', data, {
					headers
				});
				let responseData = response.data;

				if (responseData.status === false) {
					return fail(400, {
						message: 'Oops! Something went wrong',
						errors: {
							server: ['Oops! Something went wrong']
						}
					});
				}

				await prisma.order.update({
					where: {
						id: order.id
					},
					data: {
						paymentRef: responseData.data.reference
					}
				});

				const orderWithItems = await prisma.order.findUnique({
					where: {
						id: order.id
					},
					include: {
						items: {
							include: {
								variant: {
									include: {
										product: true
									}
								}
							}
						}
					}
				});

				return {
					order: orderWithItems,
					payment_url: responseData.data.authorization_url,
					message: 'Order created successfully'
				};
			}
		} catch (error) {
			let toSend = {
				message: 'Oops! Something went wrong',
				errors: {} as Error
			};

			if (error instanceof z.ZodError) {
				toSend.message = 'Invalid data';
				toSend.errors = error.flatten().fieldErrors;

				return fail(400, toSend);
			}

			console.log(error);
			return fail(500, toSend);
		}
	}
};
