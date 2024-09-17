<script lang="ts">
	import { OrderStatus } from '../types/order.type';
	import type { orderWithItems } from '../types/order.type';
	import { formatCurrency, getStatusClass } from '../utils';

	export let orderItem: any;
	export let order: any;

	let tooltip: string = '';

	$: {
		switch (order.status) {
			case OrderStatus.PENDING:
				tooltip = 'Your order is pending';
				break;
			case OrderStatus.CONFIRMED:
				tooltip = 'Your order has been confirmed, it will be shipped soon';
				break;
			case OrderStatus.SHIPPED:
				tooltip = 'Your order has been shipped, it will be delivered soon';
				break;
			case OrderStatus.DELIVERED:
				tooltip = 'Your order has been delivered';
				break;
			case OrderStatus.CANCELLED:
				tooltip = 'Your order has been cancelled';
				break;
			default:
				tooltip = 'Your order is pending';
				break;
		}
	}
</script>

<div class="grid grid-cols-1 carousel-item bg-white shadow rounded-md">
	<figure class=" max-h-[200px] relative w-full rounded-t-md overflow-hidden">
		<div
			class="badge {orderItem.variant.product.category?.name === 'Jeans'
				? 'badge-primary text-black'
				: 'badge-ghost'} absolute right-3 top-4"
		>
			{orderItem.variant.product.category?.name}
		</div>
		<img
			class="w-full aspect-square h-full object-cover"
			src={orderItem.variant.images[0].url}
			alt={orderItem.variant.product.name}
		/>
	</figure>
	<div class=" pb-8 pt-1 px-2 grid grid-cols-1 gap-2">
		<div class="flex justify-between">
			<h2 class="line-clamp-1 text-lg font-work-sans text-black font-medium">
				{orderItem.quantity} x {orderItem.variant.product.name}({orderItem.variant.name})
			</h2>
		</div>

		<div class="flex justify-between items-center w-full group">
			<p class="flex items-center gap-1 relative {getStatusClass(order.status)}">
				<span class="capitalize text-xs font-semibold">{order.status}</span>
				{#if order.status === OrderStatus.PENDING}
					<iconify-icon icon="material-symbols:pending-outline" />
				{:else if order.status === OrderStatus.CONFIRMED}
					<iconify-icon icon="pepicons-pencil:checkmark-outlined" />
				{:else if order.status === OrderStatus.DELIVERED}
					<iconify-icon icon="mdi:truck-check-outline" />
				{:else if order.status === OrderStatus.SHIPPED}
					<iconify-icon icon="mdi:truck-check-outline" />
				{:else if order.status === OrderStatus.CANCELLED}
					<iconify-icon icon="material-symbols:cancel-outline" />
				{/if}
			</p>
			<p class="text-sm font-medium">
				{orderItem.variant.discountPrice
					? formatCurrency(orderItem.variant.discountPrice)
					: formatCurrency(orderItem.variant.price)}
			</p>
		</div>
		<div class="mt-2">
			<p class="text-xs text-black/50">{tooltip}</p>
		</div>
		<!-- <div class="card-actions j">
													<div class="">Qty: </div>
												</div> -->
	</div>
</div>
