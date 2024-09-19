import { writable } from 'svelte/store';
import type { CartStore } from '../types/cart.types';
import type { VariantWithRelations } from '../types/products.types';
import { browser } from '$app/environment';

export const cartStore = writable<CartStore>({
	items: []
});

export const initializeCart = () => {
	if (browser) {
		const cart = localStorage.getItem('cart');
		if (cart) {
			cartStore.set(JSON.parse(cart));
		}
	}
};

export const saveCart = (cart: CartStore) => {
	if (browser) {
		localStorage.setItem('cart', JSON.stringify(cart));
	}
};

export const addToCart = (variant: VariantWithRelations, quantity: number) => {
	cartStore.update((formerCart) => {
		const itemIndex = formerCart.items.findIndex((item) => item.variant.id === variant.id);

		// Increase the quantity of the item if it already exists in the cart
		if (itemIndex === -1) {
			let newItems = [...formerCart.items];
			newItems.push({ variant, quantity });
			const newCart = { items: newItems };
			saveCart(newCart);
			return newCart;
		}

		let newItems = [...formerCart.items];
		newItems[itemIndex].quantity += quantity;
		const newCart = { items: newItems };
		saveCart(newCart);
		return newCart;
	});
};

export const increaseQuantity = (variant: VariantWithRelations) => {
	cartStore.update((formerCart) => {
		const itemIndex = formerCart.items.findIndex((item) => item.variant.id === variant.id);

		if (itemIndex === -1) {
			return formerCart;
		}

		let newItems = [...formerCart.items];
		newItems[itemIndex].quantity += 1;
		const newCart = { items: newItems };
		saveCart(newCart);
		return newCart;
	});
};

export const decreaseQuantity = (variant: VariantWithRelations) => {
	cartStore.update((formerCart) => {
		const itemIndex = formerCart.items.findIndex((item) => item.variant.id === variant.id);

		if (itemIndex === -1) {
			return formerCart;
		}

		let newItems = [...formerCart.items];

		if (newItems[itemIndex].quantity > 1) {
			newItems[itemIndex].quantity -= 1;
		} else {
			newItems = newItems.filter((item) => item.variant.id !== variant.id);
		}

		const newCart = { items: newItems };

		saveCart(newCart);
		return newCart;
	});
};

export const removeFromCart = (variant: VariantWithRelations) => {
	cartStore.update((formerCart) => {
		const itemIndex = formerCart.items.findIndex((item) => item.variant.id === variant.id);

		if (itemIndex === -1) {
			return formerCart;
		}

		let newItems = formerCart.items.filter((item) => item.variant.id !== variant.id);

		const newCart = { items: newItems };
		saveCart(newCart);
		return newCart;
	});
};

export const calculateCartLength = (cart: CartStore) => {
	return cart.items.reduce((acc, item) => acc + item.quantity, 0);
};

export const calculateCartTotal = (cart: CartStore) => {
	return cart.items.reduce(
		(acc, item) => acc + item.quantity * (item.variant.discountPrice ?? item.variant.price),
		0
	);
};
