import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import axios from 'axios';
import { PRIVATE_PAYSTACK_SECRET_KEY } from '$env/static/private';
import { getShippingFee } from '../../../../../lib/server/helpers';

export const load = (async ({ url }) => {
	const trxRef = url.searchParams.get('trxref');
	if (!trxRef) {
		throw redirect(302, '/cart');
	}

	const order = await prisma.order.findUnique({
		where: {
			paymentRef: trxRef
		},
		include: {
			items: true
		}
	});

	if (!order) {
		throw redirect(302, '/cart?message=Invalid transaction reference');
	}

	// if (order.status !== 'PENDING') {
	// 	throw redirect(302, '/cart?message=Invalid transaction reference');
	// }

	const endpoint = `https://api.paystack.co/transaction/verify/${trxRef}`;
	const headers = {
		Authorization: `Bearer ${PRIVATE_PAYSTACK_SECRET_KEY}`
	};

	const response = await axios.get(endpoint, { headers });
	const responseData = response.data;

	let shippingFee = await getShippingFee();

	if (responseData.data.status === false) {
		throw redirect(302, '/cart?message=Invalid transaction reference');
	}

	if (responseData.data.amount / 100 !== order.totalPrice + shippingFee) {
		throw redirect(302, '/cart?message=Invalid transaction reference');
	}

	// Update order status
	await prisma.order.update({
		where: {
			id: order.id
		},
		data: {
			status: 'CONFIRMED'
		}
	});

	// Reduce product stock
	for (const item of order.items) {
		await prisma.variant.update({
			where: {
				id: item.variantId
			},
			data: {
				stock: {
					decrement: item.quantity
				}
			}
		});
	}

	//TODO: Send order confirmation email

	return {
		order
	};
}) satisfies PageServerLoad;
