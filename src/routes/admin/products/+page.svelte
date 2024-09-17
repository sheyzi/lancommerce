<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminModal from '../../../lib/components/AdminModal.svelte';
	import type { ProductWithRelations } from '../../../lib/types/products.types';
	import { showToastr } from '../../../lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;

	let products = data.products;

	let previewImage: string;

	let showModal: boolean = false;
	let toEdit: ProductWithRelations | null = null;

	let openModal = (product?: ProductWithRelations) => {
		if (product) toEdit = product;
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	let searchLoading = false;
	let loading = false;

	let showDeleteModal = false;
	let toDelete: ProductWithRelations | null = null;

	const openDeleteModal = (product: ProductWithRelations) => {
		toDelete = product;
		showDeleteModal = true;
	};

	const closeDeleteModal = () => {
		showDeleteModal = false;
		toDelete = null;
	};

	let deleting = false;

	// $: {
	// 	console.log(products);
	// }
</script>

<svelte:head>
	<title>Products - Evolv</title>
</svelte:head>

<div class="flex justify-between items-center">
	<h2>Products</h2>
	<div>
		<a href="/admin/products/manage" class="button-blue">Add Product</a>
	</div>
</div>

<AdminModal on:close={closeDeleteModal} visible={showDeleteModal} title="Delete {toDelete?.name}">
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
							products = products.filter((product) => product.id !== toDelete?.id);
							showToastr('Product deleted successfully!', 'success');
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

<div class="shadow mt-[30px] rounded overflow-hidden">
	<form
		class="p-5"
		action="?/search"
		method="post"
		use:enhance={() => {
			searchLoading = true;
			return async ({ result, update }) => {
				try {
					if (result.status === 200) {
						products = result.data?.products;
					}
				} finally {
					searchLoading = false;
					update({ reset: false });
				}
			};
		}}
	>
		<div class="w-full flex items-center gap-2 rounded border px-2">
			<input
				name="search"
				type="text"
				class="w-full py-2 focus:outline-none rounded"
				placeholder="Search Products..."
			/>
			<button class="button-blue rounded h-full text-white">
				{#if searchLoading}
					<iconify-icon class="text-center" width="20" icon="eos-icons:three-dots-loading" />
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314Z"
						/></svg
					>
				{/if}
			</button>
		</div>
	</form>

	<div class="flex flex-col">
		<div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
				<div class="overflow-hidden">
					<table class="min-w-full">
						<thead class="bg-white border-b">
							<tr>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Image
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Name
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Slug
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Category
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Variants
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Featured
								</th>
								<th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{#each products as product}
								<tr class="bg-white border-b">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-28">
										<img
											src={product.featuredImage.url}
											alt=""
											class="object-cover w-full"
											style="aspect-ratio: 16/8;"
										/>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										<a href="/admin/products/manage?slug={product.slug}">
											{product.name}
										</a>
									</td>
									<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
										{product.slug}
									</td>
									<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
										{product.category?.name}
									</td>
									<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
										{product._count.variants}
									</td>
									<td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
										{#if product.isFeatured}
											<iconify-icon
												icon="icon-park-outline:dot"
												width="30"
												class="text-green-900"
											/>
										{:else}
											<iconify-icon icon="octicon:dot-24" width="30" />
										{/if}
									</td>
									<td
										class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex gap-2 items-center"
									>
										<!-- <button class="text-yellow-600" on:click={() => openEditModal(category)}> -->
										<a href="/admin/products/manage?slug={product.slug}" class="text-yellow-600">
											<iconify-icon icon="fa:edit" width="20" />
											<!-- <iconify-icon icon="iconamoon:edit-light" width="20" /> -->
										</a>
										<button class="text-red-600" on:click={() => openDeleteModal(product)}>
											<!-- <button class="text-red-600"> -->
											<iconify-icon icon="iconamoon:trash-light" width="20" />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
