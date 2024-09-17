<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminModal from '$lib/components/AdminModal.svelte';
	import CustomerDetails from '$lib/components/CustomerDetails.svelte';
	import { showToastr } from '$lib/utils.js';
	import Time from 'svelte-time';
	export let data;

	let { users } = data;

	let showUserDetails: boolean = false;
	let userToDisplay: any;

	const toggleDetails = (user: any) => {
		userToDisplay = user;
		showUserDetails = !showUserDetails;
	};

	let showDeleteModal = false;
	let toDelete: any = null;

	const openDeleteModal = (user) => {
		toDelete = user;
		showDeleteModal = true;
	};

	const closeDeleteModal = () => {
		showDeleteModal = false;
		toDelete = null;
	};

	let deleting = false;
</script>

<svelte:head>
	<title>Customers - Evolv</title>
</svelte:head>

<CustomerDetails
	open={showUserDetails}
	currentUser={userToDisplay}
	on:close={() => (showUserDetails = false)}
/>
<AdminModal
	on:close={closeDeleteModal}
	visible={showDeleteModal}
	title="Delete {toDelete?.firstName
		? `${toDelete.firstName} ${toDelete.lastName}`
		: toDelete?.email}"
>
	<div class="flex flex-col gap-5 mt-5">
		<p class="text-sm">Are you sure you want to delete this product?</p>
		<form
			method="post"
			action="?/delete"
			class="flex gap-2"
			use:enhance={() => {
				deleting = true;
				return async ({ result, update }) => {
					try {
						if (result.status === 200) {
							users = users.filter((order) => order.id !== toDelete?.id);
							showToastr('User deleted successfully!', 'success');
							closeDeleteModal();
						} else if (result.status === 500) {
							showToastr('Ooops! Something went wrong. Please try again later.', 'error');
						}
					} finally {
						deleting = false;
						update({ reset: false });
					}
				};
			}}
		>
			<input type="text" name="id" value={toDelete?.id} class="hidden" />
			<button class="button-blue w-full" on:click={closeDeleteModal} type="button">Cancel</button>
			<button class="button-blue bg-red-500 hover:bg-red-700 w-full">
				{@html deleting
					? '<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading"></iconify-icon>'
					: 'Delete'}
			</button>
		</form>
	</div>
</AdminModal>
<section role="table" class="w-full">
	<table class="w-full table">
		<thead>
			<tr class="font-normal">
				<th class="font-normal">Id</th>
				<th class="font-normal">Name/email</th>
				<th class="font-normal">Role</th>
				<th class="font-normal">Orders</th>
				<th class="font-normal">Favourite(s)</th>
				<th class="font-normal">Joined</th>
				<th class="font-normal">Actions</th>
			</tr>
		</thead>
		<tbody class="w-full">
			{#each users as user}
				<tr>
					<td>#{user.id}</td>
					<td> {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</td>
					<td> {user.role}</td>
					<td> {user.orders.length}</td>
					<td>{user.favourites.length}</td>
					<td> <Time timestamp={user.createdAt} /> </td>
					<td
						class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex gap-2 items-center"
					>
						<!-- <button class="text-yellow-600" on:click={() => openEditModal(category)}> -->
						<button on:click={() => toggleDetails(user)} class="text-yellow-600">
							<iconify-icon icon="fa:edit" width="20" />
							<!-- <iconify-icon icon="iconamoon:edit-light" width="20" /> -->
						</button>
						<button on:click={() => openDeleteModal(user)} class="text-red-600">
							<!-- <button class="text-red-600"> -->
							<iconify-icon icon="iconamoon:trash-light" width="20" />
						</button>
					</td>
					<!-- <td>
							<div class="avatar-group -space-x-6 rtl:space-x-reverse">
								{#each user.items.slice(0, 2) as item}
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
								{#if user.items.length > 2}
									<div class="avatar placeholder">
										<div class="w-8 bg-neutral text-neutral-content">
											<span>+{user.items.length - 2}</span>
										</div>
									</div>
								{/if}
							</div>
						</td> -->
					<!-- <td>
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
								value={user.status}
								name="status"
								placeholder="Select status"
								on:statusChanged={(e) => {
									// console.log(e);

									handleSelectChange(e);
									// if (e.detail.preventDefault) {
									// 	e.preventDefault();
									// }
								}}
							/>
						</form>
					</td> -->

					<!-- <td>{formatCurrency(user.totalPrice)}</td>
						<td class=""
							><button
								on:click={() => toggleModal(user)}
								class="rounded px-3 py-2 bg-eblue text-white">View more</button
							></td
						> -->
				</tr>
			{/each}
		</tbody>
	</table>
</section>
