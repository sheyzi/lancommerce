<script lang="ts">
	import { currentUser } from '$lib/stores/user.stores';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { formatCurrency, showToastr } from '$lib/utils';
	import { enhance } from '$app/forms';
	import AccordionComponent from '$lib/components/AccordionComponent.svelte';
	import OrderItem from '$lib/components/OrderItem.svelte';

	export let data: PageData;
	export let form;

	const { orders } = data;

	let profileEditable = false;
	let loading: boolean = false;
	let currentTab: string = 'account';
	// toggle between tabs
	const toggleTab = (tab: string) => {
		currentTab = tab;
	};
	const toggleEdit = () => {
		profileEditable = !profileEditable;
		if (profileEditable) {
			showToastr('You can now edit your profile', 'info');
		} else {
			showToastr('Editable mode off!', 'info');
		}
	};

	const manageProfile: SubmitFunction = () => {
		loading = true;

		return async ({ result, update }) => {
			try {
				if (result.status === 200) {
					currentUser.set(result.data.profile);

					showToastr('Profile updated successfully', 'success');
					profileEditable = false;
				} else if (result.status === 500) {
					result.data.errors.server.forEach((error) => {
						showToastr(error, 'error');
					});
				}
			} finally {
				loading = false;
				update({ reset: false });
			}
		};
	};
</script>

<svelte:head>
	<title>Account - Evolv</title>
</svelte:head>

<div class="min-w-screen min-h-screen md:flex">
	<aside class="md:h-screen md:w-fit sticky md:top-0 bg-white py-11">
		<nav class="h-full min-w-[230px] grid grid-cols-1">
			<ol class="list-none h-full w-full flex flex-col space-y-7 justify-center items-center">
				<button
					on:click={() => toggleTab('account')}
					class="flex items-center justify-center hover:active hover:border-l-8 hover:border-eblue w-full py-2.5 transition-all px-5"
					class:active={currentTab === 'account'}
					class:border-l-8={currentTab === 'account'}
					class:border-eblue={currentTab === 'account'}
				>
					<span class="w-full text-xl text-start font-universo font-medium">Account</span>
				</button>
				<button
					on:click={() => toggleTab('order-history')}
					class="flex items-center justify-center w-full hover:active hover:border-l-8 hover:border-elightpurple py-2.5 transition-all px-5"
					class:active={currentTab === 'order-history'}
					class:border-l-8={currentTab === 'order-history'}
					class:border-elightpurple={currentTab === 'order-history'}
				>
					<span class="w-full text-xl text-start font-universo font-medium">Order History</span>
				</button>
				<li class="flex items-center justify-center w-full py-2.5 transition-all px-5">
					<form class="w-full text-xl font-universo" action="">
						<button>Logout</button>
					</form>
				</li>
			</ol>
		</nav>
	</aside>
	<section
		class="relative w-full p-10 max-h-screen bg-[white] overflow-y-scroll px-3 {currentTab ===
			'order-history' && ''}"
	>
		{#if currentTab === 'account'}
			<section class="grid">
				<div class="mb-16 flex w-full justify-between items-center">
					<div>
						<h1 class="text-3xl font-work-sans font-medium mb-1">Personal Details</h1>
						<p class="text-xs text-black/50">Edit and update your profile</p>
					</div>
					<button
						on:click={toggleEdit}
						class="py-3 flex items-center gap-1 px-5 rounded-md font-work-sans font-medium bg-black text-white"
					>
						<span class=" font-medium">Edit</span>
						<iconify-icon
							width="18"
							icon="streamline:interface-edit-write-1-edit-edition-form-pen-text-write"
						/>
					</button>
				</div>
				<div>
					<form
						use:enhance={manageProfile}
						class="grid grid-cols-1 space-y-5"
						action="?/manage-profile"
						method="post"
					>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="form-control md:col-span-2 mb-5 gap-1.5">
								<label class="text-md font-medium" for="email"> Email Address </label>
								<input
									class="py-5 px-4 border-black/80 border-[0.5px]"
									type="email"
									value={$currentUser?.email}
									placeholder="e.g  johndoe@gmail.com"
									name="email"
									id="email"
									disabled={!profileEditable}
								/>
								{#if form?.errors?.email}
									{#each form.errors.email as error}
										<p class="form-error">{error}</p>
									{/each}
								{:else}
									<p class="form-help">
										We will deliver your purchase receipt and other updates to this address
									</p>
								{/if}
							</div>
							<div class="form-control gap-1.5">
								<label class="text-md font-medium" for="firstName"> First Name </label>
								<input
									class="py-5 px-4 border-black/80 border-[0.5px]"
									type="text"
									value={$currentUser?.firstName}
									placeholder="e.g  John"
									name="firstName"
									id="firstName"
									disabled={!profileEditable}
								/>

								{#if form?.errors.firstName}
									{#each form.errors.firstName as error}
										<p class="form-error">{error}</p>
									{/each}
								{/if}
							</div>
							<div class="form-control gap-1.5">
								<label class="text-md font-medium" for="lastName"> Last Name </label>
								<input
									class="py-5 px-4 border-black/80 border-[0.5px]"
									type="text"
									value={$currentUser?.lastName}
									placeholder="e.g  Doe"
									name="lastName"
									id="lastName"
									disabled={!profileEditable}
								/>
								{#if form?.errors.lastName}
									{#each form.errors.lastName as error}
										<p class="form-error">{error}</p>
									{/each}
								{/if}
							</div>
						</div>
						<div class="flex items-center justify-center">
							<button
								disabled={!profileEditable}
								type="submit"
								class="bg-egreen py-3 px-20 rounded-md uppercase font-medium"
							>
								{#if loading}
									<iconify-icon
										class="text-center"
										width="20"
										icon="eos-icons:three-dots-loading"
									/>
								{:else}
									Save
								{/if}
							</button>
						</div>
					</form>
				</div>
			</section>
		{:else if currentTab === 'order-history'}
			<div class="h-full">
				<div class="mb-16 grid grid-cols-1 w-full">
					<h1 class="text-3xl font-work-sans font-medium mb-1">Order History</h1>
					<p class="text-xs text-black/50">Check order status and manage recent orders</p>
				</div>
				<section class="grid grid-cols-1 gap-5">
					{#if orders && orders.length > 0}
						<div class="w-full flex justify-between px-5 font-semibold">
							<p class="">Order Tag</p>
							<p>Date</p>
							<p>More</p>
						</div>
						<div class="grid grid-cols-1 gap-10 pb-5">
							{#each orders as order}
								<AccordionComponent date={order.createdAt} title={order.id}>
									<h3 class="font-work-sans font-semibold text-3xl mb-2">Cart</h3>
									<div class="carousel gap-6 max-w-full py-2">
										{#each order.items as orderItem}
											<OrderItem {order} {orderItem} />

											<!-- <h3>{orderItem.variant.name}</h3> -->
										{/each}
									</div>

									<div>
										<h3 class="font-work-sans font-semibold text-3xl mb-5">Billing Info</h3>
										<div class="grid grid-cols-2 gap-">
											<div class="flex flex-col gap-4">
												<h4 class="font-work-sans font-semibold">Recipient</h4>
												<p class="flex flex-col">
													<span>{order.firstName} {order.lastName}</span>
													<span>{order.phoneNumber}</span>
												</p>
											</div>
											<div class="flex flex-col gap-4">
												<h4 class="font-work-sans font-semibold">Shipping Address</h4>
												<p>{order.street}</p>
											</div>
										</div>
									</div>

									<div slot="footer" class="bg-black/5 p-5">
										<h3 class="font-work-sans font-semibold text-3xl mb-5">Summary</h3>
										<div class="flex justify-between mb-2 flex-wrap">
											<span>Quantity:</span>
											<span>{order.items.length}</span>
										</div>
										<div class="flex justify-between mb-2 flex-wrap">
											<span>Subtotal:</span>
											<span>{formatCurrency(order.totalPrice)}</span>
										</div>
										<div class="flex justify-between mb-2 flex-wrap">
											<span class="font-medium">Shipping:</span>
											<span>{formatCurrency(data.shippingFee)}</span>
										</div>
										<hr class="my-4 bg-black" />
										<div class="flex justify-between mb-2 flex-wrap">
											<span class="font-semibold">Total: </span>
											<span class="font-semibold">{formatCurrency(order.totalPrice + 1000)}</span>
										</div>
									</div>
								</AccordionComponent>
							{/each}
						</div>
					{:else}
						<p class="flex flex-col items-center justify-center gap-1 mt-5">
							<iconify-icon width="50" icon="pepicons-print:cart-off" />
							<span class="text-2xl">No orders placed yet!</span>
						</p>
					{/if}
				</section>
			</div>
		{/if}
	</section>
</div>
