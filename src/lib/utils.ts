import { toast } from 'svelte-sonner';
import slugify from 'slugify';
// import { OrderStatus } from './types/order.type';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | undefined | null;

export const showToastr = (message: string, type: ToastType) => {
	if (message) {
		switch (type) {
			case 'success':
				toast.success(message);
				break;
			case 'error':
				toast.error(message);
				break;
			case 'warning':
				toast.warning(message);
				break;
			case 'info':
				toast.info(message);
				break;
			default:
				toast(message);
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
