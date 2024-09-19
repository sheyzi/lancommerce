import type { VariantWithRelations } from './products.types';

export interface Item {
	variant: VariantWithRelations;
	quantity: number;
}

export interface CartStore {
	items: Item[];
}
