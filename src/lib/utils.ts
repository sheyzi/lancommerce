import toast from 'svelte-french-toast';
import slugify from 'slugify';
// import { OrderStatus } from './types/order.type';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | undefined | null;

export const showToastr = (message: string, type: ToastType) => {
	if (message) {
		if (type === 'success') {
			toast(message, {
				style: 'background: #8fef98; color: #06111F;',
				position: 'bottom-right'
			});
		} else if (type === 'error') {
			toast(message, {
				style: 'background: #ef8f8f; color: #ed3434;',
				position: 'bottom-right'
			});
		} else if (type === 'warning') {
			toast(message, {
				style: 'background: #fff3cd; color: #fbbf24;',
				position: 'bottom-right'
			});
		} else if (type === 'info') {
			// Blue background with white text
			toast(message, {
				style: 'background: #bab6b6; color: #111111;',
				position: 'bottom-right'
			});
		} else {
			toast(message, {
				style: 'background: #bab6b6; color: #111111;',
				position: 'bottom-right'
			});
		}
	}
};

export const generateSlug = (name: string) => {
	return (
		slugify(name, {
			lower: true,
			strict: true
		}) +
		'-' +
		Math.floor(Math.random() * 1000000)
	);
};

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN'
	})
		.format(amount)
		.replace('NGN', '₦');
};

export const getStatusClass = (status: string) => {
	switch (status) {
		case 'CANCELLED':
			return 'text-red-500';
		case 'PENDING':
			return 'text-yellow-500';
		case 'DELIVERED':
			return 'text-green-700';
		case 'CONFIRMED':
			return 'text-green-500';
		case 'SHIPPED':
			return 'text-eblue';
		default:
			return 'text-black';
	}
};
