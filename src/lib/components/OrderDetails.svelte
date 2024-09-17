<script lang="ts">
	import { formatCurrency } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let currentOrder: any;
	export let open: boolean = false;
</script>

{#if open}
	<div class="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen z-50">
		<button on:click={() => dispatch('close')} class="absolute h-full w-full bg-black/30" />
		<div
			in:slide={{ axis: 'x' }}
			out:slide={{ axis: 'x' }}
			class="absolute right-0 h-full bg-white rounded-lg shadow-lg py-2 px-4 overflow-y-auto w-[40vw]"
		>
			<div class="flex justify-between items-center mb-10">
				<h3 class="font-work-sans font-medium text-2xl">Order #{currentOrder.id.slice(15, 25)}</h3>
				<button
					on:click={() => dispatch('close')}
					class="rounded-full text-4xl px-2 py-0.5 text-center"
					><iconify-icon icon="line-md:close-small" /></button
				>
			</div>
			<section>
				<div>
					<h4 class="font-work-sans font-semibold text-lg">Order details</h4>

					<div class="grid grid-cols-1 gap-2 mb-5">
						{#each currentOrder.items as orderItem}
							<div class="flex gap-5 items-center px-2 py-3">
								<figure class="h-44 w-44">
									<img
										class="w-full h-full aspect-auto object-cover"
										src={orderItem.variant.images[0].url}
										alt=""
									/>
								</figure>
								<section class="flex-1 grid grid-cols-1 gap-1">
									<h5 class="text-lg font-work-sans font-semibold">
										{orderItem.variant.product.name}
									</h5>
									<p class="text-xs text-gray-400">
										Variant: <span class="text-black text-sm">{orderItem.variant.name}</span>
									</p>
									<p class="text-xs text-gray-400">
										Qty: <span class="text-black text-sm">{orderItem.quantity}</span>
									</p>
									<div class="text-xs text-gray-400 flex gap-1 items-center">
										<p>Price:</p>
										<p>
											{@html orderItem.variant.discountPrice
												? `<span class="text-black text-sm">${formatCurrency(
														orderItem.variant.discountPrice
												  )}</span> <span class="text-red-500 text-sm line-through">${formatCurrency(
														orderItem.variant.price
												  )}</span>`
												: `<span class="text-black text-sm">${formatCurrency(
														orderItem.variant.price
												  )}</span>`}
										</p>
									</div>
								</section>
							</div>
						{/each}
					</div>

					<div>
						<div class="grid grid-cols-2 bg-gray-50 px-2 pt-3 pb-10">
							<div class="flex flex-col gap-2">
								<h5 class="font-work-sans font-semibold">Recipient</h5>
								<p class="flex flex-col text-sm">
									<span>{currentOrder.firstName} {currentOrder.lastName}</span>
									<span>{currentOrder.phoneNumber}</span>
								</p>
							</div>
							<div class="flex flex-col gap-2">
								<h5 class="font-work-sans font-semibold">Shipping Address</h5>
								<p class="text-sm">{currentOrder.street}</p>
							</div>
						</div>
						<div class="bg-black/5 p-5">
							<h3 class="font-work-sans font-semibold text-2xl mb-5">Summary</h3>
							<div class="flex justify-between mb-2 flex-wrap">
								<span class="text-sm font-medium">Qty:</span>
								<span>{currentOrder.items.length}</span>
							</div>
							<div class="flex justify-between mb-2 flex-wrap">
								<span class="text-sm font-medium">Subtotal:</span>
								<span>{formatCurrency(currentOrder.totalPrice)}</span>
							</div>
							<div class="flex justify-between mb-2 flex-wrap">
								<span class="font-medium text-sm">Shipping:</span>
								<span>{formatCurrency(1000)}</span>
							</div>
							<hr class="my-4 bg-black" />
							<div class="flex justify-between mb-2 flex-wrap">
								<span class="font-semibold">Total: </span>
								<span class="font-semibold">{formatCurrency(currentOrder.totalPrice + 1000)}</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
{/if}
