<script lang="ts">
	import { formatCurrency, getStatusClass } from '$lib/utils';
	import { OrderStatus } from '$lib/types/order.type';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import AccordionComponent from './AccordionComponent.svelte';
	import OrderItem from './OrderItem.svelte';

	const dispatch = createEventDispatcher();

	export let currentUser: any;
	// console.log(currentUser.orders);

	const getTooltip = (status: OrderStatus) => {
		switch (status) {
			case OrderStatus.PENDING:
				return ' Order is pending.';
				break;
			case OrderStatus.CONFIRMED:
				return 'Order has been confirmed, prepare to ship.';
				break;
			case OrderStatus.SHIPPED:
				return ' The order has been shipped.';
				break;
			case OrderStatus.DELIVERED:
				return 'The order has been delivered.';
				break;
			case OrderStatus.CANCELLED:
				return 'This order has been cancelled.';
				break;
			default:
				return 'This order is pending.';
				break;
		}
	};

	export let open: boolean = false;
</script>

{#if open}
	<div class="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen z-50">
		<button on:click={() => dispatch('close')} class="absolute h-full w-full bg-black/30" />
		<div
			in:slide={{ axis: 'x' }}
			out:slide={{ axis: 'x' }}
			class="absolute right-0 h-full bg-white rounded-lg shadow-lg py-2 px-4 overflow-y-auto w-[30vw]"
		>
			<div class="flex justify-between items-center mb-10">
				<h3 class="font-work-sans font-medium text-2xl">User Details</h3>
				<button
					on:click={() => dispatch('close')}
					class="rounded-full text-4xl px-2 py-0.5 text-center"
					><iconify-icon icon="line-md:close-small" /></button
				>
			</div>
			<section class="grid grid-cols-1 gap-10">
				<div>
					<h4 class="font-work-sans text-center text-2xl">
						{currentUser.firstName
							? `${currentUser.firstName} ${currentUser.lastName}`
							: currentUser.email}
					</h4>
					<p class="text-center mt-1 font-semibold">{currentUser.role}</p>
				</div>

				<div class="grid grid-cols-1 gap-2">
					<h4 class="text-xl font-medium font-work-sans">Order history</h4>

					<section
						class={currentUser.orders.length > 0
							? 'grid grid-cols-1 space-y-5'
							: 'flex items-center justify-center w-full h-full'}
					>
						{#if currentUser.orders.length > 0}
							{#each currentUser.orders as order}
								<AccordionComponent date={order.createdAt} title={order.id}>
									<h3 class="font-work-sans font-semibold text-xl mb-1">Cart</h3>
									<div class="carousel carousel-center max-w-md p-2 space-x-4">
										{#each order.items as orderItem}
											<div
												class="grid grid-cols-1 {order.items.length > 0
													? 'w-[80%]'
													: 'w-full'} carousel-item bg-white shadow rounded-md"
											>
												<figure class=" max-h-[150px] relative w-full rounded-t-md overflow-hidden">
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
														<h2 class="line-clamp-1 font-work-sans text-black font-medium">
															{orderItem.quantity} x {orderItem.variant.product.name}({orderItem
																.variant.name})
														</h2>
													</div>

													<div class="flex justify-between items-center w-full group">
														<p
															class="flex items-center gap-1 relative {getStatusClass(
																order.status
															)}"
														>
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
														<p class="text-xs text-black/50">{getTooltip(order.status)}</p>
													</div>
													<!-- <div class="card-actions j">
													<div class="">Qty: </div>
												</div> -->
												</div>
											</div>
										{/each}
									</div>

									<div>
										<h3 class="font-work-sans font-semibold text-xl mb-5">Billing Info</h3>
										<div class="grid grid-cols-2 gap-">
											<div class="flex flex-col gap-4 text-sm">
												<h4 class="font-work-sans font-semibold">Recipient</h4>
												<p class="flex flex-col">
													<span>{order.firstName} {order.lastName}</span>
													<span>{order.phoneNumber}</span>
												</p>
											</div>
											<div class="flex flex-col gap-4 text-sm">
												<h4 class="font-work-sans font-semibold">Shipping Address</h4>
												<p>{order.street}</p>
											</div>
										</div>
									</div>

									<div slot="footer" class="bg-black/5 p-5">
										<h3 class="font-work-sans font-semibold text-xl mb-5">Summary</h3>
										<div class="flex justify-between mb-2 flex-wrap text-sm">
											<span>Quantity:</span>
											<span>{order.items.length}</span>
										</div>
										<div class="flex justify-between mb-2 flex-wrap text-sm">
											<span>Subtotal:</span>
											<span>{formatCurrency(order.totalPrice)}</span>
										</div>
										<div class="flex justify-between mb-2 flex-wrap text-sm">
											<span class="font-medium">Shipping:</span>
											<span>{formatCurrency(1000)}</span>
										</div>
										<hr class="my-4 bg-black" />
										<div class="flex justify-between mb-2 flex-wrap text-sm">
											<span class="font-semibold">Total: </span>
											<span class="font-semibold">{formatCurrency(order.totalPrice + 1000)}</span>
										</div>
									</div>
								</AccordionComponent>
							{/each}
						{:else}
							<p class="flex flex-col items-center justify-center gap-1 mt-5">
								<iconify-icon width="50" icon="pepicons-print:cart-off" />
								<span class="text-2xl">No orders placed yet!</span>
							</p>
						{/if}
					</section>
				</div>
			</section>
		</div>
	</div>
{/if}
