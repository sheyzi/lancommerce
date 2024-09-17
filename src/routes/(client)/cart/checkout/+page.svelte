<script lang="ts">
	import { formatCurrency, showToastr } from '$lib/utils';
	import { calculateCartTotal, cartStore } from '$lib/stores/cart.stores';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { LoaderIcon } from 'svelte-french-toast';
	let cartTotal: number = 0;

	$: cartTotal = calculateCartTotal($cartStore);

	export let data: PageData;
	export let form;

	let loading = false;
	let paymentProcessing = false;
</script>

<svelte:head>
	<title>Checkout Cart - Evolv</title>
</svelte:head>

{#if paymentProcessing}
	<LoaderIcon />
{/if}

<div class="bg-gray-100 min-h-screen py-8">
	<div class="max-w-7xl mx-auto md:px-10 px-5 my-[60px]" role="contentinfo">
		<h1 class="text-2xl font-medium font-work-sans mb-4">Complete your purchase</h1>
		<form
			class="flex flex-col md:flex-row gap-4"
			action=""
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					try {
						if (result.status === 200) {
							localStorage.removeItem('cart');
							cartStore.set({ items: [] });

							let url = result.data.payment_url;
							paymentProcessing = true;
							window.location.href = url;
						} else if (result.data.errors.server) {
							result.data.errors.server.forEach((error) => {
								showToastr(error, 'error');
							});
						}
					} finally {
						loading = false;
						update();
					}
				};
			}}
		>
			<input type="text" hidden value={JSON.stringify($cartStore)} name="cart" />
			<div class="md:w-3/4">
				<div class="bg-white rounded-lg shadow-md p-6 mb-4">
					<div class="grid grid-cols-1 gap-5">
						<section class="grid grid-cols-1">
							<h2 class="font-work-sans mb-4 font-medium text-xl">Contact details</h2>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="form-control">
									<label class="form-label" for="first-name">First name</label>
									<input
										class="form-input"
										type="text"
										placeholder="e.g John"
										name="first-name"
										id="first-name"
									/>
									{#if form?.errors?.firstName}
										{#each form.errors.firstName as error}
											<p class="form-error">{error}</p>
										{/each}
									{/if}
								</div>
								<div class="form-control">
									<label class="form-label" for="last-name">Last name</label>
									<input
										class="form-input"
										type="text"
										placeholder="e.g Doe"
										name="last-name"
										id="last-name"
									/>
									{#if form?.errors?.lastName}
										{#each form.errors.lastName as error}
											<p class="form-error">{error}</p>
										{/each}
									{/if}
								</div>
								<div class="form-control">
									<label class="form-label" for="phone-number">Phone number</label>
									<input
										class="form-input"
										placeholder="e.g +234 000 000 0000 "
										type="telephone"
										name="phone-number"
										id="phone-number"
									/>
									{#if form?.errors?.phoneNumber}
										{#each form.errors.phoneNumber as error}
											<p class="form-error">{error}</p>
										{/each}
									{:else}
										<p class="form-help">We will use this incase of any query</p>
									{/if}
								</div>
							</div>
						</section>
						<section class="grid grid-cols-1">
							<h2 class="font-work-sans mb-4 font-medium text-xl">Shipping details</h2>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="form-control md:col-span-2">
									<label class="form-label" for="street-address"> Street address </label>
									<input
										class="form-input"
										type="text"
										placeholder="e.g 21 Downing Street, Somewhere"
										name="street-address"
										id="street-address"
									/>
									{#if form?.errors?.street}
										{#each form.errors.street as error}
											<p class="form-error">{error}</p>
										{/each}
									{:else}
										<p class="form-help">We will deliver your purchase to this address</p>
									{/if}
								</div>
								<div class="form-control">
									<label class="form-label" for="city">City</label>
									<input
										class="form-input"
										type="text"
										placeholder="e.g Lagos"
										name="city"
										id="city"
									/>
									{#if form?.errors?.city}
										{#each form.errors.city as error}
											<p class="form-error">{error}</p>
										{/each}
									{/if}
								</div>
								<div class="form-control">
									<label class="form-label" for="state">State</label>
									<input
										class="form-input"
										type="text"
										placeholder="e.g Lagos"
										name="state"
										id="state"
									/>
									{#if form?.errors?.state}
										{#each form.errors.state as error}
											<p class="form-error">{error}</p>
										{/each}
									{/if}
								</div>
								<div class="form-control">
									<label class="form-label" for="country">Country</label>
									<input
										class="form-input"
										placeholder="e.g Nigeria "
										type="text"
										name="country"
										id="country"
									/>
									{#if form?.errors?.country}
										{#each form.errors.country as error}
											<p class="form-error">{error}</p>
										{/each}
									{/if}
								</div>
								<div class="form-control">
									<label class="form-label" for="zip">Zip code(optional)</label>
									<input
										class="form-input"
										placeholder="e.g 104101"
										type="number"
										name="zip"
										id="zip"
									/>
									{#if form?.errors?.zip}
										{#each form.errors.zip as error}
											<p class="form-error">{error}</p>
										{/each}
									{/if}
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
			<div class="md:w-1/4">
				<div class="bg-white rounded-lg shadow-md p-6">
					<h2 class="text-lg font-semibold mb-4 font-work-sans">Summary</h2>
					<div class="flex justify-between mb-2 flex-wrap">
						<span>Subtotal:</span>
						<span>{formatCurrency(cartTotal)}</span>
					</div>
					<div class="flex justify-between mb-2 flex-wrap">
						<span class="font-medium">Shipping:</span>
						<span>{formatCurrency(1000)}</span>
					</div>
					<hr class="my-2" />
					<div class="flex justify-between mb-2 flex-wrap">
						<span class="font-semibold">Total: </span>
						<span class="font-semibold">{formatCurrency(cartTotal + 1000)}</span>
					</div>
					<button type="submit" class="bg-black text-white py-2 px-4 rounded-lg mt-4 w-full btn">
						Pay
						{#if loading}
							<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading" />
						{:else}
							<iconify-icon width="20" icon="material-symbols:wallet" />
						{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
</div>
