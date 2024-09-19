<script lang="ts">
	import {
		calculateCartLength,
		calculateCartTotal,
		cartStore,
		decreaseQuantity,
		increaseQuantity,
		removeFromCart
	} from '$lib/stores/cart.stores';
	import { formatCurrency, showToastr } from '$lib/utils';
	import type { Address } from '@prisma/client';
	import { currentUser } from '$lib/stores/user.stores';

	let cartTotal = 0;
	let cartLength = 0;

	$: cartLength = calculateCartLength($cartStore);
	$: cartTotal = calculateCartTotal($cartStore);

	let isAddressVisible = false;
	let toEditAddress: Address | null = null;

	const openAddressModal = (address?: Address) => {
		isAddressVisible = true;
		toEditAddress = address ?? null;
	};

	const closeAddressModal = () => {
		isAddressVisible = false;
	};
</script>

<svelte:head>
	<title>Shopping Cart - Evolv</title>
</svelte:head>
<div class="bg-gray-100 min-h-screen py-8">
	{#if cartLength < 1}
		<div class="flex items-center justify-center h-[80vh]">
			<div class="flex flex-col items-center gap-3 p-5 min-w-[50vw]">
				<iconify-icon icon="solar:bag-cross-bold" width="35" />
				<p class="font-medium">Your cart is empty</p>
				<a href="/" class="button-blue bg-black hover:bg-black/80">Shop Now</a>
			</div>
		</div>
	{:else}
		<div class="max-w-7xl mx-auto md:px-10 px-5 my-[60px]">
			<h1 class="text-2xl font-semibold font-work-sans mb-4">Shopping Cart</h1>
			<div class="flex flex-col md:flex-row gap-4">
				<div class="md:w-3/4">
					<div class="bg-white rounded-lg shadow-md p-6 mb-4">
						<table class="hidden md:block border-spacing-5">
							<thead>
								<tr>
									<th class="text-left font-semibold px-4">Product</th>
									<th class="text-left font-semibold px-4">Price</th>
									<th class="text-left font-semibold px-4">Quantity</th>
									<th class="text-left font-semibold px-4">Total</th>
								</tr>
							</thead>
							<tbody>
								{#each $cartStore.items as item}
									<tr>
										<td class="p-4">
											<div class="flex items-center mr-2">
												<figure class="h-12 w-12 lg:h-16 lg:w-16 mr-4">
													<img
														class="w-full object-cover h-full"
														src={item.variant.images[0].url}
														alt={item.variant.name}
													/>
												</figure>
												<span class="font-semibold text-xs lg:text-base line-clamp-2"
													>{item.variant.product.name} ({item.variant.name})</span
												>
											</div>
										</td>
										<td class="p-4"
											>{formatCurrency(item.variant.discountPrice ?? item.variant.price)}</td
										>
										<td class="p-4">
											<div class="flex items-center">
												<button
													on:click={() => decreaseQuantity(item.variant)}
													class="border rounded-md py-2 px-4 mr-2">-</button
												>
												<span class="text-center w-8">{item.quantity}</span>
												<button
													on:click={() => increaseQuantity(item.variant)}
													class="border rounded-md py-2 px-4 ml-2">+</button
												>
											</div>
										</td>
										<td class="p-4"
											>{formatCurrency(
												(item.variant.discountPrice ?? item.variant.price) * item.quantity
											)}</td
										>
									</tr>
								{/each}
								<!-- More product rows -->
							</tbody>
						</table>
						<div class="md:hidden space-y-5">
							{#if cartLength < 1}
								<span class="flex items-center gap-1"
									><p class="font-medium">Your cart is empty</p>
									<iconify-icon icon="solar:bag-cross-bold" width="20" />
								</span>
							{:else}
								{#each $cartStore.items as item}
									<div class="grid grid-cols-6 gap-5 items-start border-b pb-3">
										<div class="col-span-2 h-full w-full">
											<img
												class="w-full object-cover h-full"
												src={item.variant.images[0].url}
												alt={item.variant.name}
											/>
										</div>

										<section class="py-4 flex-1 col-span-4 w-full grid grid-cols-1 gap-3">
											<div class="flex items-start w-full gap-2">
												<p class="font-semibold lg:text-base line-clamp-2">
													{item.variant.product.name} ({item.variant.name})
												</p>
											</div>
											<p class="">
												{formatCurrency(item.variant.discountPrice ?? item.variant.price)}
											</p>

											<section class="flex justify-between items-center">
												<div class="flex items-center">
													<button
														on:click={() => decreaseQuantity(item.variant)}
														class="border rounded-md py-1 px-2 mr-2">-</button
													>
													<span class="text-center w-4">{item.quantity}</span>
													<button
														on:click={() => increaseQuantity(item.variant)}
														class="border rounded-md py-1 px-2 ml-2">+</button
													>
												</div>
												<button on:click={() => removeFromCart(item.variant)} class="text-red-400">
													<iconify-icon icon="material-symbols:delete-rounded" width="20" />
												</button>
											</section>
										</section>

										<!-- <p class="py-4">
										{formatCurrency(
											(item.variant.discountPrice ?? item.variant.price) * item.quantity
										)}
									</p> -->
									</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<div class="md:w-1/3 lg:w-1/4">
					<div class="bg-white text-sm lg:text-base rounded-lg shadow-md p-6">
						<h2 class="text-lg font-semibold mb-4 font-work-sans">Summary</h2>
						<div class="flex justify-between md:gap-2 lg:justify-between mb-2">
							<span>Subtotal</span>
							<span class="line-clamp-1">{formatCurrency(cartTotal)}</span>
						</div>
						<div class="flex justify-between md:gap-2 lg:justify-between mb-2">
							<span>Shipping</span>
							<span>{formatCurrency(1000)}</span>
						</div>
						<hr class="my-2" />
						<div class="flex justify-between mb-2">
							<span class="font-semibold">Total</span>
							<span class="font-semibold">{formatCurrency(cartTotal + 1000)}</span>
						</div>
						{#if cartLength < 1}
							<a href="/" class="bg-black text-sm text-white py-2 px-4 rounded-lg mt-4 w-full btn"
								>Shop Now</a
							>
						{:else if $currentUser}
							<a
								href="/cart/checkout"
								class="bg-black text-sm text-white py-2 px-4 rounded-lg mt-4 w-full btn">Checkout</a
							>
						{:else}
							<a
								href="/auth/login?next=/cart"
								class="bg-black text-sm text-white py-2 px-4 rounded-lg mt-4 w-full btn">Login</a
							>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
