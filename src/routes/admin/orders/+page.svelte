<script lang="ts">
	import Tab from '$lib/components/Tab.svelte';
	import { OrderStatus } from '$lib/types/order.type';
	import type { PageData } from './$types';
	import { formatCurrency } from '$lib/utils';
	import OrderDetails from '$lib/components/OrderDetails.svelte';
	import { enhance } from '$app/forms';
	import Selector from '$lib/components/Selector.svelte';
	import { browser } from '$app/environment';

	const tabItems = [
		{ label: 'All', value: 'all' },
		{ label: 'Pending', value: OrderStatus.PENDING },
		{ label: 'Confirmed', value: OrderStatus.CONFIRMED },
		{ label: 'Shipped', value: OrderStatus.SHIPPED },
		{ label: 'Delivered', value: OrderStatus.DELIVERED },
		{ label: 'Cancelled', value: OrderStatus.CANCELLED }
	];

	export let data: PageData;
	const { orders } = data;

	function handleSelectChange(event) {
		if (browser) {
			const form = document.getElementById('statusForm');
			event.preventDefault();
			form.submit();
			console.log(event);
		}
	}

	let currentOrder: any;
	let viewMore: boolean = false;
	const toggleModal = (order) => {
		viewMore = !viewMore;
		currentOrder = order;
	};
</script>

<svelte:head>
	<title>Orders - Evolv</title>
</svelte:head>

<OrderDetails open={viewMore} {currentOrder} on:close={() => (viewMore = false)} />
<div class="w-full grid grid-cols-1 gap-5">
	<Tab {tabItems} />

	<section role="table" class="w-full">
		<table class="w-full table">
			<thead>
				<tr class="font-normal">
					<th class="font-normal">Id</th>
					<th class="font-normal">Recipient</th>
					<th class="font-normal">Product(s)</th>
					<th class="font-normal">Status</th>
					<th class="font-normal">Total</th>
				</tr>
			</thead>
			<tbody class="w-full">
				{#each orders as order}
					<tr>
						<td>#{order.id.slice(15, 21)}</td>
						<td>{order.firstName} {order.lastName}</td>
						<td>
							<div class="avatar-group -space-x-6 rtl:space-x-reverse">
								{#each order.items.slice(0, 2) as item}
									<figure class="avatar">
										<div class="w-8 rounded-full">
											<img
												class="w-full h-full object-cover"
												src={item.variant.images[0].url}
												alt={item.variant.product.name}
											/>
										</div>
									</figure>
								{/each}
								{#if order.items.length > 2}
									<div class="avatar placeholder">
										<div class="w-8 bg-neutral text-neutral-content">
											<span>+{order.items.length - 2}</span>
										</div>
									</div>
								{/if}
							</div>
						</td>
						<td>
							<form
								on:submit|preventDefault={() => console.log('submitted')}
								id="statusForm"
								use:enhance={({}) => {
									console.log('starts');

									return async ({ action, update }) => {
										update();
									};
								}}
								action="?/update-status"
								method="POST"
							>
								<Selector
									options={tabItems.slice(1, 6)}
									value={order.status}
									name="status"
									placeholder="Select status"
								/>
							</form>
						</td>

						<td>{formatCurrency(order.totalPrice)}</td>
						<td class=""
							><button
								on:click={() => toggleModal(order)}
								class="rounded px-3 py-2 bg-eblue text-white">View more</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</div>
